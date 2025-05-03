import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 添加空的AI消息
      const aiMessageIndex = messages.length;
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解析接收到的数据
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;
        
        // 更新消息
        setMessages(prev => {
          const updated = [...prev];
          updated[aiMessageIndex] = { role: 'assistant', content: aiResponse };
          return updated;
        });
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: '抱歉，发生了错误。请稍后再试。' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>MonoChat</h1>
      </header>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content || (msg.role === 'assistant' && isLoading ? '...' : '')}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入您的消息..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          发送
        </button>
      </form>
    </div>
  );
}

export default App; 