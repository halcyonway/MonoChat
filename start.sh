#!/bin/bash

# 设置错误时退出
set -e

# 清理旧进程
cleanup() {
  echo "关闭应用..."
  # 尝试关闭后端进程
  if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null || true
  fi
  exit 0
}

# 注册信号处理
trap cleanup SIGINT SIGTERM EXIT

echo "启动 MonoChat 应用..."

# 关闭可能已经在运行的后端进程
pkill -f "uv run src/api/main.py" 2>/dev/null || true

# 创建虚拟环境
if [ ! -d ".venv" ]; then
  echo "正在创建虚拟环境..."
  uv venv
fi

# 安装后端依赖
echo "正在安装后端依赖..."
uv pip install -e .

# 启动后端服务
echo "启动后端服务..."
uv run src/api/main.py &
BACKEND_PID=$!

# 等待后端启动
echo "等待后端启动..."
sleep 3

# 检查前端依赖并使用淘宝源安装
if [ ! -d "client/node_modules" ]; then
  echo "正在安装前端依赖..."
  cd client && npm install --registry=https://registry.npmmirror.com && cd ..
fi

# 启动前端服务
echo "启动前端服务..."
cd client && npm start --registry=https://registry.npmmirror.com

# 等待前端进程完成
wait 