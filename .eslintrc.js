module.exports = {
  "env": {
    "browser": true,
    "node": true,
  },
  "ext": ".jsx",
  "ignore": /(test|.conf)/,
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "import",
    "react",
  ],
  "parserOptions":{
    "ecmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true
    }
  },
  "settings": {
    "import/parser": "webpack",
    "import/parser": "babel-eslint"
  },
  "rules":{
    "no-useless-constructor": ["off"],
    "react/jsx-no-bind": ["warn"],
    "arrow-body-style": ["off"],
    "one-var": ["off"],
    "one-var-declaration-per-line": ["off"],
    "no-param-reassign": ["off"],
    "max-len": ["warn", 150],
    "semi": ["off"],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "import/no-extraneous-dependencies": ["off"],
    "import/no-unresolved": ["off"],
    "import/prefer-default-export": ["off"],
    "react/prefer-stateless-function": ["off"],
    "react/self-closing-comp": ["off"],
    // "react/no-string-refs": ["warn"],
    "react/require-extension": ["off"],
    "global-require": ["off"],
    "new-cap": ['off'],
    'jsx-a11y/anchor-has-content': ['off']
  },
}
