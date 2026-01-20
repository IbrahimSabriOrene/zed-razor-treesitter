/**
 * External Scanner for Razor Tree-sitter Grammar
 * Handles context-sensitive parsing for Razor syntax
 */

#include <tree_sitter/parser.h>
#include <wctype.h>
#include <string.h>

enum TokenType {
  IMPLICIT_EXPRESSION_START,
  CODE_BLOCK_START,
  RAW_TEXT,
};

typedef struct {
  int32_t depth;
  bool in_code_block;
  bool in_expression;
} Scanner;

void *tree_sitter_razor_external_scanner_create() {
  Scanner *scanner = calloc(1, sizeof(Scanner));
  scanner->depth = 0;
  scanner->in_code_block = false;
  scanner->in_expression = false;
  return scanner;
}

void tree_sitter_razor_external_scanner_destroy(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  free(scanner);
}

unsigned tree_sitter_razor_external_scanner_serialize(void *payload, char *buffer) {
  Scanner *scanner = (Scanner *)payload;
  buffer[0] = (char)scanner->depth;
  buffer[1] = (char)scanner->in_code_block;
  buffer[2] = (char)scanner->in_expression;
  return 3;
}

void tree_sitter_razor_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  if (length > 0) {
    scanner->depth = (int32_t)buffer[0];
    scanner->in_code_block = (bool)buffer[1];
    scanner->in_expression = (bool)buffer[2];
  } else {
    scanner->depth = 0;
    scanner->in_code_block = false;
    scanner->in_expression = false;
  }
}

static void advance(TSLexer *lexer) {
  lexer->advance(lexer, false);
}

static void skip(TSLexer *lexer) {
  lexer->advance(lexer, true);
}

static bool is_identifier_start(int32_t c) {
  return (c >= 'a' && c <= 'z') || 
         (c >= 'A' && c <= 'Z') || 
         c == '_';
}

static bool is_identifier_char(int32_t c) {
  return is_identifier_start(c) || 
         (c >= '0' && c <= '9');
}

static bool scan_implicit_expression(TSLexer *lexer) {
  // After @, check if this is the start of an implicit expression
  if (lexer->lookahead == '@') {
    return false; // @@ is an escaped @
  }
  
  if (lexer->lookahead == '(' || 
      lexer->lookahead == '{' || 
      lexer->lookahead == '*') {
    return false; // These start other constructs
  }

  // Check for keywords that start directives
  const char *keywords[] = {
    "page", "model", "inject", "using", "namespace",
    "inherits", "implements", "attribute", "layout",
    "section", "functions", "code", "addTagHelper",
    "removeTagHelper", "tagHelperPrefix", "rendermode",
    "preservewhitespace", "typeparam",
    "if", "else", "foreach", "for", "while", "do",
    "switch", "case", "try", "catch", "finally", "lock"
  };

  // Save current position
  int32_t first_char = lexer->lookahead;
  
  if (!is_identifier_start(first_char)) {
    return false;
  }

  // Read the identifier
  char buffer[256];
  int i = 0;
  buffer[i++] = first_char;
  advance(lexer);

  while (is_identifier_char(lexer->lookahead) && i < 255) {
    buffer[i++] = lexer->lookahead;
    advance(lexer);
  }
  buffer[i] = '\0';

  // Check if it's a directive keyword
  for (size_t j = 0; j < sizeof(keywords) / sizeof(keywords[0]); j++) {
    if (strcmp(buffer, keywords[j]) == 0) {
      return false; // It's a directive, not an implicit expression
    }
  }

  // It's an implicit expression
  lexer->mark_end(lexer);
  return true;
}

static bool scan_code_block_start(TSLexer *lexer) {
  // After @, check if { follows
  while (iswspace(lexer->lookahead)) {
    skip(lexer);
  }
  
  if (lexer->lookahead == '{') {
    advance(lexer);
    lexer->mark_end(lexer);
    return true;
  }
  
  return false;
}

static bool scan_raw_text(TSLexer *lexer, Scanner *scanner) {
  bool has_content = false;
  
  while (true) {
    // Stop at @ or < which might start Razor or HTML
    if (lexer->lookahead == '@' || lexer->lookahead == '<') {
      break;
    }
    
    // Stop at end of file
    if (lexer->lookahead == 0) {
      break;
    }
    
    // Stop at } if we're in a code block
    if (scanner->in_code_block && lexer->lookahead == '}') {
      break;
    }
    
    has_content = true;
    advance(lexer);
  }
  
  if (has_content) {
    lexer->mark_end(lexer);
    return true;
  }
  
  return false;
}

bool tree_sitter_razor_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;

  // Skip whitespace for certain tokens
  if (valid_symbols[IMPLICIT_EXPRESSION_START] || 
      valid_symbols[CODE_BLOCK_START]) {
    while (iswspace(lexer->lookahead)) {
      skip(lexer);
    }
  }

  // Check for implicit expression start
  if (valid_symbols[IMPLICIT_EXPRESSION_START]) {
    if (lexer->lookahead == '@') {
      advance(lexer);
      if (scan_implicit_expression(lexer)) {
        lexer->result_symbol = IMPLICIT_EXPRESSION_START;
        return true;
      }
    }
  }

  // Check for code block start
  if (valid_symbols[CODE_BLOCK_START]) {
    if (scan_code_block_start(lexer)) {
      scanner->in_code_block = true;
      scanner->depth++;
      lexer->result_symbol = CODE_BLOCK_START;
      return true;
    }
  }

  // Check for raw text
  if (valid_symbols[RAW_TEXT]) {
    if (scan_raw_text(lexer, scanner)) {
      lexer->result_symbol = RAW_TEXT;
      return true;
    }
  }

  return false;
}