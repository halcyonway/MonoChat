from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
import json

app = FastAPI(title="MonoChat API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "MonoChat API is running"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """流式聊天响应"""
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    # 获取最后一条用户消息
    last_message = request.messages[-1]
    
    # 模拟流式响应文本
    response_text = f"这是对'{last_message.content}'的AI回复。这是一个流式响应的演示。"
    
    async def generate():
        # 发送SSE格式的数据
        for char in response_text:
            await asyncio.sleep(0.05)
            yield char
    
    return StreamingResponse(generate(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 