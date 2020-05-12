module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:security/recommended',
  ],
  globals: {
    fetch: false,
  },
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  plugins: ['import', 'security'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        useTabs: false,
        printWidth: 80,
      },
    ],
    'no-implied-eval': 2,
    'import/prefer-default-export': 0,
    'prefer-destructuring': 0,
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          ['internal', 'unknown'],
          'parent',
          'sibling',
          'index',
        ],
      },
    ],
    'no-console': ['error', { allow: ['error', 'info'] }],
    quotes: ['error', 'single'],
    'function-paren-newline': 2,
    'consistent-return': 0,
    '@typescript-eslint/indent': 0, // Conflicts with Prettier
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-case-declarations': 0,
    'no-extra-boolean-cast': 0,
    'no-async-promise-executor': 0,
    'max-classes-per-file': ['error', 2],
    'class-methods-use-this': 0,
    'security/detect-child-process': 0,
    'security/detect-object-injection': 0,
    'security/detect-non-literal-regexp': 0,
    'security/detect-non-literal-fs-filename': 0,
    'import/no-extraneous-dependencies': 0,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './lib']],
        extensions: ['.ts'],
      },
    },
  },
};
