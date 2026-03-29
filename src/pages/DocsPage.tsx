import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'

const commands = [
  { command: 'npm run dev', description: 'Start the Vite development server.' },
  { command: 'npm run build', description: 'Create a production bundle.' },
  { command: 'npm run test', description: 'Run Jest tests once in jsdom.' },
  { command: 'npm run test:watch', description: 'Run Jest in watch mode during development.' },
]

function DocsPage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" color="primary.main">
          Starter docs
        </Typography>
        <Typography variant="h3" gutterBottom>
          What is included
        </Typography>
        <Typography color="text.secondary">
          The project starts with React Router for navigation, Material UI for the shell, and Jest with React Testing Library for UI tests.
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Stack divider={<Divider flexItem />} spacing={2}>
            {commands.map((item) => (
              <Stack key={item.command} direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                <Typography component="code" sx={{ fontWeight: 700 }}>
                  {item.command}
                </Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export default DocsPage
