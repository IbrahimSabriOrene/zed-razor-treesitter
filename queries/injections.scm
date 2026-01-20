; ==================== C# CODE INJECTION ====================
; Inject C# syntax highlighting into code blocks and expressions

; Code blocks
((csharp_code) @injection.content
  (#set! injection.language "c_sharp"))

; Explicit expressions
((csharp_expression) @injection.content
  (#set! injection.language "c_sharp"))

; Member access expressions
((csharp_member_access) @injection.content
  (#set! injection.language "c_sharp"))

; Control structure conditions
((razor_if
  (csharp_expression) @injection.content)
  (#set! injection.language "c_sharp"))

((razor_while
  (csharp_expression) @injection.content)
  (#set! injection.language "c_sharp"))

((razor_do
  (csharp_expression) @injection.content)
  (#set! injection.language "c_sharp"))

((razor_switch
  (csharp_expression) @injection.content)
  (#set! injection.language "c_sharp"))

; Loop declarations
((csharp_foreach_declaration) @injection.content
  (#set! injection.language "c_sharp"))

((csharp_for_declaration) @injection.content
  (#set! injection.language "c_sharp"))

; Exception handling
((csharp_catch_declaration) @injection.content
  (#set! injection.language "c_sharp"))

((csharp_using_declaration) @injection.content
  (#set! injection.language "c_sharp"))

; Parameter lists
((parameter_list) @injection.content
  (#set! injection.language "c_sharp"))

; ==================== CSS INJECTION ====================
; Inject CSS into style tags
((html_element
  (html_start_tag
    (tag_name) @_tag_name)
  (#eq? @_tag_name "style"))
  @injection.content
  (#set! injection.language "css"))

; ==================== JAVASCRIPT INJECTION ====================
; Inject JavaScript into script tags
((html_element
  (html_start_tag
    (tag_name) @_tag_name)
  (#eq? @_tag_name "script"))
  @injection.content
  (#set! injection.language "javascript"))