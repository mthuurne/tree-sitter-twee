module.exports = grammar({
  name: "twee",

  extras: $ => [/[ \t]/],

  rules: {
    story: $ => seq(
      repeat("\n"),
      repeat(seq(
        $.passage,
        repeat("\n")
      ))
    ),

    passage: $ => seq(
      $.heading,
      optional($._body)
    ),

    _body: $ => choice(
      $.json,
      $.prose
    ),

    prose: $ => prec.right(seq(
      repeat1($._prose_part),
      repeat(seq("\n", repeat($._prose_part)))
    )),

    _prose_part: $ => choice(
      $.comment,
      $.macro,
      $._style,
      $.image_link,
      $.link,
      alias($.naked_variable, $.variable),
      $.html_tag,
      $.plain_text
    ),

    heading: $ => seq(
      token.immediate("::"),
      $.name,
      optional($.tags),
      optional($.inline_json),
      "\n"
    ),

    _style: $ => choice(
      $.emphasis,
      $.strong,
      $.underline,
      $.strikethrough,
      $.superscript,
      $.subscript,
    ),
    emphasis: $ => prec.left(seq("//", repeat($._prose_part), "//")),
    strong: $ => prec.left(seq("''", repeat($._prose_part), "''")),
    underline: $ => prec.left(seq("__", repeat($._prose_part), "__")),
    strikethrough: $ => prec.left(seq("==", repeat($._prose_part), "==")),
    superscript: $ => prec.left(seq("^^", repeat($._prose_part), "^^")),
    subscript: $ => prec.left(seq("~~", repeat($._prose_part), "~~")),

    link: $ => seq(
      "[[",
      choice(
        $.dest,
        seq($.label, $.separator, $.dest),
        seq($.dest, alias($.separator_reverse, $.separator), $.label),
      ),
      "]]"
    ),

    image_link: $ => seq(
      "[img[",
      $.dest,
      "]]"
    ),

    tags: $ => seq(
      "\[",
      repeat($.tag),
      "\]"
    ),

    json: $ => seq(
      token(seq(repeat("\n"), "{")),
      $._json_part,
      "}"
    ),

    _json_part: $ => repeat1(choice(
      /[^{}]+/,
      seq("{", $._json_part, "}")
    )),

    inline_json: $ => seq(
      "{",
      $._inline_json_part,
      "}"
    ),

    _inline_json_part: $ => repeat1(choice(
      /[^{}\n]+/,
      seq("{", $._json_part, "}")
    )),

    macro: $ => seq(
      "<<",
      optional("/"),
      $.macro_name,
      optional($.macro_body),
      ">>"
    ),

    macro_name: $ => /[=\-]?[a-zA-Z][a-zA-Z0-9_\-]*|[=\-]/,

    macro_body: $ => repeat1(choice(
      $.variable,
      $.string,
      $.keyword_op,
      $.number,
      $._macro_word,
      /[^>"'`$_?\s]+/,
      /\s+/,
      ">",
      "?",
      "'",
      '"'
    )),

    // refuse naked local variables starting with '__' as it is used for underline instead
    naked_variable: $ => token(seq(
      choice(
        /_[A-Za-z$]/,
        /[$?][A-Za-z$_]/,
      ),
      /[A-Za-z0-9$_]*/
    )),

    variable: $ => token(seq(
      /[$_?]/,
      /[A-Za-z_$][A-Za-z0-9_$]*/
    )),

    string: $ => choice(
      /"[^"\\\n]*(\\.[^"\\\n]*)*"/,
      /'[^'\\\n]*(\\.[^'\\\n]*)*'/,
      /`[^`]*`/
    ),

    keyword_op: $ => token(prec(1, /to|is|and|or|not|eq|ne|lte|gte|lt|gt/)),

    _macro_word: $ => token(prec(1, /[a-zA-Z_][a-zA-Z0-9_]*/)),

    number: $ => token(prec(1, /-?\d+(\.\d+)?/)),

    comment: $ => choice($.comment_cstyle, $.comment_wiki, $.comment_html),
    comment_cstyle: $ => seq("/*", token(/([^*]|\*[^/])*/), "*/"),
    comment_wiki: $ => seq("/%", token(/([^%]|%[^/])*/), "%/"),
    comment_html: $ => seq("<!--", token(/([^-]|-[^-]|--[^>])*/), "-->"),

    html_tag: $ => seq(
      choice("<", "</"),
      $.tag_name,
      repeat($.attribute),
      ">"
    ),
    tag_name: $ => token.immediate(/[a-zA-Z][a-zA-Z0-9]*/),
    attribute: $ => seq(
      $.attribute_name, optional(seq("=", $.attribute_value))
    ),
    attribute_name: $ => /[^<>"'/=\s]+/,
    attribute_value: $ => choice(
      /[^<>"'=\s]+/,
      /'[^']*'/,
      /"[^"]+"/,
    ),

    plain_text: $ => choice(
      token(prec(-2, /[^<$_?'=^~\/\[\n]+|[$_?'=^~\/\[]/)),
      /<\s/,
    ),

    label: $ => $._link_part,
    dest: $ => $._link_part,
    _link_part: $ => /[^ \-<|\]]([^\-<|\]]|-[^>]|<[^-])*[^ \-<|\]>]|[^ \-<|\]>]/,
    separator: $ => /->|\|/,
    separator_reverse: $ => "<-",
    name: $ => /[^{\[\n ][^{\[\n]*[^{\[\n ]|[^{\[\n ]/,
    tag: $ => /[a-z0-9]+/
  }
});
