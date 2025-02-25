module.exports = {
  // ... 其他配置保持不变
  printWidth: 100,
  // 新增以下配置确保与ESLint配合
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        parser: 'typescript'
      }
    }
  ]
};
