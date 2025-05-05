import React from 'react';
import ChatContainer from './components/ChatContainer';
import { ChatProvider } from './contexts/ChatContext';
import { SettingsProvider } from './contexts/SettingsContext';
import './styles/App.css';

function App() {
  return (
    <SettingsProvider>
      <ChatProvider>
        <div className="app">
          <ChatContainer />
        </div>
      </ChatProvider>
    </SettingsProvider>
  );
}

export default App; 