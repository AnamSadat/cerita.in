import {
  Category,
  formSchemaStoryInput,
  PostStoryType,
  StoryFromDB,
} from '@/types/story';
import axiosInstance from '../axios';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { formSchemaRegister, PostRegisterType } from '@/types/auth';

const BASE_URL = process.env.NEXT_PUBLIC_STORY_API;

const ENDPOINTS = {
  STORY: '/story',
  STORY_DETAIL: (slug: string) => `/story/${slug}`,
  CATEGORY: '/category',
  ADD_STORY: '/add-story',
  PROFILE: '/profile',
  LIKE: '/like',
  BOOKMARK: '/bookmark',
  REGISTER: '/auth/signup',
};

if (!BASE_URL) {
  throw new Error(
    '❌ NEXT_PUBLIC_STORY_API environment variable is not defined'
  );
}

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

export async function postUser(params: PostRegisterType) {
  try {
    const payload = JSON.stringify(params);

    const response = await apiAxios<formSchemaRegister>(ENDPOINTS.REGISTER, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err?.response?.data?.message || 'Internal server error';

    throw new Error(message);
  }
}

export async function getStory() {
  try {
    const response = await apiAxios<{ status: number; data: StoryFromDB[] }>(
      ENDPOINTS.STORY
    );

    console.log('📦 Full response:', response);

    console.log('📦 response.data:', response.data); // ✅ ini bener

    return response.data;
  } catch (error) {
    // const err = error as AxiosError<{ message?: string }>;
    // const message = err?.response?.data?.message || 'Internal server error';
    console.error('❌ getStory error:', error);
    // throw new Error(message);
    throw error;
  }
}

export async function getStoryBySlug(slug: string) {
  try {
    const response = await apiAxios<{ status: number; data: StoryFromDB }>(
      `${ENDPOINTS.STORY}/${slug}`
    );

    console.log('📦 response detail by slug:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ getStoryBySlug error:', error);
    throw error;
  }
}

export async function getCategory() {
  try {
    const response = await apiAxios<{ status: number; data: Category[] }>(
      ENDPOINTS.CATEGORY
    );
    return response.data;
  } catch (error) {
    console.error('getCategory error:', error);
    return [];
  }
}

export async function postStory(params: PostStoryType) {
  try {
    const formData = new FormData();
    formData.append('title', params.title);
    formData.append('category', params.category);
    formData.append('content', params.content);
    formData.append('imageFile', params.img_url);
    formData.append('sortDescription', params.sortDescription);

    const session = await getSession();

    const response = await apiAxios<{
      status: number;
      data: formSchemaStoryInput;
    }>(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${session?.user?.token}`,
      },
    });

    if (response.status !== 200)
      throw new Error('❌ Gagal menambahkan story, error di apiPrisma.ts');

    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err?.response?.data?.message || 'Failed to add story';
    throw new Error(message);
  }
}
