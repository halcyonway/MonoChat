import React, { createContext, useState, useContext, useEffect } from 'react';
import { getModels } from '../services/api';
import themes from '../themes';

// Default settings
const DEFAULT_SETTINGS = {
  model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
  enableThinking: true,
  theme: 'ghibli',  // Default theme
  darkMode: false   // Default to light mode
};

// Create the context
const SettingsContext = createContext();

// Custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values to rgb
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};

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
  
  // Apply the current theme when settings change
  useEffect(() => {
    applyTheme(settings.theme, settings.darkMode);
  }, [settings.theme, settings.darkMode]);
  
  // Apply theme function - sets CSS variables on document root
  const applyTheme = (themeName, isDarkMode) => {
    const theme = themes[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Choose the appropriate color set based on dark mode
    const colors = isDarkMode ? theme.darkColors : theme.colors;
    
    // Set all color variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-light', colors.textLight);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-user-message', colors.userMessage);
    root.style.setProperty('--color-assistant-message', colors.assistantMessage);
    root.style.setProperty('--color-reasoning', colors.reasoning);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-button', colors.button);
    root.style.setProperty('--color-button-hover', colors.buttonHover);
    root.style.setProperty('--color-button-disabled', colors.buttonDisabled);
    
    // Set RGB versions for opacity usage
    root.style.setProperty('--color-primary-rgb', hexToRgb(colors.primary));
    root.style.setProperty('--color-text-rgb', hexToRgb(colors.text));
    
    // Set font family
    root.style.setProperty('--font-family', theme.fontFamily);
    
    // Set background pattern
    root.style.setProperty('--background-pattern', theme.backgroundPattern);
    root.style.backgroundImage = theme.backgroundPattern;
    
    // Add or remove dark-mode class from body for potential CSS selectors
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };
  
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
    toggleSettings,
    toggleDarkMode,
    availableThemes: Object.keys(themes).map(key => ({
      id: key,
      name: themes[key].name
    }))
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 