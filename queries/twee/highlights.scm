; Headings
(name) @title
(tag)  @attribute
"::" @punctuation.special

; Links
(link (label) @string.special.url)
(link (dest)  @string.special.url)
(image_link (dest) @string.special.url)
(separator) @punctuation.delimiter
"[[" @punctuation.bracket
"]]" @punctuation.bracket
"[img[" @punctuation.bracket

; Macros
(macro "<<" @punctuation.special)
(macro ">>" @punctuation.special)
(macro "/"  @punctuation.special)
(macro_name) @function.macro

; Variables — discriminated by sigil
((variable) @variable.builtin (#match? @variable.builtin "^\\$"))
((variable) @variable          (#match? @variable          "^_"))
((variable) @constant          (#match? @variable          "^\\?"))

; Macro argument tokens
(string)     @string
(number)     @number
(keyword_op) @keyword.operator

; HTML — tag_name includes the leading "<" or "</"
(tag_name) @tag
(html_tag ">" @tag)
(attributes)  @attribute

; Comments
(comment) @comment

; JSON (coarse; future: inject source.json)
(json)        @embedded
(inline_json) @embedded
