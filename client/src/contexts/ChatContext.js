import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { streamChat } from '../services/api';
import { useSettings } from './SettingsContext';

// Create the context
const ChatContext = createContext();

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export const ChatProvider = ({ children }) => {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get settings from context
  const { settings } = useSettings();
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Add a user message
  const addUserMessage = (content) => {
    const newMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  // Add an AI message with empty content and reasoning
  const addEmptyAIMessage = (userMessageId) => {
    const newMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      // Only initialize reasoning if enabled in settings
      ...(settings.enableThinking ? { reasoning: '' } : {}),
      isReasoningCollapsed: false,
      timestamp: Date.now(),
      userId: userMessageId // Reference to the user message that triggered this AI response
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  // Update an AI message with new content or reasoning
  const updateAIMessage = (id, updates) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === id) {
          // 创建安全的更新对象
          const safeUpdates = {};
          
          // 处理reasoning字段 - 仅当启用了思考功能时
          if (settings.enableThinking && updates.reasoning !== undefined) {
            safeUpdates.reasoning = updates.reasoning !== null ? updates.reasoning : '';
          }
          
          // 处理content字段
          if (updates.content !== undefined) {
            safeUpdates.content = updates.content !== null ? updates.content : '';
          }
          
          // 处理其他字段
          Object.keys(updates).forEach(key => {
            if (key !== 'reasoning' && key !== 'content') {
              safeUpdates[key] = updates[key];
            }
          });
          
          return { ...msg, ...safeUpdates };
        }
        return msg;
      })
    );
  };
  
  // Toggle reasoning collapse state
  const toggleReasoningCollapse = (id) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id 
          ? { ...msg, isReasoningCollapsed: !msg.isReasoningCollapsed } 
          : msg
      )
    );
  };
  
  // Retry a failed message
  const retryMessage = async (userMessageId) => {
    // Find the user message
    const userMessage = messages.find(msg => msg.id === userMessageId);
    if (!userMessage || userMessage.role !== 'user') {
      setError('无法找到要重试的消息');
      return;
    }
    
    // Find and remove corresponding AI message if it exists
    const userMessageIndex = messages.findIndex(msg => msg.id === userMessageId);
    let aiMessageToRemove = null;
    
    if (userMessageIndex !== -1 && userMessageIndex < messages.length - 1) {
      const nextMessage = messages[userMessageIndex + 1];
      if (nextMessage.role === 'assistant') {
        aiMessageToRemove = nextMessage.id;
      }
    }
    
    if (aiMessageToRemove) {
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageToRemove));
    }
    
    // Now send the message again
    setIsLoading(true);
    setError(null);
    
    // Add empty AI message
    const aiMessage = addEmptyAIMessage(userMessageId);
    
    try {
      // Build messages history up to the user message
      const historyMessages = messages
        .slice(0, userMessageIndex + 1)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
      // Stream the chat response
      await streamChat(
        historyMessages,
        settings.model,
        settings.enableThinking,
        (reasoning, content) => {
          // Update the AI message with the new chunks
          const updates = { content };
          if (settings.enableThinking) {
            updates.reasoning = reasoning;
          }
          updateAIMessage(aiMessage.id, updates);
        }
      );
      
      // When streaming is complete, collapse reasoning if enabled
      if (settings.enableThinking) {
        updateAIMessage(aiMessage.id, { isReasoningCollapsed: true });
      }
    } catch (error) {
      console.error('Error retrying message:', error);
      // Update the AI message with an error
      updateAIMessage(aiMessage.id, { 
        content: `发生错误: ${error.message || '请求失败，请重试'}`
      });
      setError(error.message || '请求失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Send a message to the API
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Reset error state
    setError(null);
    
    // Add user message
    const userMessage = addUserMessage(input);
    setInput('');
    setIsLoading(true);
    
    // Add empty AI message that will be updated with streaming content
    const aiMessage = addEmptyAIMessage(userMessage.id);
    
    try {
      // Format messages for API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the current user message
      apiMessages.push({
        role: 'user',
        content: input
      });
      
      // Stream the chat response
      await streamChat(
        apiMessages,
        settings.model,
        settings.enableThinking,
        (reasoning, content) => {
          // Update the AI message with the new chunks
          const updates = { content };
          if (settings.enableThinking) {
            updates.reasoning = reasoning;
          }
          updateAIMessage(aiMessage.id, updates);
        }
      );
      
      // When streaming is complete, collapse reasoning if enabled
      if (settings.enableThinking) {
        updateAIMessage(aiMessage.id, { isReasoningCollapsed: true });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Update the AI message with an error
      updateAIMessage(aiMessage.id, { 
        content: `发生错误: ${error.message || '请求失败，请重试'}`
      });
      setError(error.message || '请求失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear all messages
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };
  
  // Value object to be provided by the context
  const value = {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    toggleReasoningCollapse,
    retryMessage,
    messagesEndRef
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 