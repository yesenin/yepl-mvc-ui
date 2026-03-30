import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadTeamSeasonsPage,
  makeSelectTeamSeasons,
  selectTeamSeasonsCurrentPage,
  selectTeamSeasonsError,
  selectTeamSeasonsStatus,
  selectTeamSeasonsTotalPages,
  setTeamSeasonsPage,
} from '../features/seasons/seasonsSlice';
import {
  loadTeamById,
  selectTeamById,
  selectTeamError,
  selectTeamStatus,
} from '../features/teams/teamsSlice';

function TeamDetailsPage() {
  const { teamId = '' } = useParams();
  const dispatch = useAppDispatch();
  const selectTeamSeasons = useMemo(makeSelectTeamSeasons, []);
  const team = useAppSelector((state) => selectTeamById(state, teamId));
  const teamStatus = useAppSelector((state) => selectTeamStatus(state, teamId));
  const teamError = useAppSelector((state) => selectTeamError(state, teamId));
  const currentPage = useAppSelector((state) => selectTeamSeasonsCurrentPage(state, teamId));
  const seasons = useAppSelector((state) => selectTeamSeasons(state, teamId));
  const seasonsStatus = useAppSelector((state) => selectTeamSeasonsStatus(state, teamId));
  const seasonsError = useAppSelector((state) => selectTeamSeasonsError(state, teamId));
  const totalPages = useAppSelector((state) => selectTeamSeasonsTotalPages(state, teamId));

  useEffect(() => {
    if (teamId) {
      void dispatch(loadTeamById(teamId));
      void dispatch(loadTeamSeasonsPage({ teamId, page: currentPage }));
    }
  }, [currentPage, dispatch, teamId]);

  return (
    <Stack spacing={4}>
      <Box>
        <Button component={RouterLink} to="/teams" variant="text" sx={{ px: 0, mb: 2 }}>
          Back to teams
        </Button>
        <Typography variant="h3" gutterBottom>
          {team?.name ?? 'Team details'}
        </Typography>
        <Typography color="text.secondary">Team id: {teamId || 'Unknown'}</Typography>
      </Box>

      {teamStatus === 'loading' ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading team details...</Typography>
        </Stack>
      ) : null}

      {teamError ? <Alert severity="error">Failed to load team: {teamError}</Alert> : null}

      {team ? (
        <Card sx={{ borderRadius: 1 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Overview</Typography>
              <Typography color="text.secondary">
                Abbreviation: {team.abbreviation ?? 'Not available'}
              </Typography>
              <Typography color="text.secondary">
                Opta id: {team.optaId ?? 'Not available'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5">Seasons</Typography>

            {seasonsStatus === 'loading' ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography>Loading seasons...</Typography>
              </Stack>
            ) : null}

            {seasonsError ? (
              <Alert severity="error">Failed to load seasons: {seasonsError}</Alert>
            ) : null}

            {seasonsStatus === 'succeeded' && seasons.length === 0 ? (
              <Typography color="text.secondary">No seasons were found for this team.</Typography>
            ) : null}

            {seasons.length > 0 ? (
              <List disablePadding>
                {seasons.map((season) => (
                  <ListItem key={season.id} disablePadding>
                    <ListItemButton component={RouterLink} to={`/seasons/${season.id}`}>
                      <ListItemText primary={season.title} secondary={`Season id: ${season.id}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}

            {totalPages > 1 ? (
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => {
                  dispatch(setTeamSeasonsPage({ teamId, page }));
                }}
                color="primary"
                shape="rounded"
              />
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      {!team && teamStatus === 'failed' ? (
        <Alert severity="warning">The requested team could not be found.</Alert>
      ) : null}
    </Stack>
  );
}

export default TeamDetailsPage;
