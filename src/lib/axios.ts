import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_STORY_API;

if (!BASE_URL) {
  throw new Error(
    '❌ NEXT_PUBLIC_STORY_API environment variable is not defined'
  );
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
