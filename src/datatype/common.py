#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class LlmConfig:
    """LLM配置类"""
    model_name: str = "Qwen/Qwen3-8B"
    temperature: float = 0.7
    top_p: float = 0.9
    max_tokens: Optional[int] = None
    extra_params: Dict[str, Any] = field(default_factory=dict)
    enable_thinking: bool = True


@dataclass
class LLMAPIResponse:
    """LLM API响应数据类"""
    id: str
    object: str
    created: int
    model: str
    choices: List[Dict[str, Any]]
    usage: Dict[str, int]
    
    @classmethod
    def model_validate(cls, data: Dict[str, Any]) -> 'LLMAPIResponse':
        return cls(
            id=data.get("id", ""),
            object=data.get("object", ""),
            created=data.get("created", 0),
            model=data.get("model", ""),
            choices=data.get("choices", []),
            usage=data.get("usage", {})
        )
    
    def get_content(self) -> str:
        """获取回复内容"""
        if not self.choices or len(self.choices) == 0:
            return ""
        return self.choices[0].get("message", {}).get("content", "")
    
    def get_reasoning_content(self) -> str:
        """获取推理过程内容"""
        if not self.choices or len(self.choices) == 0:
            return ""
        return self.choices[0].get("message", {}).get("reasoning_content", "")
    
    def __str__(self) -> str:
        """用于打印调试信息的字符串表示"""
        return json.dumps({
            "id": self.id,
            "object": self.object,
            "created": self.created,
            "model": self.model,
            "choices": self.choices,
            "usage": self.usage
        }, ensure_ascii=False, indent=2) 