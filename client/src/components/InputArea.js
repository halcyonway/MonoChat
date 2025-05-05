import React, { useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import '../styles/InputArea.css';

// Component for user input and message sending
const InputArea = () => {
  const { input, setInput, sendMessage, isLoading } = useChat();
  const textareaRef = useRef(null);
  
  // Focus the input field when the component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);
  
  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [input]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage();
    }
  };
  
  // Handle key press events (Enter to submit, Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className="message-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isLoading}
        rows={1}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={!input.trim() || isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"/>
        </svg>
      </button>
    </form>
  );
};

export default InputArea; 