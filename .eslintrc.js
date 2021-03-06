// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
      "indent": 0,
	  "no-tabs": 0,
      "new-cap": 0,
      "key-spacing": 0,
      "eol-last": 0,
      "spaced-comment": 0,
      "space-before-function-paren": 0,
      "semi": 0,
      "no-new": 0,
      "quotes": 0,
      "no-multiple-empty-lines": 0,
      "padded-blocks": 0,
      "no-undef": 0,
      "keyword-spacing": 0,
      "no-trailing-spaces": 0,
	  "space-in-parens": 0,
	  "no-unused-vars": 0,
      'arrow-parens': 0,
      'new-parens': 0,
      'generator-star-spacing': 0,
      'curly': 0,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
