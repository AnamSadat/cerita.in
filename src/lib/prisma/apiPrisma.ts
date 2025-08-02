import {
  Bookmark,
  BookmarkResponse,
  Category,
  formSchemaStoryInput,
  // formUpdate,
  PostStoryType,
  StoryFromDB,
  // UpdateStoryType,
} from '@/types/story';
import axiosInstance from '../axios';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { formSchemaRegister, PostRegisterType } from '@/types/auth';
import { Like } from '@/types/slice';
import {
  FormTypeProfile,
  FormTypeProfileUpdate,
  // profileSchemaInput,
  // profileUpdateSchemaInput,
  UserWithProfile,
} from '@/types/profile';

const ENDPOINTS = {
  STORY: '/story',
  STORY_DETAIL: (slug: string) => `/story/${slug}`,
  CATEGORY: '/category',
  ADD_STORY: '/add-story',
  PROFILE: '/profile',
  LIKE: '/like',
  BOOKMARK: '/bookmark',
  REGISTER: '/auth/signup',
  USER: '/account',
  DELETE_STORY: '/story/delete',
};

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
    console.log('🚀 ~ postStory ~ session:', session);

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

export async function updateStory(formData: FormData) {
  const session = await getSession();
  const response = await apiAxios<{
    status: number;
    data: StoryFromDB;
  }>(ENDPOINTS.STORY, {
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.user?.token}`,
    },
  });
  return response.data;
}

export async function deleteStory(storyId: number) {
  try {
    const session = await getSession();

    const response = await apiAxios<{
      status: number;
      message: string;
    }>(`${ENDPOINTS.DELETE_STORY}?id=${storyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
    });

    if (response.status !== 200) throw new Error('❌ Gagal menghapus story');

    return response.message;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;
    const message = err?.response?.data?.message || 'Failed to delete story';
    throw new Error(message);
  }
}

export async function postLike(story_id: number) {
  const session = await getSession();
  console.log('🚀 ~ postLike ~ session:', session);

  return await apiAxios<{ message: string; data: Like }>(ENDPOINTS.LIKE, {
    method: 'POST',
    data: { story_id },
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
    },
  });
}

export async function deleteLike(likeId: number) {
  return await apiAxios<{ status: number; message: string }>(
    `${ENDPOINTS.LIKE}/${likeId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function postBookmark(
  story_id: number,
  notes?: string
): Promise<BookmarkResponse> {
  const session = await getSession();
  console.log('🚀 ~ postBookmark ~ session:', session);

  const response = await apiAxios<BookmarkResponse>(ENDPOINTS.BOOKMARK, {
    method: 'POST',
    data: { story_id, notes },
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
    },
  });

  return response;
}

export async function deleteBookmark(id: number) {
  const session = await getSession();
  console.log('🚀 ~ deleteBookmark ~ session:', session);

  return await apiAxios<{ message: string }>(ENDPOINTS.BOOKMARK, {
    method: 'DELETE',
    data: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.token}`,
    },
  });
}

export async function getBookmark<BookmarkResponse>() {
  const session = await getSession();
  console.log('🚀 ~ getBookmark ~ session:', session);

  return await apiAxios<BookmarkResponse>(ENDPOINTS.BOOKMARK, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.token}`,
    },
  });
}

export async function updateBookmark(
  id: number,
  notes: string
): Promise<{ data: { data: Bookmark } }> {
  const session = await getSession();
  console.log('🚀 ~ updateBookmark ~ session:', session);

  return await apiAxios(ENDPOINTS.BOOKMARK, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.user?.token}`,
    },
    data: {
      id,
      notes,
    },
  });
}

export const getProfileByUsername = async (username: string) => {
  const session = await getSession();

  const res = await apiAxios<{ status: number; data: UserWithProfile }>(
    `${ENDPOINTS.PROFILE}/${username}`,
    {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
    }
  );
  console.log('✅ RESPONSE:', res);

  return res.data.profile;
};

export const postProfile = async (data: FormTypeProfile) => {
  const session = await getSession();
  const username = session?.user?.username;

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('bio', data.bio ?? '');
  formData.append('gender', data.gender);
  if (data.file) formData.append('imageFile', data.file);

  return await apiAxios(`${ENDPOINTS.PROFILE}/${username}`, {
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putProfile = async (data: FormTypeProfileUpdate) => {
  const session = await getSession();
  const username = session?.user?.username;

  const formData = new FormData();
  if (data.name) formData.append('name', data.name);
  if (data.bio) formData.append('bio', data.bio);
  if (data.gender) formData.append('gender', data.gender);
  if (data.file) formData.append('imageFile', data.file);

  return await apiAxios(`${ENDPOINTS.PROFILE}/${username}`, {
    method: 'PUT',
    data: formData,
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putUser = async (payload: {
  username: string;
  email: string;
  password?: string;
}) => {
  const session = await getSession();
  return await apiAxios<{ status: number; data: PostRegisterType }>(
    ENDPOINTS.USER,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
      data: payload,
    }
  );
};
