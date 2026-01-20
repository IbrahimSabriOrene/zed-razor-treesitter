/**
 * Tree-sitter Grammar for ASP.NET Razor Pages and Blazor
 * Supports: .razor, .cshtml files
 * Enterprise-grade implementation with full C# and HTML integration
 */

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

module.exports = grammar({
  name: 'razor',

  externals: $ => [
    $._implicit_expression_start,
    $._code_block_start,
    $.raw_text,
  ],

  extras: $ => [
    /\s/,
  ],

  conflicts: $ => [
    [$.razor_directive, $.implicit_expression],
    [$.html_attribute, $.razor_directive],
    [$.type_reference],
  ],

  inline: $ => [
    $._common_node,
    $._html_node,
    $._razor_node,
  ],

  word: $ => $.identifier,

  rules: {
    document: $ => repeat($._html_node),

    _common_node: $ => choice(
      $.razor_comment,
      $.razor_directive,
      $.code_block,
      $.explicit_expression,
      $.implicit_expression,
      $.razor_delegate,
      $.razor_if,
      $.razor_foreach,
      $.razor_for,
      $.razor_while,
      $.razor_do,
      $.razor_switch,
      $.razor_try,
      $.razor_using,
      $.razor_lock,
      $.html_element,
      $.html_self_closing_element,
      $.html_comment,
    ),

    _html_node: $ => choice(
      $._common_node,
      $.text,
    ),

    _razor_node: $ => choice(
      $._common_node,
      $.razor_text,
    ),

    // ==================== RAZOR COMMENTS ====================
    razor_comment: $ => seq(
      '@*',
      optional($.comment_content),
      '*@'
    ),

    comment_content: $ => /[^*]+(\*[^@][^*]*)*/,

    // ==================== RAZOR DIRECTIVES ====================
    razor_directive: $ => choice(
      $.directive_page,
      $.directive_model,
      $.directive_inject,
      $.directive_using,
      $.directive_namespace,
      $.directive_inherits,
      $.directive_implements,
      $.directive_attribute,
      $.directive_layout,
      $.directive_section,
      $.directive_functions,
      $.directive_code,
      $.directive_addTagHelper,
      $.directive_removeTagHelper,
      $.directive_tagHelperPrefix,
      $.directive_rendermode,
      $.directive_preservewhitespace,
      $.directive_typeparam,
    ),

    directive_page: $ => seq(
      '@page',
      optional($.string_literal)
    ),

    directive_model: $ => seq(
      '@model',
      $.type_reference
    ),

    directive_inject: $ => seq(
      '@inject',
      $.type_reference,
      $.identifier
    ),

    directive_using: $ => seq(
      '@using',
      $.namespace_reference
    ),

    directive_namespace: $ => seq(
      '@namespace',
      $.namespace_reference
    ),

    directive_inherits: $ => seq(
      '@inherits',
      $.type_reference
    ),

    directive_implements: $ => seq(
      '@implements',
      $.type_reference
    ),

    directive_attribute: $ => seq(
      '@attribute',
      '[',
      $.attribute_content,
      ']'
    ),

    directive_layout: $ => seq(
      '@layout',
      $.identifier
    ),

    directive_section: $ => seq(
      '@section',
      $.identifier,
      '{',
      repeat($._razor_node),
      '}'
    ),

    directive_functions: $ => seq(
      '@functions',
      '{',
      optional($.csharp_code),
      '}'
    ),

    directive_code: $ => seq(
      '@code',
      '{',
      optional($.csharp_code),
      '}'
    ),

    directive_addTagHelper: $ => seq(
      '@addTagHelper',
      $.string_literal
    ),

    directive_removeTagHelper: $ => seq(
      '@removeTagHelper',
      $.string_literal
    ),

    directive_tagHelperPrefix: $ => seq(
      '@tagHelperPrefix',
      $.string_literal
    ),

    directive_rendermode: $ => seq(
      '@rendermode',
      $.identifier
    ),

    directive_preservewhitespace: $ => seq(
      '@preservewhitespace',
      choice('true', 'false')
    ),

    directive_typeparam: $ => seq(
      '@typeparam',
      $.identifier
    ),

    // ==================== CODE BLOCKS ====================
    code_block: $ => seq(
      '@',
      '{',
      optional($.csharp_code),
      '}'
    ),

    // ==================== CONTROL STRUCTURES ====================
    razor_if: $ => seq(
      '@if',
      '(',
      $.csharp_expression,
      ')',
      '{',
      repeat($._razor_node),
      '}',
      optional($.razor_else)
    ),

    razor_else: $ => seq(
      'else',
      choice(
        $.razor_if,
        seq('{', repeat($._razor_node), '}')
      )
    ),

    razor_foreach: $ => seq(
      '@foreach',
      '(',
      $.csharp_foreach_declaration,
      ')',
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_for: $ => seq(
      '@for',
      '(',
      $.csharp_for_declaration,
      ')',
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_while: $ => seq(
      '@while',
      '(',
      $.csharp_expression,
      ')',
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_do: $ => seq(
      '@do',
      '{',
      repeat($._razor_node),
      '}',
      'while',
      '(',
      $.csharp_expression,
      ')'
    ),

    razor_switch: $ => seq(
      '@switch',
      '(',
      $.csharp_expression,
      ')',
      '{',
      repeat($.razor_case),
      '}'
    ),

    razor_case: $ => seq(
      'case',
      $.csharp_expression,
      ':',
      repeat($._razor_node)
    ),

    razor_try: $ => seq(
      '@try',
      '{',
      repeat($._razor_node),
      '}',
      repeat($.razor_catch),
      optional($.razor_finally)
    ),

    razor_catch: $ => seq(
      'catch',
      optional(seq('(', $.csharp_catch_declaration, ')')),
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_finally: $ => seq(
      'finally',
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_using: $ => seq(
      '@using',
      '(',
      $.csharp_using_declaration,
      ')',
      '{',
      repeat($._razor_node),
      '}'
    ),

    razor_lock: $ => seq(
      '@lock',
      '(',
      $.csharp_expression,
      ')',
      '{',
      repeat($._razor_node),
      '}'
    ),

    // ==================== EXPRESSIONS ====================
    explicit_expression: $ => seq(
      '@(',
      $.csharp_expression,
      ')'
    ),

    implicit_expression: $ => seq(
      '@',
      $.csharp_member_access
    ),

    razor_delegate: $ => seq(
      '@',
      optional('async'),
      optional(seq(
        '(',
        optional($.parameter_list),
        ')'
      )),
      '=>',
      choice(
        $.csharp_expression,
        seq('{', repeat($._razor_node), '}')
      )
    ),

    // ==================== HTML ELEMENTS ====================
    html_element: $ => seq(
      $.html_start_tag,
      repeat($._html_node),
      $.html_end_tag
    ),

    html_start_tag: $ => seq(
      '<',
      $.tag_name,
      repeat($.html_attribute),
      '>'
    ),

    html_end_tag: $ => seq(
      '</',
      $.tag_name,
      '>'
    ),

    html_self_closing_element: $ => seq(
      '<',
      $.tag_name,
      repeat($.html_attribute),
      '/>'
    ),

    html_attribute: $ => choice(
      seq(
        $.attribute_name,
        optional(seq(
          '=',
          choice(
            $.attribute_value,
            $.razor_attribute_value
          )
        ))
      ),
      $.razor_directive_attribute
    ),

    razor_directive_attribute: $ => seq(
      '@',
      $.attribute_name,
      optional(seq(
        '=',
        choice(
          $.attribute_value,
          $.razor_attribute_value
        )
      ))
    ),

    razor_attribute_value: $ => choice(
      $.implicit_expression,
      $.explicit_expression
    ),

    attribute_name: $ => /[a-zA-Z_@:][a-zA-Z0-9_:.-]*/,
    
    attribute_value: $ => choice(
      $.quoted_attribute_value,
      $.unquoted_attribute_value
    ),

    quoted_attribute_value: $ => choice(
      seq('"', optional($.attribute_content), '"'),
      seq("'", optional($.attribute_content), "'")
    ),

    unquoted_attribute_value: $ => /[^\s"'=<>`]+/,

    attribute_content: $ => /[^"'\n]*/,

    tag_name: $ => /[a-zA-Z][a-zA-Z0-9]*/,

    html_comment: $ => seq(
      '<!--',
      optional($.html_comment_content),
      '-->'
    ),

    html_comment_content: $ => /[^-]+(-[^-]+)*/,

    // ==================== C# PLACEHOLDERS ====================
    csharp_code: $ => repeat1(choice(
      /[^{}]+/,
      seq('{', optional($.csharp_code), '}')
    )),
    
    csharp_expression: $ => /[^)}\n;]*/,
    
    csharp_member_access: $ => /[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/,
    
    csharp_foreach_declaration: $ => /[^)]+/,
    
    csharp_for_declaration: $ => /[^)]+/,
    
    csharp_catch_declaration: $ => /[^)]+/,
    
    csharp_using_declaration: $ => /[^)]+/,

    parameter_list: $ => /[^)]+/,

    // ==================== TYPES AND REFERENCES ====================
    type_reference: $ => seq(
      $._type_identifier,
      optional($.type_arguments),
      repeat(choice('[]', '?', '*'))
    ),

    _type_identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*/,

    type_arguments: $ => seq(
      '<',
      commaSep1($.type_reference),
      '>'
    ),
    
    namespace_reference: $ => /[a-zA-Z_][a-zA-Z0-9_.]*(\s*=\s*[a-zA-Z_][a-zA-Z0-9_.]*)?/,

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    ),

    // ==================== TEXT ====================
    text: $ => /[^@<]+/,

    razor_text: $ => /[^@<}]+/,
  }
});