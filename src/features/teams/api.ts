import type { PaginatedResponse, Season, Team } from './types';

const TEAMS_API_URL = 'http://localhost:5007/api/teams';
const SEASONS_API_URL = 'http://localhost:5007/api/seasons';

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function readJsonOrFallback<T>(response: Response, fallbackValue: T): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return fallbackValue;
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    return fallbackValue;
  }

  return JSON.parse(responseText) as T;
}

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(TEAMS_API_URL);
  return readJson<Team[]>(response);
}

export async function fetchTeam(teamId: string): Promise<Team> {
  const response = await fetch(`${TEAMS_API_URL}/${teamId}`);
  return readJson<Team>(response);
}

export async function updateTeam(team: Team): Promise<Team> {
  const response = await fetch(`${TEAMS_API_URL}/${team.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(team),
  });

  return readJsonOrFallback<Team>(response, team);
}

export async function fetchTeamSeasons(
  teamId: string,
  skip: number,
  take: number,
): Promise<PaginatedResponse<Season>> {
  const response = await fetch(`${TEAMS_API_URL}/${teamId}/seasons?skip=${skip}&take=${take}`);
  return readJson<PaginatedResponse<Season>>(response);
}

export async function fetchSeasons(): Promise<Season[]> {
  const response = await fetch(SEASONS_API_URL);
  return readJson<Season[]>(response);
}

export async function fetchSeason(seasonId: string): Promise<Season> {
  const response = await fetch(`${SEASONS_API_URL}/${seasonId}`);
  return readJson<Season>(response);
}

export async function fetchSeasonTeams(
  seasonId: string,
  skip: number,
  take: number,
): Promise<PaginatedResponse<Team>> {
  const response = await fetch(`${SEASONS_API_URL}/${seasonId}/teams?skip=${skip}&take=${take}`);
  return readJson<PaginatedResponse<Team>>(response);
}
