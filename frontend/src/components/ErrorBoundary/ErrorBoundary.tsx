import React, { Component, ReactNode } from 'react';
import { Container, Text, Button, Stack, Alert } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="md">
            <Alert
              icon={<IconAlertCircle size={24} />}
              title="Something went wrong"
              color="red"
              variant="light"
            >
              <Stack gap="sm">
                <Text size="sm">
                  We're sorry, but something unexpected happened. Please try refreshing the page.
                </Text>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Text size="xs" c="dimmed" ff="monospace">
                    {this.state.error.message}
                  </Text>
                )}
              </Stack>
            </Alert>

            <Button
              leftSection={<IconRefresh size={16} />}
              onClick={this.handleReload}
              variant="light"
            >
              Refresh Page
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}