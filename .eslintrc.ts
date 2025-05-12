module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
      // custom frontend rules
      '@typescript-eslint/no-unused-vars': ['warn'],
      'vue/multi-word-component-names': 'off',
    },
  };