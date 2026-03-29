import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

function GamesPage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Games
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">List of games</Typography>
            <Typography color="text.secondary">
              There will be a table with all games. With pagination!
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default GamesPage;
