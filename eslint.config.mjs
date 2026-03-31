import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  // Aplica as regras base para todos os arquivos JS e TS
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // Isso permite require, __dirname, etc.
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      'prettier/prettier': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // Desativamos para arquivos de config, o TS já cuida disso no código fonte
    },
  },
  // Regra específica para ignorar pastas de saída
  {
    ignores: ['dist/**', 'node_modules/**', 'bundle.js'],
  }
);
