import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { fetchSeason, fetchSeasonTeams, fetchSeasons, fetchTeamSeasons } from '../teams/api';
import type { AsyncStatus, Season, Team } from '../teams/types';

export const TEAM_SEASONS_PAGE_SIZE = 10;
export const SEASON_TEAMS_TAKE = 22;

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
  ids: string[];
  listStatus: AsyncStatus;
  listError: string | null;
  detailStatusById: Record<string, AsyncStatus>;
  detailErrorById: Record<string, string | null>;
  byTeamId: Record<string, TeamSeasonsBucket>;
  seasonTeamsBySeasonId: Record<
    string,
    {
      ids: string[];
      status: AsyncStatus;
      error: string | null;
      total: number;
      take: number;
    }
  >;
  teamEntities: Record<string, Team>;
};

const initialState: SeasonsState = {
  entities: {},
  ids: [],
  listStatus: 'idle',
  listError: null,
  detailStatusById: {},
  detailErrorById: {},
  byTeamId: {},
  seasonTeamsBySeasonId: {},
  teamEntities: {},
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

function createSeasonTeamsBucket() {
  return {
    ids: [],
    status: 'idle' as AsyncStatus,
    error: null as string | null,
    total: 0,
    take: SEASON_TEAMS_TAKE,
  };
}

export const loadSeasons = createAsyncThunk('seasons/loadSeasons', async () => fetchSeasons(), {
  condition: (_, { getState }) => {
    const state = getState() as RootState;
    return state.seasons.listStatus !== 'loading' && state.seasons.listStatus !== 'succeeded';
  },
});

export const loadSeasonById = createAsyncThunk(
  'seasons/loadSeasonById',
  async (seasonId: string) => fetchSeason(seasonId),
  {
    condition: (seasonId, { getState }) => {
      const state = getState() as RootState;
      const status = state.seasons.detailStatusById[seasonId] ?? 'idle';
      const season = state.seasons.entities[seasonId];

      return !(status === 'loading' || (status === 'succeeded' && season));
    },
  },
);

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

export const loadSeasonTeams = createAsyncThunk(
  'seasons/loadSeasonTeams',
  async (seasonId: string) => {
    const response = await fetchSeasonTeams(seasonId, 0, SEASON_TEAMS_TAKE);
    return { seasonId, response };
  },
  {
    condition: (seasonId, { getState }) => {
      const state = getState() as RootState;
      const bucket = state.seasons.seasonTeamsBySeasonId[seasonId];
      return bucket?.status !== 'loading' && bucket?.status !== 'succeeded';
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
      .addCase(loadSeasons.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(loadSeasons.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.listError = null;
        state.ids = action.payload.map((season) => season.id);

        for (const season of action.payload) {
          state.entities[season.id] = season;
          state.detailStatusById[season.id] = 'succeeded';
          state.detailErrorById[season.id] = null;
        }
      })
      .addCase(loadSeasons.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.listStatus = 'failed';
        state.listError = getErrorMessage(action.error);
      })
      .addCase(loadSeasonById.pending, (state, action) => {
        state.detailStatusById[action.meta.arg] = 'loading';
        state.detailErrorById[action.meta.arg] = null;
      })
      .addCase(loadSeasonById.fulfilled, (state, action) => {
        const season = action.payload;

        state.entities[season.id] = season;
        if (!state.ids.includes(season.id)) {
          state.ids.push(season.id);
        }
        state.detailStatusById[season.id] = 'succeeded';
        state.detailErrorById[season.id] = null;
      })
      .addCase(loadSeasonById.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.detailStatusById[action.meta.arg] = 'failed';
        state.detailErrorById[action.meta.arg] = getErrorMessage(action.error);
      })
      .addCase(loadSeasonTeams.pending, (state, action) => {
        const seasonId = action.meta.arg;
        const bucket = state.seasonTeamsBySeasonId[seasonId] ?? createSeasonTeamsBucket();

        bucket.status = 'loading';
        bucket.error = null;
        state.seasonTeamsBySeasonId[seasonId] = bucket;
      })
      .addCase(loadSeasonTeams.fulfilled, (state, action) => {
        const {
          seasonId,
          response: { items, take, total },
        } = action.payload;
        const bucket = state.seasonTeamsBySeasonId[seasonId] ?? createSeasonTeamsBucket();

        for (const team of items) {
          state.teamEntities[team.id] = team;
        }

        bucket.ids = items.map((team) => team.id);
        bucket.status = 'succeeded';
        bucket.error = null;
        bucket.total = total;
        bucket.take = take;
        state.seasonTeamsBySeasonId[seasonId] = bucket;
      })
      .addCase(loadSeasonTeams.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        const seasonId = action.meta.arg;
        const bucket = state.seasonTeamsBySeasonId[seasonId] ?? createSeasonTeamsBucket();

        bucket.status = 'failed';
        bucket.error = getErrorMessage(action.error);
        state.seasonTeamsBySeasonId[seasonId] = bucket;
      })
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

const selectSeasonsState = (state: RootState) => state.seasons;

export const selectSeasons = createSelector([selectSeasonsState], (seasonsState) =>
  seasonsState.ids
    .map((seasonId) => seasonsState.entities[seasonId])
    .filter((season): season is Season => season !== undefined),
);

export function selectSeasonsListStatus(state: RootState) {
  return state.seasons.listStatus;
}

export function selectSeasonsListError(state: RootState) {
  return state.seasons.listError;
}

export function selectSeasonById(state: RootState, seasonId: string) {
  return state.seasons.entities[seasonId] ?? null;
}

export function selectSeasonStatus(state: RootState, seasonId: string) {
  return state.seasons.detailStatusById[seasonId] ?? 'idle';
}

export function selectSeasonError(state: RootState, seasonId: string) {
  return state.seasons.detailErrorById[seasonId] ?? null;
}

export function makeSelectSeasonTeams() {
  return createSelector(
    [selectSeasonsState, (_state: RootState, seasonId: string) => seasonId],
    (seasonsState, seasonId) => {
      const bucket = seasonsState.seasonTeamsBySeasonId[seasonId];
      const ids = bucket?.ids ?? [];

      return ids
        .map((teamId) => seasonsState.teamEntities[teamId])
        .filter((team): team is Team => team !== undefined);
    },
  );
}

export function selectSeasonTeamsStatus(state: RootState, seasonId: string) {
  return state.seasons.seasonTeamsBySeasonId[seasonId]?.status ?? 'idle';
}

export function selectSeasonTeamsError(state: RootState, seasonId: string) {
  return state.seasons.seasonTeamsBySeasonId[seasonId]?.error ?? null;
}

export function selectSeasonTeamsTotal(state: RootState, seasonId: string) {
  return state.seasons.seasonTeamsBySeasonId[seasonId]?.total ?? 0;
}

export function selectTeamSeasonsCurrentPage(state: RootState, teamId: string) {
  return state.seasons.byTeamId[teamId]?.currentPage ?? 1;
}

export function makeSelectTeamSeasons() {
  return createSelector(
    [selectSeasonsState, (_state: RootState, teamId: string) => teamId],
    (seasonsState, teamId) => {
      const bucket = seasonsState.byTeamId[teamId];
      const page = bucket?.currentPage ?? 1;
      const ids = bucket?.pageIds[page] ?? [];

      return ids
        .map((seasonId) => seasonsState.entities[seasonId])
        .filter((season): season is Season => season !== undefined);
    },
  );
}

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
