import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function NotFoundPage() {
  return (
    <Stack spacing={3} alignItems="flex-start">
      <Typography variant="overline" color="primary.main">
        404
      </Typography>
      <Typography variant="h3">Page not found</Typography>
      <Typography color="text.secondary">
        The requested route does not exist in this starter app yet.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Return home
      </Button>
    </Stack>
  )
}

export default NotFoundPage
