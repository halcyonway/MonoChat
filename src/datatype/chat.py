from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "Qwen/Qwen3-8B"
    enable_thinking: bool = True
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: Optional[int] = None