export interface EnhanceRequest {
  prompt: string;
  category: string;
  level: 'Basic' | 'Professional' | 'Expert';
}

export interface EnhanceResponse {
  enhancedPrompt: string;
}

// Read API url from Vite environment variables or default to localhost
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * Call the backend to enhance a prompt.
 */
export async function enhancePrompt(payload: EnhanceRequest): Promise<EnhanceResponse> {
  const url = `${API_BASE_URL}/api/enhance`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw the server's error message if available, else a generic one
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    return data as EnhanceResponse;
  } catch (error: any) {
    console.error('API Service Error:', error);
    // Propagate cleaner error message
    throw new Error(error.message || 'Unable to connect to the backend server. Make sure it is running.');
  }
}
