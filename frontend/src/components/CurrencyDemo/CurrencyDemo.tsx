import { Card, Stack, Text, Group, Badge } from '@mantine/core';
import { useSettings } from '@/contexts/SettingsContext';

const testAmounts = [
  { label: 'Small Amount', amount: 25.50 },
  { label: 'Medium Amount', amount: 1250.75 },
  { label: 'Large Amount', amount: 50000.00 },
  { label: 'Crypto Amount', amount: 0.0025 },
];

export function CurrencyDemo() {
  const { formatCurrency, currency, getCurrencySymbol } = useSettings();

  return (
    <Card withBorder padding="md" mt="md">
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={600}>💱 Currency Formatting Demo</Text>
          <Badge color="blue" variant="light">
            {currency} ({getCurrencySymbol()})
          </Badge>
        </Group>
        
        <Stack gap="xs">
          {testAmounts.map((test) => (
            <Group key={test.label} justify="space-between" px="sm" py="xs" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '4px' }}>
              <Text size="sm" c="dimmed">{test.label}:</Text>
              <Text fw={500} c="blue">{formatCurrency(test.amount)}</Text>
            </Group>
          ))}
        </Stack>
        
        <Text size="xs" c="dimmed" ta="center" mt="xs">
          Change currency in Profile → Preferences to see different formats
        </Text>
      </Stack>
    </Card>
  );
}