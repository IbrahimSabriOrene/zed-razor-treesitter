; ==================== RAZOR COMMENTS ====================
(razor_comment) @comment.block
(comment_content) @comment.block

; ==================== RAZOR DIRECTIVES ====================
; Directive keywords
[
  "@page"
  "@model"
  "@inject"
  "@using"
  "@namespace"
  "@inherits"
  "@implements"
  "@attribute"
  "@layout"
  "@section"
  "@functions"
  "@code"
  "@addTagHelper"
  "@removeTagHelper"
  "@tagHelperPrefix"
  "@rendermode"
  "@preservewhitespace"
  "@typeparam"
] @keyword.directive

; Directive-specific highlighting
(directive_page
  (string_literal) @string)

(directive_model
  (type_reference) @type)

(directive_inject
  (type_reference) @type
  (identifier) @variable)

(directive_using
  (namespace_reference) @namespace)

(directive_namespace
  (namespace_reference) @namespace)

(directive_inherits
  (type_reference) @type)

(directive_implements
  (type_reference) @type)

(directive_layout
  (identifier) @type)

(directive_section
  (identifier) @function)

(directive_attribute
  (attribute_content) @attribute)

(directive_addTagHelper
  (string_literal) @string)

(directive_removeTagHelper
  (string_literal) @string)

(directive_tagHelperPrefix
  (string_literal) @string)

(directive_rendermode
  (identifier) @constant)

(directive_typeparam
  (identifier) @type.parameter)

; ==================== CONTROL STRUCTURES ====================
[
  "@if"
  "@foreach"
  "@for"
  "@while"
  "@do"
  "@switch"
  "@try"
  "@using"
  "@lock"
] @keyword.control

"else" @keyword.control
"case" @keyword.control
"catch" @keyword.control
"finally" @keyword.control
"while" @keyword.control

; ==================== CODE BLOCKS ====================
(code_block
  "{" @punctuation.bracket
  "}" @punctuation.bracket)

(directive_functions
  "{" @punctuation.bracket
  (csharp_code) @embedded
  "}" @punctuation.bracket)

(directive_code
  "{" @punctuation.bracket
  (csharp_code) @embedded
  "}" @punctuation.bracket)

(csharp_code) @embedded

; ==================== EXPRESSIONS ====================
(explicit_expression
  "@(" @operator
  (csharp_expression) @embedded
  ")" @punctuation.bracket)

(implicit_expression
  "@" @operator
  (csharp_member_access) @variable.member)

; Delegate expressions
(razor_delegate
  "@" @operator
  "async" @keyword
  "=>" @operator)

(parameter_list) @variable.parameter

; ==================== HTML ELEMENTS ====================
; Tags
(html_start_tag
  "<" @punctuation.bracket
  (tag_name) @tag
  ">" @punctuation.bracket)

(html_end_tag
  "</" @punctuation.bracket
  (tag_name) @tag
  ">" @punctuation.bracket)

(html_self_closing_element
  "<" @punctuation.bracket
  (tag_name) @tag
  "/>" @punctuation.bracket)

; Special tag names (Blazor components)
(tag_name) @tag.component
  (#match? @tag.component "^[A-Z]")

; Attributes
(html_attribute
  (attribute_name) @attribute)

(razor_directive_attribute
  "@" @operator
  (attribute_name) @attribute)

(attribute_value) @string

(quoted_attribute_value
  ["\"" "'"] @punctuation.delimiter)

; Razor attribute values
(razor_attribute_value
  (implicit_expression) @embedded)

(razor_attribute_value
  (explicit_expression) @embedded)

; HTML Comments
(html_comment
  "<!--" @comment
  (html_comment_content) @comment
  "-->" @comment)

; ==================== C# EMBEDDED CODE ====================
(csharp_expression) @embedded
(csharp_member_access) @variable.member
(csharp_foreach_declaration) @embedded
(csharp_for_declaration) @embedded
(csharp_catch_declaration) @embedded
(csharp_using_declaration) @embedded

; ==================== TYPES AND IDENTIFIERS ====================
(type_reference) @type
(namespace_reference) @namespace
(identifier) @variable

; ==================== LITERALS ====================
(string_literal) @string
["\"" "'"] @punctuation.delimiter

; ==================== OPERATORS AND PUNCTUATION ====================
"@" @operator
"=" @operator
":" @punctuation.delimiter

[
  "{"
  "}"
  "("
  ")"
  "["
  "]"
] @punctuation.bracket

[
  "<"
  ">"
  "</"
  "/>"
] @punctuation.bracket

; ==================== SPECIAL ATTRIBUTES (Blazor-specific) ====================
; Event handlers
(attribute_name) @attribute.event
  (#match? @attribute.event "^@on")

; Two-way binding
(attribute_name) @attribute.binding
  (#match? @attribute.binding "^@bind")

; Directives
(attribute_name) @attribute.directive
  (#match? @attribute.directive "^@(ref|key|attributes)")

; Parameters
(attribute_name) @attribute.parameter
  (#match? @attribute.parameter "^[A-Z]")

; ==================== TEXT CONTENT ====================
(text) @text

; ==================== BOOLEAN LITERALS ====================
[
  "true"
  "false"
] @constant.builtin.boolean