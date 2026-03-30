import { configureStore } from '@reduxjs/toolkit';
import seasonsReducer from '../features/seasons/seasonsSlice';
import teamsReducer from '../features/teams/teamsSlice';

export function createAppStore() {
  return configureStore({
    reducer: {
      teams: teamsReducer,
      seasons: seasonsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];