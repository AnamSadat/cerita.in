import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AxiosError } from 'axios';
import { postLike, deleteLike } from '../prisma/apiPrisma';
import { AsyncThunkConfig, LikeState, PostLikeResponse } from '@/types/slice';

type PostLikeConfig = AsyncThunkConfig<string, number>;

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

export const deleteLikes = createAsyncThunk<
  { storyId: number },
  { storyId: number; likeId: number }
>('like/deleteLike', async ({ storyId, likeId }) => {
  await deleteLike(likeId);
  return { storyId };
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
      })
      .addCase(deleteLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLikes.fulfilled, (state) => {
        state.loading = false;
        state.message = 'Berhasil unlike';
        // opsional: update story._count.likes--
      })
      .addCase(deleteLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Gagal unlike';
      });
  },
});

export default likeSlice.reducer;
