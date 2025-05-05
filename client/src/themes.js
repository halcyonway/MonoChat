// Define multiple Ghibli-inspired themes
const themes = {
  // Classic Ghibli (Current Theme)
  ghibli: {
    name: 'Ghibli Classic',
    colors: {
      primary: '#855523',
      secondary: '#5a3a22',
      text: '#5a3a22',
      textLight: '#7a6a52',
      background: '#f8f4e5',
      userMessage: '#ffefd5',
      assistantMessage: '#ffffff',
      reasoning: '#ffefd5',
      border: '#b39070',
      button: '#855523',
      buttonHover: '#5a3a22',
      buttonDisabled: '#b39070',
    },
    darkColors: {
      primary: '#855523',
      secondary: '#5a3a22',
      text: '#e0d2c5',
      textLight: '#c0b2a5',
      background: '#2a201a',
      userMessage: '#3a2a20',
      assistantMessage: '#322218',
      reasoning: '#3a2a20',
      border: '#5a3a22',
      button: '#855523',
      buttonHover: '#9a6533',
      buttonDisabled: '#664426',
    },
    fontFamily: "'ZCOOL KuaiLe', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    backgroundPattern: 'url(\'data:image/png;base64,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\')'
  },
  
  // Totoro Theme
  totoro: {
    name: 'Totoro Forest',
    colors: {
      primary: '#527853',
      secondary: '#3d593e',
      text: '#3d593e',
      textLight: '#5a7a5c',
      background: '#e9f0da',
      userMessage: '#d3e6c1',
      assistantMessage: '#ffffff',
      reasoning: '#d3e6c1',
      border: '#7ca36d',
      button: '#527853',
      buttonHover: '#3d593e',
      buttonDisabled: '#7ca36d',
    },
    darkColors: {
      primary: '#527853',
      secondary: '#3d593e',
      text: '#c5e0c5',
      textLight: '#a5c0a5',
      background: '#1e2a1e',
      userMessage: '#2a3a2a',
      assistantMessage: '#24302a',
      reasoning: '#2a3a2a',
      border: '#3d593e',
      button: '#527853',
      buttonHover: '#628963',
      buttonDisabled: '#3d593e',
    },
    fontFamily: "'ZCOOL KuaiLe', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    backgroundPattern: 'url(\'data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 20c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="%23527853" fill-opacity="0.1"/></svg>\')'
  },
  
  // Spirited Away Theme
  spirited: {
    name: 'Spirited Away',
    colors: {
      primary: '#494887',
      secondary: '#352f66',
      text: '#352f66',
      textLight: '#5c5490',
      background: '#f2eefb',
      userMessage: '#e0d6f9',
      assistantMessage: '#ffffff',
      reasoning: '#e0d6f9',
      border: '#7868b5',
      button: '#494887',
      buttonHover: '#352f66',
      buttonDisabled: '#7868b5',
    },
    darkColors: {
      primary: '#494887',
      secondary: '#352f66',
      text: '#d2c5e0',
      textLight: '#b2a5c0',
      background: '#1a1a2e',
      userMessage: '#2a2a40',
      assistantMessage: '#252538',
      reasoning: '#2a2a40',
      border: '#352f66',
      button: '#494887',
      buttonHover: '#5a5998',
      buttonDisabled: '#352f66',
    },
    fontFamily: "'ZCOOL KuaiLe', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    backgroundPattern: 'url(\'data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M35.998 35.949c0 3.362-2.682 6.089-5.988 6.089s-5.988-2.726-5.988-6.09c0-3.362 2.682-6.088 5.988-6.088s5.988 2.726 5.988 6.089z" fill="%23494887" fill-opacity="0.1"/></svg>\')'
  },
  
  // Castle in the Sky Theme
  castle: {
    name: 'Castle in the Sky',
    colors: {
      primary: '#81b9e9',
      secondary: '#3d7eac',
      text: '#3d7eac',
      textLight: '#5a96c2',
      background: '#e8f4ff',
      userMessage: '#d1e9fd',
      assistantMessage: '#ffffff',
      reasoning: '#d1e9fd',
      border: '#81b9e9',
      button: '#3d7eac',
      buttonHover: '#2d6182',
      buttonDisabled: '#a3cdf0',
    },
    darkColors: {
      primary: '#81b9e9',
      secondary: '#3d7eac',
      text: '#c5d7e0',
      textLight: '#a5b7c0',
      background: '#1a2a3a',
      userMessage: '#2a3a48',
      assistantMessage: '#243240',
      reasoning: '#2a3a48',
      border: '#3d7eac',
      button: '#81b9e9',
      buttonHover: '#91c9f9',
      buttonDisabled: '#3d7eac',
    },
    fontFamily: "'ZCOOL KuaiLe', cursive, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    backgroundPattern: 'url(\'data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 15L35 25H25L30 15z" fill="%2381b9e9" fill-opacity="0.1"/></svg>\')'
  },
  
  // GitHub Theme (Plain style)
  github: {
    name: 'GitHub Plain',
    colors: {
      primary: '#0366d6',
      secondary: '#0056b3',
      text: '#24292e',
      textLight: '#586069',
      background: '#f6f8fa',
      userMessage: '#ffffff',
      assistantMessage: '#ffffff',
      reasoning: '#f1f8ff',
      border: '#e1e4e8',
      button: '#0366d6',
      buttonHover: '#0056b3',
      buttonDisabled: '#5a88c2',
    },
    darkColors: {
      primary: '#58a6ff',
      secondary: '#388bfd',
      text: '#c9d1d9',
      textLight: '#8b949e',
      background: '#0d1117',
      userMessage: '#161b22',
      assistantMessage: '#161b22',
      reasoning: '#132d46',
      border: '#30363d',
      button: '#238636',
      buttonHover: '#2ea043',
      buttonDisabled: '#3a6a47',
    },
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
    backgroundPattern: 'none'
  }
};

export default themes; 