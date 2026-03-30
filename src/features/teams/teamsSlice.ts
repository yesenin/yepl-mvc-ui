import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { fetchTeam, fetchTeams, updateTeam } from './api';
import type { AsyncStatus, Team } from './types';

type TeamsState = {
  entities: Record<string, Team>;
  ids: string[];
  listStatus: AsyncStatus;
  listError: string | null;
  detailStatusById: Record<string, AsyncStatus>;
  detailErrorById: Record<string, string | null>;
  updateStatusById: Record<string, AsyncStatus>;
  updateErrorById: Record<string, string | null>;
};

const initialState: TeamsState = {
  entities: {},
  ids: [],
  listStatus: 'idle',
  listError: null,
  detailStatusById: {},
  detailErrorById: {},
  updateStatusById: {},
  updateErrorById: {},
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.length > 0
  ) {
    return error.message;
  }

  return 'Unexpected error';
}

export const loadTeams = createAsyncThunk('teams/loadTeams', async () => fetchTeams(), {
  condition: (_, { getState }) => {
    const state = getState() as RootState;
    return state.teams.listStatus !== 'loading' && state.teams.listStatus !== 'succeeded';
  },
});

export const loadTeamById = createAsyncThunk(
  'teams/loadTeamById',
  async (teamId: string) => fetchTeam(teamId),
  {
    condition: (teamId, { getState }) => {
      const state = getState() as RootState;
      const status = state.teams.detailStatusById[teamId] ?? 'idle';
      const team = state.teams.entities[teamId];

      return !(status === 'loading' || (status === 'succeeded' && team));
    },
  },
);

export const updateTeamById = createAsyncThunk('teams/updateTeamById', async (team: Team) =>
  updateTeam(team),
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamUpdateState: (state, action: { payload: string }) => {
      state.updateStatusById[action.payload] = 'idle';
      state.updateErrorById[action.payload] = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTeams.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(loadTeams.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.listError = null;
        state.ids = action.payload.map((team) => team.id);
        state.entities = action.payload.reduce<Record<string, Team>>((accumulator, team) => {
          accumulator[team.id] = team;
          return accumulator;
        }, {});

        for (const team of action.payload) {
          state.detailStatusById[team.id] = 'succeeded';
          state.detailErrorById[team.id] = null;
        }
      })
      .addCase(loadTeams.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.listStatus = 'failed';
        state.listError = getErrorMessage(action.error);
      })
      .addCase(loadTeamById.pending, (state, action) => {
        state.detailStatusById[action.meta.arg] = 'loading';
        state.detailErrorById[action.meta.arg] = null;
      })
      .addCase(loadTeamById.fulfilled, (state, action) => {
        const team = action.payload;

        state.entities[team.id] = team;
        if (!state.ids.includes(team.id)) {
          state.ids.push(team.id);
        }
        state.detailStatusById[team.id] = 'succeeded';
        state.detailErrorById[team.id] = null;
      })
      .addCase(loadTeamById.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.condition) {
          return;
        }

        state.detailStatusById[action.meta.arg] = 'failed';
        state.detailErrorById[action.meta.arg] = getErrorMessage(action.error);
      })
      .addCase(updateTeamById.pending, (state, action) => {
        const teamId = action.meta.arg.id;

        state.updateStatusById[teamId] = 'loading';
        state.updateErrorById[teamId] = null;
      })
      .addCase(updateTeamById.fulfilled, (state, action) => {
        const team = action.payload;

        state.entities[team.id] = team;
        if (!state.ids.includes(team.id)) {
          state.ids.push(team.id);
        }
        state.detailStatusById[team.id] = 'succeeded';
        state.detailErrorById[team.id] = null;
        state.updateStatusById[team.id] = 'succeeded';
        state.updateErrorById[team.id] = null;
      })
      .addCase(updateTeamById.rejected, (state, action) => {
        const teamId = action.meta.arg.id;

        state.updateStatusById[teamId] = 'failed';
        state.updateErrorById[teamId] = getErrorMessage(action.error);
      });
  },
});

const selectTeamsState = (state: RootState) => state.teams;

export const selectTeams = createSelector([selectTeamsState], (teamsState) =>
  teamsState.ids
    .map((teamId) => teamsState.entities[teamId])
    .filter((team): team is Team => team !== undefined),
);

export function selectTeamsListStatus(state: RootState) {
  return state.teams.listStatus;
}

export function selectTeamsListError(state: RootState) {
  return state.teams.listError;
}

export function selectTeamById(state: RootState, teamId: string) {
  return state.teams.entities[teamId] ?? null;
}

export function selectTeamStatus(state: RootState, teamId: string) {
  return state.teams.detailStatusById[teamId] ?? 'idle';
}

export function selectTeamError(state: RootState, teamId: string) {
  return state.teams.detailErrorById[teamId] ?? null;
}

export function selectTeamUpdateStatus(state: RootState, teamId: string) {
  return state.teams.updateStatusById[teamId] ?? 'idle';
}

export function selectTeamUpdateError(state: RootState, teamId: string) {
  return state.teams.updateErrorById[teamId] ?? null;
}

export const { clearTeamUpdateState } = teamsSlice.actions;

export default teamsSlice.reducer;
