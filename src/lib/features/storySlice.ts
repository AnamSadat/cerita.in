'use client';

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getStory } from '../prisma/apiPrisma';
import { StoryFromDB } from '@/types/story';
import { StorySlice } from '@/types/story';

export const fetchStory = createAsyncThunk<StoryFromDB[]>(
  'story/fetchStories',
  async () => {
    const res = await getStory();

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
    }));
  }
);

const initialState: StorySlice = {
  items: [],
  loading: false,
  error: null,
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
      });
  },
});

export const { addStory, deleteStory, updateStory } = storySlice.actions;
export default storySlice.reducer;
