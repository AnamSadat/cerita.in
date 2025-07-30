'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postBookmark } from '../prisma/apiPrisma';
import { BookmarkSliceState } from '@/types/slice';
import { deleteBookmark as deleteBookmarkApi } from '../prisma/apiPrisma';
import { BookmarkResponse } from '@/types/story';

// 👇 Tambahkan BookmarkResponse sebagai return type
export const fetchBookmark = createAsyncThunk<
  BookmarkResponse, // ✅ return type
  { story_id: number; notes?: string },
  { rejectValue: string }
>('bookmark/fetch', async ({ story_id, notes }, thunkAPI) => {
  try {
    const res = await postBookmark(story_id, notes);
    return res; // ⬅️ harus mengembalikan { data: { id, ... }, status }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return thunkAPI.rejectWithValue(err.message);
    }
    return thunkAPI.rejectWithValue('Gagal menyimpan bookmark');
  }
});

export const deleteBookmark = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>('bookmark/delete', async (id, thunkAPI) => {
  try {
    const response = await deleteBookmarkApi(id);
    return response;
  } catch (err: unknown) {
    if (err instanceof Error) return thunkAPI.rejectWithValue(err.message);
    return thunkAPI.rejectWithValue('Gagal hapus bookmark');
  }
});

const initialState: BookmarkSliceState = {
  loading: false,
  success: false,
  error: null,
};

export const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    resetBookmarkState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmark.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchBookmark.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchBookmark.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? 'Terjadi kesalahan';
      })
      .addCase(deleteBookmark.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteBookmark.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? 'Gagal hapus bookmark';
      });
  },
});

export const { resetBookmarkState } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
