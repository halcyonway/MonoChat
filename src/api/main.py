from datatype.chat import ChatRequest
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json
import asyncio

from llm import SiliconFlowLlm
from datatype.common import LlmConfig

app = FastAPI(title="MonoChat API")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "MonoChat API is running"}

@app.get("/api/models")
async def get_models():
    return {
        "models": [
            "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
            "Qwen/Qwen3-8B", 
            "THUDM/GLM-4-9B-0414", 
            "Qwen/Qwen3-32B"
        ]
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """流式聊天响应"""
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    # 转换Pydantic模型到字典列表
    formatted_messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    
    config = LlmConfig(
        model_name=request.model,
        temperature=request.temperature,
        top_p=request.top_p,
        max_tokens=request.max_tokens,
        enable_thinking=request.enable_thinking
    )
    
    llm = SiliconFlowLlm(config)
    
    async def generate():
        full_reasoning = ""
        full_content = ""
        
        try:
            for reasoning_chunk, content_chunk in llm.streaming_chat_with_reasoning(messages=formatted_messages):
                reasoning_chunk = reasoning_chunk or ""
                content_chunk = content_chunk or ""
                
                if reasoning_chunk:
                    full_reasoning += reasoning_chunk
                
                if content_chunk:
                    full_content += content_chunk
                
                response_data = {
                    "reasoning": full_reasoning,
                    "content": full_content
                }
                yield f"data: {json.dumps(response_data)}\n\n"
                
                # Allow for client disconnection check
                await asyncio.sleep(0)
        except asyncio.CancelledError:
            # This will be triggered when client disconnects
            print("Client disconnected, stopping generation")
            raise
    
    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 