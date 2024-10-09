module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error', // Set it to "warn" if you prefer warnings instead of errors
      { 
        "vars": "all", // Check all variables
        "args": "after-used", // Only check unused function arguments that appear after used ones
        "ignoreRestSiblings": false, // Don't ignore unused variables in object destructuring
        "argsIgnorePattern": "^_", // Ignore function arguments starting with '_'
        "varsIgnorePattern": "^_" // Ignore variables starting with '_'
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ]
  },
};
