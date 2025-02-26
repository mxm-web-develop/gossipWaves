
# 检查是否有未跟踪的文件或未提交的更改
if [[ -n $(git status --porcelain) ]]; then
  echo "有未提交的更改，准备提交..."
  
  # 添加所有更改
  git add .
  
  # 提交更改
  git commit -m 'patch version'
  
  echo "提交完成，准备更新版本..."
fi

# 提示用户选择版本更新类型
echo "请选择版本更新类型："
echo "1) patch"
echo "2) minor"
echo "3) major"
read -p "输入选项 (1/2/3): " choice

# 根据用户选择执行版本更新
case $choice in
  1)
    npm version patch
    ;;
  2)
    npm version minor
    ;;
  3)
    npm version major
    ;;
  *)
    echo "无效选项，退出。"
    exit 1
    ;;
esac

echo "版本更新完成。"