module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2018
  },
  plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'simple-import-sort', 'jsdoc', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true,
        useTabs: false,
        tabWidth: 2,
        semi: true,
        bracketSpacing: true
      }
    ],
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit'
      }
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/prefer-for-of': 'off',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/quotes': ['off', 'single'],
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/space-within-parens': ['off', 'never'],
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/tslint/config': [
      'error',
      {
        rules: {
          'import-blacklist': [true, 'rxjs/Rx'],
          'jsdoc-format': true,
          'no-reference-import': true
        }
      }
    ],
    'arrow-parens': ['off', 'as-needed'],
    'import/no-useless-path-segments': 'off',
    'no-param-reassign': 0,
    camelcase: 0,
    'comma-dangle': 'off',
    complexity: 'off',
    'constructor-super': 'error',
    'dot-notation': 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'id-blacklist': 'error',
    'id-match': 'error',
    'import/no-deprecated': 'warn',
    'import/order': 'off',
    'jsdoc/no-types': 'off',
    'linebreak-style': 'off',
    'max-classes-per-file': 'off',
    'no-return-await': 0,
    'lines-between-class-members': ['off', 'always', { exceptAfterSingleLine: true }],
    'max-len': 0,
    'new-parens': 'off',
    'newline-per-chained-call': 'off',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': [
      2,
      {
        allow: [
          'warn',
          'dir',
          'timeLog',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupEnd',
          'table',
          'dirxml',
          'error',
          'groupCollapsed',
          'Console',
          'profile',
          'profileEnd',
          'timeStamp',
          'context'
        ]
      }
    ],
    'no-debugger': 'error',
    'no-empty': 'off',
    'no-eval': 'error',
    'no-extra-semi': 'off',
    'no-fallthrough': 'error',
    'no-invalid-this': 'off',
    'no-irregular-whitespace': 'off',
    'no-multiple-empty-lines': 'off',
    'no-new-wrappers': 'error',
    'no-shadow': [
      'error',
      {
        hoist: 'all'
      }
    ],
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'off',
    'no-undef-init': 'error',
    'no-underscore-dangle': 0,
    'no-unsafe-finally': 'error',
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'object-shorthand': 'error',
    'one-var': ['off', 'never'],
    'prefer-arrow/prefer-arrow-functions': 'off',
    'import/prefer-default-export': 0,
    'quote-props': ['error', 'as-needed'],
    radix: 'error',
    'space-before-function-paren': 'off',
    'use-isnan': 'error',
    'valid-typeof': 'off',
    'operator-assignment': 'off',
    'no-plusplus': 'off',
    'no-restricted-syntax': 'off',
    'no-prototype-builtins': 0,
    'import/newline-after-import': 0,
    'import/first': 0,
    'import/no-cycle': 0,
    'prefer-destructuring': 0,
    'prefer-template': 0,
    'spaced-comment': 0,
    'no-return-assign': 0,
    'import/no-duplicates': 0,
    'no-else-return': 0,
    'prefer-const': 0,
    'import/no-mutable-exports': 0,
    'class-methods-use-this': 0,
    'no-await-in-loop': 0,
    'no-nested-ternary': 0,
    'import/no-extraneous-dependencies': 0,
    'new-cap': 0,
    'prefer-promise-reject-errors': 0,
    'no-loop-func': 0,
    'no-useless-escape': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'no-case-declarations': 0,
    'no-continue': 0,
    'consistent-return': 0,
    'no-dupe-keys': 2
  }
};
