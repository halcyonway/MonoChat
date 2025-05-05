import React, { useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import '../styles/Settings.css';

// Component for settings panel
const Settings = () => {
  const { 
    settings, 
    updateSettings, 
    availableModels,
    availableThemes,
    toggleSettings,
    toggleDarkMode
  } = useSettings();
  
  const panelRef = useRef(null);
  
  // Handle click outside to close settings
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        toggleSettings();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSettings]);
  
  // Update settings when inputs change
  const handleSettingChange = (setting, value) => {
    updateSettings({ [setting]: value });
  };
  
  return (
    <div className="settings-overlay">
      <div className="settings-panel" ref={panelRef}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button 
            className="close-button"
            onClick={toggleSettings}
            aria-label="Close settings"
          >
            &times;
          </button>
        </div>
        
        <div className="settings-content">
          {/* Theme Selection */}
          <div className="setting-group">
            <label htmlFor="theme-select">Theme</label>
            <select
              id="theme-select"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
            >
              {availableThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="setting-group">
            <label htmlFor="dark-mode-toggle">Dark Mode</label>
            <label className="toggle">
              <input
                id="dark-mode-toggle"
                type="checkbox"
                checked={settings.darkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          {/* Model Selection */}
          <div className="setting-group">
            <label htmlFor="model-select">Model</label>
            <select
              id="model-select"
              value={settings.model}
              onChange={(e) => handleSettingChange('model', e.target.value)}
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          
          {/* Enable Thinking Toggle */}
          <div className="setting-group">
            <label htmlFor="thinking-toggle">Show thinking process</label>
            <label className="toggle">
              <input
                id="thinking-toggle"
                type="checkbox"
                checked={settings.enableThinking}
                onChange={(e) => handleSettingChange('enableThinking', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 