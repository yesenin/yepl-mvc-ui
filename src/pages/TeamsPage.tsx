import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

function TeamsPage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Teams
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">List of teams</Typography>
            <Typography color="text.secondary">
              There will be a list of all teams. With pagination!
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default TeamsPage;
