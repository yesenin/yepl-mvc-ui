import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const highlights = [
  {
    title: 'Fast local development',
    description: 'Vite keeps startup and HMR tight while TypeScript catches mistakes early.',
  },
  {
    title: 'Structured routing',
    description: 'The app ships with a shared layout and starter pages so features have a place to land.',
  },
  {
    title: 'Test-ready by default',
    description: 'Jest and React Testing Library are wired in for component and navigation coverage.',
  },
]

function HomePage() {
  return (
    <Stack spacing={6}>
      <Stack spacing={3} sx={{ maxWidth: 760 }}>
        <Typography variant="overline" color="primary.main">
          Vite + React Router + Material UI
        </Typography>
        <Typography variant="h2">
          A production-ready React starter with routing, theming, and test support already wired.
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Use this as the UI entry point for the MVC surface instead of rebuilding setup code for every feature.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component={RouterLink} to="/docs" size="large" variant="contained">
            Open starter docs
          </Button>
          <Button component="a" href="https://mui.com/material-ui/getting-started/overview/" size="large" variant="outlined">
            Material UI reference
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {highlights.map((item) => (
          <Card key={item.title} sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5">{item.title}</Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  )
}

export default HomePage
