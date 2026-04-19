module.exports = grammar({
  name: "twee",

  rules: {
    story: $ => repeat($.passage),

    passage: $ => seq(
      $.heading,
      $._body
    ),

    _body: $ => choice(
      $.json,
      $.prose
    ),

    prose: $ => prec.right(seq(
      repeat1($._prose_part)
    )),

    _prose_part: $ => choice(
      $.comment,
      $.macro,
      $.image_link,
      $.link,
      $.variable,
      $.html_tag,
      $.plain_text
    ),

    heading: $ => seq(
      "::",
      $.name,
      optional($.tags),
      optional($.inline_json),
      "\n"
    ),

    link: $ => seq(
      "[[",
      $.label,
      $.separator,
      $.dest,
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
      "{",
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
      /[^>"'$_?\s]+/,
      /\s+/,
      ">"
    )),

    variable: $ => token(seq(
      /[$_?]/,
      /[A-Za-z_$][A-Za-z0-9_$]*/
    )),

    string: $ => choice(
      /"[^"\\]*(\\.[^"\\]*)*"/,
      /'[^'\\]*(\\.[^'\\]*)*'/
    ),

    keyword_op: $ => token(prec(1, /to|is|and|or|not|eq|ne|lt|gt|lte|gte/)),

    number: $ => token(prec(1, /-?\d+(\.\d+)?/)),

    comment: $ => token(choice(
      /\/\*([^*]|\*[^/])*\*\//,
      /\/%([^%]|%[^/])*%\//,
      /<!--([^-]|-[^-]|--[^>])*-->/
    )),

    html_tag: $ => seq(
      $.tag_name,
      optional($.attributes),
      ">"
    ),

    tag_name: $ => token(seq("<", optional("/"), /[a-zA-Z][a-zA-Z0-9\-]*/)),

    attributes: $ => /[^>]+/,

    plain_text: $ => token(prec(-1, /[^<$_?\/\[\n]+|[<$_?\/\[\n]/)),

    separator: $ => /->|<-|\|/,
    label: $ => /[^ \-<|\]]([^\-<|\]]|-[^>]|<[^-])*[^ \-<|\]>]|[^ \-<|\]>]/,
    name: $ => /[^{\[\n ][^{\[\n]*[^{\[\n ]|[^{\[\n ]/,
    dest: $ => /[^\] ][^\]]*[^\] ]|[^\] ]/,
    tag: $ => /[a-z0-9]+/
  }
});
