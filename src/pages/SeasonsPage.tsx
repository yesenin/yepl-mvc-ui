import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

function SeasonsPage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" gutterBottom>
          Seasons
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent></CardContent>
      </Card>
    </Stack>
  );
}

export default SeasonsPage;
