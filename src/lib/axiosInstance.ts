import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      console.error("Unauthorized: Session expired or invalid token. Redirecting to login.");
      
   
      if (typeof window !== 'undefined') {
        window.location.href = '/login'; 
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;