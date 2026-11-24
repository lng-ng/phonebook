import js from '@eslint/js'
import globals from 'globals'
import eslintReact from '@eslint-react/eslint-plugin'
import { defineConfig } from 'eslint/config'
import stylisticJs from '@stylistic/eslint-plugin'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,jsx}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  eslintReact.configs.recommended,
  {plugins: { 
    '@stylistic/js': stylisticJs,
  },
  rules: { 
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/semi': ['error', 'never'],
  }}, 
  {ignores: ['dist/**'],},
])
