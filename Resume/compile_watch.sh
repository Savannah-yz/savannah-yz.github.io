#!/bin/bash
# 实时监控 Resume-YANG_Zhe.tex 并自动编译为 PDF
# 用法: ./compile_watch.sh

TEX_FILE="Resume-YANG_Zhe.tex"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

if ! command -v xelatex &> /dev/null; then
  echo "错误: 未找到 xelatex，请先安装 TeX Live 或 MacTeX"
  echo "  brew install --cask mactex"
  exit 1
fi

# 首次编译
echo "=== 首次编译 ==="
xelatex -interaction=nonstopmode "$TEX_FILE"

if command -v fswatch &> /dev/null; then
  echo ""
  echo "=== 监控文件变化中，保存即自动编译 (Ctrl+C 退出) ==="
  fswatch -o "$TEX_FILE" | while read; do
    echo ""
    echo "=== 检测到修改，重新编译 $(date '+%H:%M:%S') ==="
    xelatex -interaction=nonstopmode "$TEX_FILE"
  done
else
  echo ""
  echo "提示: 安装 fswatch 可启用实时监控"
  echo "  brew install fswatch"
  echo "然后重新运行此脚本"
fi
