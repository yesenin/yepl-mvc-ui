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
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadSeasonById,
  loadSeasonTeams,
  makeSelectSeasonTeams,
  selectSeasonById,
  selectSeasonError,
  selectSeasonTeamsError,
  selectSeasonTeamsStatus,
  selectSeasonTeamsTotal,
  selectSeasonStatus,
} from '../features/seasons/seasonsSlice';

function SeasonDetailsPage() {
  const { seasonId = '' } = useParams();
  const dispatch = useAppDispatch();
  const selectSeasonTeams = useMemo(makeSelectSeasonTeams, []);
  const season = useAppSelector((state) => selectSeasonById(state, seasonId));
  const seasonStatus = useAppSelector((state) => selectSeasonStatus(state, seasonId));
  const seasonError = useAppSelector((state) => selectSeasonError(state, seasonId));
  const teams = useAppSelector((state) => selectSeasonTeams(state, seasonId));
  const teamsStatus = useAppSelector((state) => selectSeasonTeamsStatus(state, seasonId));
  const teamsError = useAppSelector((state) => selectSeasonTeamsError(state, seasonId));
  const teamsTotal = useAppSelector((state) => selectSeasonTeamsTotal(state, seasonId));

  useEffect(() => {
    if (seasonId) {
      void dispatch(loadSeasonById(seasonId));
      void dispatch(loadSeasonTeams(seasonId));
    }
  }, [dispatch, seasonId]);

  return (
    <Stack spacing={4}>
      <Box>
        <Button component={RouterLink} to="/seasons" variant="text" sx={{ px: 0, mb: 2 }}>
          Back to seasons
        </Button>
        <Typography variant="h3" gutterBottom>
          {season?.title ?? 'Season details'}
        </Typography>
        <Typography color="text.secondary">Season id: {seasonId || 'Unknown'}</Typography>
      </Box>

      {seasonStatus === 'loading' ? (
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Loading season details...</Typography>
        </Stack>
      ) : null}

      {seasonError ? <Alert severity="error">Failed to load season: {seasonError}</Alert> : null}

      {season ? (
        <Card sx={{ borderRadius: 1 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h5">Overview</Typography>
              <Typography color="text.secondary">Title: {season.title}</Typography>
              <Typography color="text.secondary">Id: {season.id}</Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5">Teams</Typography>

            {teamsStatus === 'loading' ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography>Loading teams...</Typography>
              </Stack>
            ) : null}

            {teamsError ? <Alert severity="error">Failed to load teams: {teamsError}</Alert> : null}

            {teamsStatus === 'succeeded' && teams.length === 0 ? (
              <Typography color="text.secondary">No teams were found for this season.</Typography>
            ) : null}

            {teams.length > 0 ? (
              <List disablePadding>
                {teams.map((team) => (
                  <ListItem key={team.id} disablePadding>
                    <ListItemButton component={RouterLink} to={`/teams/${team.id}`}>
                      <ListItemText
                        primary={team.name}
                        secondary={team.abbreviation ?? `Team id: ${team.id}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}

            {teamsTotal > 0 ? (
              <Typography color="text.secondary">Showing {teams.length} teams.</Typography>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      {!season && seasonStatus === 'failed' ? (
        <Alert severity="warning">The requested season could not be found.</Alert>
      ) : null}
    </Stack>
  );
}

export default SeasonDetailsPage;
