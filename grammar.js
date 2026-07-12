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
      $._macro_word,
      /[^>"'`$_?\s]+/,
      /\s+/,
      ">",
      "?",
      "'",
      '"'
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

    label: $ => $._link_part,
    dest: $ => $._link_part,
    _link_part: $ => /[^ \-<|\]]([^\-<|\]]|-[^>]|<[^-])*[^ \-<|\]>]|[^ \-<|\]>]/,
    separator: $ => /->|\|/,
    separator_reverse: $ => "<-",
    name: $ => /[^{\[\n ][^{\[\n]*[^{\[\n ]|[^{\[\n ]/,
    tag: $ => /[a-z0-9]+/
  }
});
