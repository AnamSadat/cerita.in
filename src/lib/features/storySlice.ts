'use client';

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getStory, getStoryBySlug } from '../prisma/apiPrisma';
import { StoryFromDB } from '@/types/story';
import { StorySlice } from '@/types/story';

export const fetchStory = createAsyncThunk<StoryFromDB[], number | undefined>(
  'story/fetchStories',
  async (userId) => {
    const res = await getStory();
    console.log('🚀 response getStory:', res);

    await new Promise((resolve) => setTimeout(resolve, 7000));

    if (!Array.isArray(res)) {
      throw new Error('Response is not an array!');
    }

    return res.map((story) => ({
      id: story.id,
      title: story.title,
      short_description: story.short_description,
      category: story.category,
      slug: story.slug,
      content: story.content,
      img_url: story.img_url,
      created_at: story.created_at,
      user: story.user,
      likesCount: story._count?.likes ?? 0,
      bookmarksCount: story._count?.bookmarks ?? 0,
      isLiked: story.likes?.some((like) => like.user_id === userId) ?? false,
      isBookmarked:
        story.bookmarks?.some((bm) => bm.user_id === userId) ?? false,
      likes: story.likes,
      bookmarks: story.bookmarks,
    }));
  }
);

export const fetchStoryBySlug = createAsyncThunk<StoryFromDB, string>(
  'story/fetchStoryBySlug',
  async (slug) => {
    const res = await getStoryBySlug(slug);
    return res;
  }
);

const initialState: StorySlice = {
  items: [],
  loading: false,
  error: null,
  detail: null,
  loadingDetail: false,
  errorDetail: null,
};

export const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<StoryFromDB>) => {
      state.items.push(action.payload);
    },

    deleteStory: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((anime) => anime.id !== action.payload);
    },

    updateStory: (state, action: PayloadAction<StoryFromDB>) => {
      const update = state.items.findIndex(
        (anime) => anime.id === action.payload.id
      );
      if (update !== -1) {
        state.items[update] = action.payload;
      }
    },
    setStoryDetail: (state, action) => {
      state.detail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Terjadi Kesalahan';
      })
      .addCase(fetchStoryBySlug.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
        state.detail = null;
      })
      .addCase(fetchStoryBySlug.fulfilled, (state, action) => {
        console.log('📦 PAYLOAD:', action.payload);
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchStoryBySlug.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.error.message ?? 'Gagal memuat story detail';
      });
  },
});

export const { addStory, deleteStory, updateStory, setStoryDetail } =
  storySlice.actions;
export default storySlice.reducer;
