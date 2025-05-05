import requests
import json
from typing import List, Dict, Any, Optional, Generator, Union, Tuple

from datatype.common import LlmConfig, LLMAPIResponse
from utils import secret_holder

class SiliconFlowLlm:
    _API_URL = "https://api.siliconflow.cn/v1/chat/completions"
    
    def __init__(self, config: Optional[LlmConfig] = None):
        self.config = config or LlmConfig()
        self.api_key = secret_holder.get_silicon_flow_api_key()
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def _prepare_payload(self, messages: List[Dict[str, str]], stream: bool = False) -> Dict[str, Any]:
        payload = {
            "model": self.config.model_name,
            "messages": messages,
            "stream": stream,
            "temperature": self.config.temperature,
            "top_p": self.config.top_p,
            "enable_thinking": self.config.enable_thinking
        }
        if self.config.max_tokens:
            payload["max_tokens"] = self.config.max_tokens
        payload.update(self.config.extra_params)
        return payload
    
    def chat(self, messages: List[Dict[str, str]]) -> LLMAPIResponse:
        payload = self._prepare_payload(messages, stream=False)
        try:
            response = requests.post(
                self._API_URL,
                headers=self._get_headers(),
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            return LLMAPIResponse.model_validate(response.json())
        except Exception as e:
            print(f"Error in chat: {e}")
            return LLMAPIResponse(
                id="", object="error", created=0, model="",
                choices=[], usage={}
            )
    
    def streaming_chat(self, messages: List[Dict[str, str]], include_reasoning: bool = False) -> Generator[Union[str, Tuple[str, str]], None, None]:
        payload = self._prepare_payload(messages, stream=True)
        try:
            response = requests.post(
                self._API_URL,
                headers=self._get_headers(),
                json=payload,
                stream=True,
                timeout=120
            )
            response.raise_for_status()
            for line in response.iter_lines():
                if not line:
                    continue
                if line.startswith(b"data: "):
                    line = line[6:]
                if line.strip() == b"[DONE]":
                    break
                try:
                    data = json.loads(line)
                    delta = data.get("choices", [{}])[0].get("delta", {})
                    content = delta.get("content", "")
                    reasoning_content = delta.get("reasoning_content", "")
                    if include_reasoning:
                        yield (reasoning_content, content) if reasoning_content or content else ("", "")
                    else:
                        if content:
                            yield content
                except json.JSONDecodeError:
                    continue
                except Exception as e:
                    print(f"Error processing stream response: {e}")
                    break
        except Exception as e:
            print(f"Error in streaming chat: {e}")
            if include_reasoning:
                yield ("", f"[Error: {str(e)}]")
            else:
                yield f"[Error: {str(e)}]"
    
    def streaming_chat_with_reasoning(self, messages: List[Dict[str, str]]) -> Generator[Tuple[str, str], None, None]:
        return self.streaming_chat(messages, include_reasoning=True) 