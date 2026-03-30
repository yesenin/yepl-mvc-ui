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
  TextField,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { z } from 'zod';
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
  clearTeamUpdateState,
  selectTeamById,
  selectTeamError,
  selectTeamStatus,
  selectTeamUpdateError,
  selectTeamUpdateStatus,
  updateTeamById,
} from '../features/teams/teamsSlice';

const teamOverviewSchema = z.object({
  abbreviation: z.string().trim().max(50, 'Abbreviation must be 50 characters or fewer.'),
  optaId: z.string().trim().max(50, 'Opta id must be 50 characters or fewer.'),
});

type TeamOverviewFormValues = z.input<typeof teamOverviewSchema>;

function TeamDetailsPage() {
  const { teamId = '' } = useParams();
  const dispatch = useAppDispatch();
  const selectTeamSeasons = useMemo(makeSelectTeamSeasons, []);
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<TeamOverviewFormValues>({
    defaultValues: {
      abbreviation: '',
      optaId: '',
    },
  });
  const team = useAppSelector((state) => selectTeamById(state, teamId));
  const teamStatus = useAppSelector((state) => selectTeamStatus(state, teamId));
  const teamError = useAppSelector((state) => selectTeamError(state, teamId));
  const teamUpdateStatus = useAppSelector((state) => selectTeamUpdateStatus(state, teamId));
  const teamUpdateError = useAppSelector((state) => selectTeamUpdateError(state, teamId));
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

  useEffect(() => {
    if (team) {
      reset({
        abbreviation: team.abbreviation ?? '',
        optaId: team.optaId ?? '',
      });
    }
  }, [reset, team]);

  const isSaving = teamUpdateStatus === 'loading';

  function handleStartEditing() {
    if (!team) {
      return;
    }

    dispatch(clearTeamUpdateState(team.id));
    clearErrors();
    reset({
      abbreviation: team.abbreviation ?? '',
      optaId: team.optaId ?? '',
    });
    setIsEditingOverview(true);
  }

  function handleCancelEditing() {
    if (team) {
      dispatch(clearTeamUpdateState(team.id));
      reset({
        abbreviation: team.abbreviation ?? '',
        optaId: team.optaId ?? '',
      });
    }

    clearErrors();
    setIsEditingOverview(false);
  }

  const handleSaveOverview = handleSubmit(async (values) => {
    if (!team) {
      return;
    }

    dispatch(clearTeamUpdateState(team.id));
    clearErrors();
    const parsedValues = teamOverviewSchema.safeParse(values);

    if (!parsedValues.success) {
      for (const issue of parsedValues.error.issues) {
        const field = issue.path[0];

        if (field === 'abbreviation' || field === 'optaId') {
          setError(field, {
            type: 'manual',
            message: issue.message,
          });
        }
      }

      return;
    }

    let updatedTeam;

    try {
      updatedTeam = await dispatch(
        updateTeamById({
          ...team,
          abbreviation: parsedValues.data.abbreviation || null,
          optaId: parsedValues.data.optaId || null,
        }),
      ).unwrap();
    } catch {
      return;
    }

    reset({
      abbreviation: updatedTeam.abbreviation ?? '',
      optaId: updatedTeam.optaId ?? '',
    });

    setIsEditingOverview(false);
  });

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
            <Stack
              spacing={2}
              component={isEditingOverview ? 'form' : 'div'}
              onSubmit={isEditingOverview ? handleSaveOverview : undefined}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Typography variant="h5">Overview</Typography>

                {!isEditingOverview ? (
                  <Button
                    startIcon={<EditOutlinedIcon fontSize="small" />}
                    onClick={handleStartEditing}
                    variant="outlined"
                    disabled={isSaving}
                  >
                    Edit overview
                  </Button>
                ) : null}
              </Stack>

              {teamUpdateError ? (
                <Alert severity="error">Failed to save team: {teamUpdateError}</Alert>
              ) : null}

              {isEditingOverview ? (
                <>
                  <TextField
                    {...register('abbreviation')}
                    label="Abbreviation"
                    size="small"
                    autoFocus
                    error={Boolean(errors.abbreviation)}
                    helperText={errors.abbreviation?.message}
                  />
                  <TextField
                    {...register('optaId')}
                    label="Opta id"
                    size="small"
                    error={Boolean(errors.optaId)}
                    helperText={errors.optaId?.message}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button type="submit" variant="contained" disabled={isSaving}>
                      Save
                    </Button>
                    <Button onClick={handleCancelEditing} variant="text" disabled={isSaving}>
                      Cancel
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography color="text.secondary">
                    Abbreviation: {team.abbreviation ?? 'Not available'}
                  </Typography>
                  <Typography color="text.secondary">
                    Opta id: {team.optaId ?? 'Not available'}
                  </Typography>
                </>
              )}
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
