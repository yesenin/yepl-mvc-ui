import {
  Alert,
  Box,
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
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadTeams,
  selectTeams,
  selectTeamsListError,
  selectTeamsListStatus,
} from '../features/teams/teamsSlice';

function TeamsPage() {
  const dispatch = useAppDispatch();
  const teams = useAppSelector(selectTeams);
  const listError = useAppSelector(selectTeamsListError);
  const listStatus = useAppSelector(selectTeamsListStatus);

  useEffect(() => {
    void dispatch(loadTeams());
  }, [dispatch]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Teams
        </Typography>
        <Typography color="text.secondary">
          Browse all teams from the API and open an individual page for each team.
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">List of teams</Typography>

            {listStatus === 'loading' ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography>Loading teams...</Typography>
              </Stack>
            ) : null}

            {listError ? <Alert severity="error">Failed to load teams: {listError}</Alert> : null}

            {listStatus === 'succeeded' ? (
              <List disablePadding>
                {teams.map((team) => (
                  <ListItem key={team.id} disablePadding>
                    <ListItemButton component={RouterLink} to={`/teams/${team.id}`}>
                      <ListItemText
                        primary={team.name}
                        secondary={team.abbreviation ?? `ID: ${team.id}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default TeamsPage;
