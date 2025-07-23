import { formSchemaStory, formSchemaStoryInput } from '@/types/story';
import axiosInstance from '../axios';
import { AxiosError, AxiosRequestConfig } from 'axios';

export async function apiAxios<T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const respon = await axiosInstance.request<T>({ url, ...options });

    return respon.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    if (err.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again');
    }

    const message =
      err?.response?.data?.message || `Terjadi kesalahan saat mengakses ${url}`;

    throw new Error(message);
  }
}

export async function getStory() {
  try {
    const response = await apiAxios<formSchemaStoryInput[]>('/add-story');

    return response.data.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err?.response?.data?.message || 'Internal server error';

    throw new Error(message);
  }
}
