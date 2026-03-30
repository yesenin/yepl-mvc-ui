import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { fetchTeamSeasons } from '../teams/api';
import type { AsyncStatus, Season } from '../teams/types';

export const TEAM_SEASONS_PAGE_SIZE = 10;

type TeamSeasonsBucket = {
  currentPage: number;
  total: number;
  take: number;
  pageIds: Record<number, string[]>;
  pageStatus: Record<number, AsyncStatus>;
  pageError: Record<number, string | null>;
};

type SeasonsState = {
  entities: Record<string, Season>;
  byTeamId: Record<string, TeamSeasonsBucket>;
};

const initialState: SeasonsState = {
  entities: {},
  byTeamId: {},
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}

function createTeamBucket(): TeamSeasonsBucket {
  return {
    currentPage: 1,
    total: 0,
    take: TEAM_SEASONS_PAGE_SIZE,
    pageIds: {},
    pageStatus: {},
    pageError: {},
  };
}

export const loadTeamSeasonsPage = createAsyncThunk(
  'seasons/loadTeamSeasonsPage',
  async ({ teamId, page }: { teamId: string; page: number }) => {
    const skip = (page - 1) * TEAM_SEASONS_PAGE_SIZE;
    const response = await fetchTeamSeasons(teamId, skip, TEAM_SEASONS_PAGE_SIZE);

    return { teamId, page, response };
  },
  {
    condition: ({ teamId, page }, { getState }) => {
      const state = getState() as RootState;
      const bucket = state.seasons.byTeamId[teamId];
      const status = bucket?.pageStatus[page] ?? 'idle';

      return status !== 'loading' && status !== 'succeeded';
    },
  },
);

const seasonsSlice = createSlice({
  name: 'seasons',
  initialState,
  reducers: {
    setTeamSeasonsPage: (state, action: { payload: { teamId: string; page: number } }) => {
      const { teamId, page } = action.payload;
      const bucket = state.byTeamId[teamId] ?? createTeamBucket();

      bucket.currentPage = page;
      state.byTeamId[teamId] = bucket;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTeamSeasonsPage.pending, (state, action) => {
        const { teamId, page } = action.meta.arg;
        const bucket = state.byTeamId[teamId] ?? createTeamBucket();

        bucket.currentPage = page;
        bucket.pageStatus[page] = 'loading';
        bucket.pageError[page] = null;
        state.byTeamId[teamId] = bucket;
      })
      .addCase(loadTeamSeasonsPage.fulfilled, (state, action) => {
        const {
          teamId,
          page,
          response: { items, take, total },
        } = action.payload;
        const bucket = state.byTeamId[teamId] ?? createTeamBucket();

        for (const season of items) {
          state.entities[season.id] = season;
        }

        bucket.currentPage = page;
        bucket.total = total;
        bucket.take = take;
        bucket.pageIds[page] = items.map((season) => season.id);
        bucket.pageStatus[page] = 'succeeded';
        bucket.pageError[page] = null;
        state.byTeamId[teamId] = bucket;
      })
      .addCase(loadTeamSeasonsPage.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        const { teamId, page } = action.meta.arg;
        const bucket = state.byTeamId[teamId] ?? createTeamBucket();

        bucket.currentPage = page;
        bucket.pageStatus[page] = 'failed';
        bucket.pageError[page] = getErrorMessage(action.error);
        state.byTeamId[teamId] = bucket;
      });
  },
});

export const { setTeamSeasonsPage } = seasonsSlice.actions;

export function selectTeamSeasonsCurrentPage(state: RootState, teamId: string) {
  return state.seasons.byTeamId[teamId]?.currentPage ?? 1;
}

const selectSeasonsState = (state: RootState) => state.seasons;
const selectSeasonsTeamId = (_state: RootState, teamId: string) => teamId;

export const selectTeamSeasons = createSelector(
  [selectSeasonsState, selectSeasonsTeamId],
  (seasonsState, teamId) => {
    const bucket = seasonsState.byTeamId[teamId];
    const page = bucket?.currentPage ?? 1;
    const ids = bucket?.pageIds[page] ?? [];

    return ids
      .map((seasonId) => seasonsState.entities[seasonId])
      .filter((season): season is Season => season !== undefined);
  },
);

export function selectTeamSeasonsStatus(state: RootState, teamId: string) {
  const bucket = state.seasons.byTeamId[teamId];
  const page = bucket?.currentPage ?? 1;
  return bucket?.pageStatus[page] ?? 'idle';
}

export function selectTeamSeasonsError(state: RootState, teamId: string) {
  const bucket = state.seasons.byTeamId[teamId];
  const page = bucket?.currentPage ?? 1;
  return bucket?.pageError[page] ?? null;
}

export function selectTeamSeasonsTotalPages(state: RootState, teamId: string) {
  const bucket = state.seasons.byTeamId[teamId];
  const total = bucket?.total ?? 0;
  const take = bucket?.take ?? TEAM_SEASONS_PAGE_SIZE;

  return total > 0 ? Math.ceil(total / take) : 0;
}

export default seasonsSlice.reducer;
