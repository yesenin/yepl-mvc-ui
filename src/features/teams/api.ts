import type { PaginatedResponse, Season, Team } from './types';

const TEAMS_API_URL = 'http://localhost:5007/api/teams';

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchTeams(): Promise<Team[]> {
  const response = await fetch(TEAMS_API_URL);
  return readJson<Team[]>(response);
}

export async function fetchTeam(teamId: string): Promise<Team> {
  const response = await fetch(`${TEAMS_API_URL}/${teamId}`);
  return readJson<Team>(response);
}

export async function fetchTeamSeasons(
  teamId: string,
  skip: number,
  take: number,
): Promise<PaginatedResponse<Season>> {
  const response = await fetch(`${TEAMS_API_URL}/${teamId}/seasons?skip=${skip}&take=${take}`);
  return readJson<PaginatedResponse<Season>>(response);
}
