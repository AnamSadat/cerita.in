import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { postLike } from '../prisma/apiPrisma';
import { AsyncThunkConfig, LikeState, PostLikeResponse } from '@/types/slice';

type PostLikeConfig = AsyncThunkConfig<string, number>;

// Use in createAsyncThunk
export const fetchLike = createAsyncThunk<
  PostLikeConfig['returnType'],
  PostLikeConfig['argument'],
  { rejectValue: PostLikeConfig['rejectValue'] }
>('likes/fetchLike', async (story_id, thunkAPI) => {
  try {
    const response: PostLikeResponse = await postLike(story_id);
    return response.message;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const msg = axiosError.response?.data?.message ?? 'Gagal toggle like';
    return thunkAPI.rejectWithValue(msg);
  }
});

const initialState: LikeState = {
  loading: false,
  error: null,
  message: null,
};

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLike.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchLike.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Terjadi kesalahan';
      });
  },
});

export default likeSlice.reducer;
