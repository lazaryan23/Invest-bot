import { Container, Title, Text, Button, Stack, ThemeIcon } from '@mantine/core';
import { IconError404 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md">
        <ThemeIcon size={120} variant="light" color="blue">
          <IconError404 size={80} />
        </ThemeIcon>
        
        <Title order={1}>404</Title>
        <Title order={2} ta="center">Page Not Found</Title>
        
        <Text c="dimmed" ta="center" size="lg">
          The page you are looking for doesn't exist.
        </Text>
        
        <Button component={Link} to="/dashboard" size="md">
          Go to Dashboard
        </Button>
      </Stack>
    </Container>
  );
}