# MonoChat

MonoChat是一个简单的AI流式聊天应用，包含FastAPI后端和React前端。

## 项目结构

```
MonoChat/
├── src/                # Python后端代码
│   └── api/            # FastAPI API代码
│       └── main.py     # 主API服务
├── client/             # React前端代码
├── pyproject.toml      # Python项目配置
├── start.sh            # 一键启动脚本
└── README.md           # 项目说明
```

## 前置需求

- Python 3.8+
- Node.js 14+
- npm 6+
- uv (Python包管理器)

## 安装uv

如果您尚未安装uv，可以通过以下命令安装：

```bash
# 在macOS和Linux上安装
curl -LsSf https://astral.sh/uv/install.sh | sh

# 在Windows上安装
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用pip安装
pip install uv
```

## 启动应用

1. 确保您已安装所有前置需求
2. 运行启动脚本：

```bash
./start.sh
```

这将：
- 创建Python虚拟环境（如果不存在）
- 安装后端依赖
- 启动后端服务（FastAPI）
- 安装前端依赖（如果需要）
- 启动前端开发服务器（React）

3. 在浏览器中访问 http://localhost:3000 使用聊天应用

## 手动启动

如果您需要单独启动服务：

### 后端

```bash
# 创建虚拟环境
uv venv

# 安装依赖
uv pip install -e .

# 启动后端
uv run src/api/main.py
```

### 前端

```bash
cd client
npm install
npm start
```
