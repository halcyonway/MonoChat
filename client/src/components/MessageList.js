import React from 'react';
import MessageItem from './MessageItem';
import { useChat } from '../contexts/ChatContext';
import '../styles/MessageList.css';

// Component to display the list of chat messages
const MessageList = () => {
  const { messages, messagesEndRef, error } = useChat();
  
  // If there are no messages, display a welcome message
  if (messages.length === 0) {
    return (
      <div className="message-list empty">
        <div className="welcome-message">
          <h2>Welcome to MonoChat</h2>
          <p>Start a conversation by typing a message below.</p>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  }
  
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
        />
      ))}
      {error && (
        <div className="error-notification">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 