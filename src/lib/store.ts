import { configureStore } from '@reduxjs/toolkit';
import storySlice from './features/storySlice';
import likeSlice from './features/likeSlice';

export const storeRedux = () => {
  return configureStore({
    reducer: {
      story: storySlice,
      like: likeSlice,
    },
  });
};

// Infer the type of store
export type AppStore = ReturnType<typeof storeRedux>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
