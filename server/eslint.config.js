import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'prisma/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType:  'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer:  'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-console':     'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'eqeqeq':         ['error', 'always'],
      'no-var':         'error',
      'prefer-const':   'error',
    },
  },
];
