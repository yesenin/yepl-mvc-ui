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
  loadSeasons,
  selectSeasons,
  selectSeasonsListError,
  selectSeasonsListStatus,
} from '../features/seasons/seasonsSlice';

function SeasonsPage() {
  const dispatch = useAppDispatch();
  const seasons = useAppSelector(selectSeasons);
  const listStatus = useAppSelector(selectSeasonsListStatus);
  const listError = useAppSelector(selectSeasonsListError);

  useEffect(() => {
    void dispatch(loadSeasons());
  }, [dispatch]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Seasons
        </Typography>
        <Typography color="text.secondary">
          Browse all seasons and open the details page for any individual season.
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 1 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">List of seasons</Typography>

            {listStatus === 'loading' ? (
              <Stack direction="row" spacing={2} alignItems="center">
                <CircularProgress size={24} />
                <Typography>Loading seasons...</Typography>
              </Stack>
            ) : null}

            {listError ? <Alert severity="error">Failed to load seasons: {listError}</Alert> : null}

            {listStatus === 'succeeded' ? (
              <List disablePadding>
                {seasons.map((season) => (
                  <ListItem key={season.id} disablePadding>
                    <ListItemButton component={RouterLink} to={`/seasons/${season.id}`}>
                      <ListItemText primary={season.title} secondary={`ID: ${season.id}`} />
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

export default SeasonsPage;
