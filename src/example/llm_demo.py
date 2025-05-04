#!/usr/bin/env python
# -*- coding: utf-8 -*-


from llm import SiliconFlowLlm
from datatype.common import LlmConfig


def main():    
    # Example 1: Standard chat without reasoning
    print("\n===== Example 1: Standard Chat (Without Reasoning) =====")
    
    config = LlmConfig(
        model_name="Qwen/Qwen3-8B",
        temperature=0.8,
        top_p=0.95,
        max_tokens=2000,
        enable_thinking=False
    )
    
    llm = SiliconFlowLlm(config)
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a short poem about spring."}
    ]
    
    print("Messages: ", messages)
    response = llm.chat(messages=messages)
    content = response.get_content()
    print(f"Assistant: {content}")
    
    # Example 2: Standard chat with reasoning
    print("\n===== Example 2: Standard Chat (With Reasoning) =====")
    
    config = LlmConfig(
        model_name="Qwen/Qwen3-8B",
        temperature=0.8,
        top_p=0.95,
        max_tokens=2000,
        enable_thinking=True
    )
    
    llm = SiliconFlowLlm(config)
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain why the sky is blue."}
    ]
    
    print("Messages: ", messages)
    response = llm.chat(messages=messages)
    
    reasoning = response.get_reasoning_content()
    content = response.get_content()
    
    print(f"Reasoning: {reasoning}")
    print(f"Answer: {content}")
    
    # Example 3: Streaming chat with reasoning
    print("\n===== Example 3: Streaming Chat (With Reasoning) =====")
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Solve this math problem: If x^2 - 5x + 6 = 0, what are the values of x?"}
    ]
    
    print("Messages: ", messages)
    
    # 显示推理和内容的标题
    print("\nReasoning: ", end="", flush=True)
    
    # 跟踪是否已经开始接收内容
    got_content = False
    
    for reasoning_chunk, content_chunk in llm.streaming_chat_with_reasoning(messages=messages):
        # 渲染推理部分
        if reasoning_chunk:
            print(reasoning_chunk, end="", flush=True)
        
        # 当收到第一个内容块，显示内容标题
        if content_chunk and not got_content:
            got_content = True
            print("\n\nAnswer: ", end="", flush=True)
        
        # 渲染内容部分
        if content_chunk:
            print(content_chunk, end="", flush=True)
    
    print()  # 最后添加换行


if __name__ == "__main__":
    main() 