import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STORY_API,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
