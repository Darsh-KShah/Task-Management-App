import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Server health check to detect cold starts
export const checkServerHealth = async () => {
  try {
    const startTime = Date.now();
    await axios.get(`${API_BASE_URL}/health`, { timeout: 3000 });
    const responseTime = Date.now() - startTime;
    
    // If response takes more than 2 seconds, likely a cold start
    return {
      isHealthy: true,
      responseTime,
      isColdStart: responseTime > 2000
    };
  } catch (error) {
    return {
      isHealthy: false,
      responseTime: null,
      isColdStart: true,
      error: error.message
    };
  }
};

// Warm up the server proactively
export const warmUpServer = async () => {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 1000 });
    return true;
  } catch (error) {
    return false;
  }
};
