module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', 'unused-imports'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': 0,
    'unused-imports/no-unused-imports-ts': 0,
    'react-refresh/only-export-components': 0,
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    '@typescript-eslint/no-inferrable-types': 0, // 关闭隐式 any 的警告
  },
};
