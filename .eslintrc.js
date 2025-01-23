/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ['airbnb', 'airbnb-typescript', 'eslint-config-prettier', 'next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.js', 'next.config.mjs', 'postcss.config.mjs'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: false,
      },
    ],
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    'no-alert': 'off', // Temporary
    'react/jsx-props-no-spreading': [
      'error',
      {
        html: 'ignore',
        exceptions: ['ListDisplay', 'CardDisplay'],
      },
    ],
  },
};
