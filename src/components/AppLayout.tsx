import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
]

function AppLayout() {
  const location = useLocation()

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider', backdropFilter: 'blur(14px)' }}
      >
        <Toolbar sx={{ mx: 'auto', width: '100%', maxWidth: 1200, px: { xs: 2, md: 3 } }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ color: 'text.primary', textDecoration: 'none', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Yepl MVC UI
          </Typography>
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            {navigationItems.map((item) => {
              const selected = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)

              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  color={selected ? 'primary' : 'inherit'}
                  variant={selected ? 'contained' : 'text'}
                >
                  {item.label}
                </Button>
              )
            })}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default AppLayout
