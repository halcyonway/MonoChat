import axios from 'axios';

// API base URL - change this according to your backend setup
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Get available models
export const getModels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/models`);
    return response.data.models || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};

// Stream chat response using fetch API and ReadableStream
export const streamChat = async (
  messages,
  model,
  enableThinking,
  onChunk
) => {
  // Max retries for transient errors
  const MAX_RETRIES = 2;
  let retries = 0;
  
  // Function to handle the actual streaming
  const performStreamRequest = async () => {
    let controller = new AbortController();
    const signal = controller.signal;
    
    // Declare timeoutId outside try-catch so it's accessible in both blocks
    let timeoutId;
    
    try {
      // Create request payload
      const payload = {
        messages,
        model,
        enable_thinking: enableThinking
      };
      
      // Set a timeout to abort if request takes too long
      timeoutId = setTimeout(() => controller.abort(), 30000);
      
      // Send request
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: signal
      });
      
      // Clear the timeout since request completed
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }
      
      // Get response reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Read stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE messages
        const messages = chunk
          .split('\n\n')
          .filter(msg => msg.trim().startsWith('data:'));
        
        if (messages.length === 0) {
          // If no valid SSE messages, check if it's a JSON error response
          try {
            const errorData = JSON.parse(chunk);
            if (errorData.detail) {
              throw new Error(errorData.detail);
            }
          } catch (parseError) {
            // Not JSON or no detail field, continue processing
          }
        }
        
        for (const message of messages) {
          try {
            const dataStr = message.replace('data:', '').trim();
            const data = JSON.parse(dataStr);
            
            // 处理可能的null值
            const safeReasoning = data.reasoning !== undefined && data.reasoning !== null ? data.reasoning : '';
            const safeContent = data.content !== undefined && data.content !== null ? data.content : '';
            
            // Ensure values are strings
            const safeReasoningStr = typeof safeReasoning === 'string' ? safeReasoning : String(safeReasoning);
            const safeContentStr = typeof safeContent === 'string' ? safeContent : String(safeContent);
            
            // 调用回调函数，传递安全值
            onChunk(safeReasoningStr, safeContentStr);
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        }
      }
    } catch (error) {
      // Clean up controller
      clearTimeout && clearTimeout(timeoutId);
      
      // Handle aborted requests
      if (error.name === 'AbortError') {
        console.error('Request was aborted due to timeout');
        throw new Error('Request timed out. Please try again.');
      }
      
      // Handle network errors with retry
      if (error.message.includes('network') && retries < MAX_RETRIES) {
        retries++;
        console.warn(`Network error, retrying (${retries}/${MAX_RETRIES})...`);
        return performStreamRequest();
      }
      
      console.error('Error in stream chat:', error);
      throw error;
    }
  };
  
  // Start the streaming with retry mechanism
  return performStreamRequest();
};

// Legacy implementation with EventSource - Not used anymore
// This method doesn't work because the server expects POST not GET
export const streamChatWithEventSource = async (
  messages,
  model,
  enableThinking,
  temperature,
  topP,
  maxTokens,
  onChunk
) => {
  return new Promise((resolve, reject) => {
    // Create request payload
    const payload = {
      messages,
      model,
      enable_thinking: enableThinking,
      temperature,
      top_p: topP,
      max_tokens: maxTokens
    };
    
    // Create EventSource for SSE - NOTE: This doesn't work with POST endpoints
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/chat?` + 
      new URLSearchParams({
        payload: JSON.stringify(payload)
      })
    );
    
    // Initialize accumulators for reasoning and content
    let fullReasoning = '';
    let fullContent = '';
    
    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Update accumulators
        if (data.reasoning !== undefined) {
          fullReasoning = data.reasoning;
        }
        
        if (data.content !== undefined) {
          fullContent = data.content;
        }
        
        // Call callback with updated values
        onChunk(fullReasoning, fullContent);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };
    
    // Handle errors
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      reject(error);
    };
    
    // Handle stream end
    eventSource.addEventListener('end', () => {
      eventSource.close();
      resolve();
    });
    
    // Fallback to ensure eventSource is closed if no end event is received
    setTimeout(() => {
      if (eventSource.readyState !== 2) { // 2 = CLOSED
        eventSource.close();
        resolve();
      }
    }, 120000); // 2 minute timeout
  });
}; 