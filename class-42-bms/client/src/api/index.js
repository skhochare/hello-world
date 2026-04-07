import axios from 'axios';

// Create a reusable axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error logging
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
