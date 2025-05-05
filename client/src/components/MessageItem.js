import React, { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/MessageItem.css';

// Format timestamp to readable form
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Check if message contains an error
const isErrorMessage = (content) => {
  return content && typeof content === 'string' && content.startsWith('发生错误:');
};

// Helper function to ensure content is a string
const ensureString = (content) => {
  if (content === null || content === undefined) return '';
  if (typeof content === 'string') return content;
  // If content is an object or any other non-string type, stringify it safely
  try {
    return String(content);
  } catch (e) {
    console.error('Error stringifying content:', e);
    return '';
  }
};

// 简单的文本内容显示组件，保留换行
const TextContent = ({ children }) => {
  const content = ensureString(children);
  if (!content) return null;
  
  return (
    <div className="text-content" style={{ whiteSpace: 'pre-wrap' }}>
      {content}
    </div>
  );
};

// Component to display a single message
const MessageItem = ({ message }) => {
  const { toggleReasoningCollapse, retryMessage } = useChat();
  const { settings } = useSettings();
  const isUser = message.role === 'user';
  const hasReasoning = message.role === 'assistant' && message.reasoning !== undefined && message.reasoning !== null && message.reasoning !== '';
  const shouldShowReasoning = settings.enableThinking && hasReasoning;
  const isCollapsed = message.isReasoningCollapsed;
  const isError = message.role === 'assistant' && isErrorMessage(message.content);
  const reasoningRef = useRef(null);
  
  // Auto-scroll reasoning content to bottom when it updates
  useEffect(() => {
    if (shouldShowReasoning && !isCollapsed && reasoningRef.current) {
      reasoningRef.current.scrollTop = reasoningRef.current.scrollHeight;
    }
  }, [shouldShowReasoning, message.reasoning, isCollapsed]);
  
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
  
  // Render the reasoning/thinking component
  const renderReasoning = () => {
    return (
      <div className={`message-reasoning-container ${isCollapsed ? 'collapsed' : ''}`}>
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
              aria-label={isCollapsed ? 'Expand thinking process' : 'Collapse thinking process'}
            >
              {isCollapsed ? '▲' : '▼'}
            </button>
          </div>
          
          {!isCollapsed && (
            <div className="reasoning-content" ref={reasoningRef}>
              {message.reasoning ? (
                <TextContent>
                  {message.reasoning}
                </TextContent>
              ) : (
                <span className="thinking-indicator">思考中...</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // 为了视觉结构更合理，我们将思考内容和消息内容组合在一起
  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      {isUser ? (
        // 用户消息，正常渲染
        <div className={`message-item ${isError ? 'error' : ''}`}>
          <div className="message-content">
            <TextContent>
              {message.content}
            </TextContent>
          </div>
        </div>
      ) : (
        // 助手消息，可能包含思考部分
        <>
          {shouldShowReasoning && renderReasoning()}
          <div className={`message-item ${isError ? 'error' : ''}`}>
            <div className="message-content">
              {message.content ? (
                <TextContent>
                  {message.content}
                </TextContent>
              ) : (
                <span className="loading-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              )}
              
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
        </>
      )}
    </div>
  );
};

export default MessageItem; 