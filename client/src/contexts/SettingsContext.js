import React, { createContext, useState, useContext, useEffect } from 'react';
import { getModels } from '../services/api';

// Default settings
const DEFAULT_SETTINGS = {
  model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
  enableThinking: true
};

// Create the context
const SettingsContext = createContext();

// Custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }) => {
  // State
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [availableModels, setAvailableModels] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Fetch available models on component mount
  useEffect(() => {
    fetchModels();
  }, []);
  
  // Fetch models from API
  const fetchModels = async () => {
    try {
      const models = await getModels();
      setAvailableModels(models);
      
      // If available models exist and current model is not in the list,
      // update the current model to the first available one
      if (models.length > 0 && !models.includes(settings.model)) {
        updateSettings({ model: models[0] });
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };
  
  // Update a specific setting
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };
  
  // Value object to be provided by the context
  const value = {
    settings,
    updateSettings,
    availableModels,
    isSettingsOpen,
    toggleSettings
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 