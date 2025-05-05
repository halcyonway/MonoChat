import React, { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import '../styles/MessageItem.css';

// Format timestamp to readable form
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Check if message contains an error
const isErrorMessage = (content) => {
  return content && content.startsWith('发生错误:');
};

// Component to display a single message
const MessageItem = ({ message }) => {
  const { toggleReasoningCollapse, retryMessage } = useChat();
  const isUser = message.role === 'user';
  const hasReasoning = message.role === 'assistant' && message.reasoning !== undefined && message.reasoning !== null && message.reasoning !== '';
  const isError = message.role === 'assistant' && isErrorMessage(message.content);
  const reasoningRef = useRef(null);
  
  // Auto-scroll reasoning content to bottom when it updates
  useEffect(() => {
    if (hasReasoning && !message.isReasoningCollapsed && reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [hasReasoning, message.reasoning, message.isReasoningCollapsed]);
  
  // Handle toggle reasoning collapse
  const handleToggleReasoning = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    toggleReasoningCollapse(message.id);
  };
  
  // Handle retry button click
  const handleRetry = () => {
    // Find the preceding user message to retry
    retryMessage(message.userId);
  };
  
  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      {/* Thinking/reasoning section (only for assistant messages) */}
      {hasReasoning && (
        <div className={`message-reasoning-container ${message.isReasoningCollapsed ? 'collapsed' : ''}`}>
          <div className="message-reasoning">
            <div 
              className="reasoning-header"
              onClick={handleToggleReasoning}
            >
              <div className="reasoning-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <span>深度思考</span>
              </div>
              <button 
                className="toggle-button"
                onClick={handleToggleReasoning}
                aria-label={message.isReasoningCollapsed ? 'Expand thinking process' : 'Collapse thinking process'}
              >
                {message.isReasoningCollapsed ? '▼' : '▲'}
              </button>
            </div>
            
            {!message.isReasoningCollapsed && (
              <div className="reasoning-content" ref={reasoningRef}>
                {message.reasoning ? message.reasoning : (
                  <span className="thinking-indicator">思考中...</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Main message item */}
      <div className={`message-item ${isError ? 'error' : ''}`}>
        <div className="message-header">
          <span className="message-role">{isUser ? 'You' : 'AI'}</span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
        
        {/* Main message content */}
        <div className="message-content">
          {message.content ? message.content : (message.role === 'assistant' && (
            <span className="loading-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          ))}
          
          {/* Error retry button */}
          {isError && (
            <div className="message-error-actions">
              <button 
                className="retry-button"
                onClick={handleRetry}
              >
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem; 