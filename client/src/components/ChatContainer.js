import React, { useState } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Settings from './Settings';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import '../styles/ChatContainer.css';

// Main container for the chat interface
const ChatContainer = () => {
  const { isSettingsOpen, toggleSettings } = useSettings();
  const { clearMessages } = useChat();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const handleClearClick = () => {
    setShowClearConfirm(true);
  };
  
  const confirmClear = () => {
    clearMessages();
    setShowClearConfirm(false);
  };
  
  const cancelClear = () => {
    setShowClearConfirm(false);
  };
  
  return (
    <div className="chat-container">
      <div className="paper-texture"></div>
      <header className="chat-header">
        <h1 className="chat-title">MonoChat</h1>
        <div className="header-buttons">
          <button 
            className="clear-button"
            onClick={handleClearClick}
            aria-label="Clear Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"/>
            </svg>
          </button>
          <button 
            className="settings-button"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="none" d="M0 0h24v24H0z"/>
              <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 9.4a3.993 3.993 0 0 0-1.524 2.6 3.993 3.993 0 0 0 1.524 2.6 9.99 9.99 0 0 1-2.044 4.08 3.993 3.993 0 0 0-3.456.26 3.993 3.993 0 0 0-1.955 2.851 9.99 9.99 0 0 1-4.091.004 3.993 3.993 0 0 0-1.954-2.86 3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 14.6a3.993 3.993 0 0 0 1.523-2.6A3.993 3.993 0 0 0 2.5 9.4a9.99 9.99 0 0 1 2.043-4.08 3.993 3.993 0 0 0 3.457-.26A3.993 3.993 0 0 0 9.954 2.21zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
          </button>
        </div>
      </header>
      
      <div className="chat-content">
        <MessageList />
        <InputArea />
      </div>
      
      {isSettingsOpen && <Settings />}
      
      {showClearConfirm && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h3>清空聊天记录</h3>
            <p>确定要清空所有聊天记录吗？此操作无法撤销。</p>
            <div className="confirm-buttons">
              <button onClick={cancelClear} className="btn-cancel">取消</button>
              <button onClick={confirmClear} className="btn-confirm">确定清空</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer; 