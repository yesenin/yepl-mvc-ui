import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function HomePage() {
  return (
    <Stack spacing={6}>
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <Typography variant="overline" color="primary.main">
          yepl-mvc ui
        </Typography>
        <Typography variant="h2">yepl CMS (kinda)</Typography>
        <Typography variant="h6" color="text.secondary">
          It's a nice place for some dashboard, right?
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={RouterLink} to="/games" size="large" variant="contained">
            Games
          </Button>
          <Button
            component="a"
            href="https://github.com/yesenin/yepl-mvc/"
            size="large"
            variant="outlined"
            target="_blank"
            rel="noopener noreferrer"
          >
            yepl-mvc
          </Button>
          <Button
            component="a"
            href="https://github.com/yesenin/yepl-mvc-ui/"
            size="large"
            variant="outlined"
            target="_blank"
            rel="noopener noreferrer"
          >
            yepl-mvc-ui
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HomePage;
