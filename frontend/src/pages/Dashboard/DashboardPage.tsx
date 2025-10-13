import {
  Card,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  Progress,
  SimpleGrid,
  ThemeIcon,
  LoadingOverlay,
  Alert,
  Skeleton,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconWallet,
  IconUsers,
  IconCoin,
  IconChartLine,
  IconPlus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useDashboard, useInvestmentHistory } from '@/hooks/api';
import { useSettings } from '@/contexts/SettingsContext';

export function DashboardPage() {
  const { formatCurrency, t } = useSettings();
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboard();
  const { data: investments, isLoading: isInvestmentsLoading, error: investmentsError } = useInvestmentHistory({ limit: 10 });

  const isLoading = isDashboardLoading || isInvestmentsLoading;
  const hasError = dashboardError || investmentsError;

  if (hasError) {
    return (
      <Stack gap="lg" p="md">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error loading dashboard" 
          color="red"
        >
          {dashboardError?.message || investmentsError?.message || 'Failed to load dashboard data'}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" p="md" style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <Group justify="space-between">
        <div>
          <Text fz={{base: 14, sm: 24}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white)" size="sm">
            {t('dashboard.overview') || 'Here\'s your investment overview'}
          </Text>
        </div>
        <Button
          component={Link}
          to="/invest"
          leftSection={<IconPlus size={16} />}
          variant="filled"
        >
          {t('dashboard.newInvestment') || 'New Investment'}
        </Button>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {t('dashboard.totalInvested') || 'Total Invested'}
            </Text>
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconCoin size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} />
          ) : (
            <Text size="xl" fw={700}>
              {formatCurrency(dashboardData?.stats?.totalInvested || 0)}
            </Text>
          )}
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {t('dashboard.totalProfit') || 'Total Profit'}
            </Text>
            <ThemeIcon color="green" variant="light" size="sm">
              <IconTrendingUp size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} />
          ) : (
            <Text size="xl" fw={700} c="green">
              {formatCurrency(dashboardData?.stats?.totalProfit || 0)}
            </Text>
          )}
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {t('dashboard.totalBalance') || 'Total Balance'}
            </Text>
            <ThemeIcon color="orange" variant="light" size="sm">
              <IconWallet size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} />
          ) : (
            <Text size="xl" fw={700}>
              {formatCurrency(dashboardData?.stats?.totalBalance || 0)}
            </Text>
          )}
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              {t('dashboard.referralEarnings') || 'Referral Earnings'}
            </Text>
            <ThemeIcon color="purple" variant="light" size="sm">
              <IconUsers size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} />
          ) : (
            <Text size="xl" fw={700} c="purple">
              {formatCurrency(dashboardData?.stats?.referralEarnings || 0)}
            </Text>
          )}
        </Card>
      </SimpleGrid>

      {/* Active Investments */}
      <Card withBorder padding="lg">
        <Group justify="apart" mb="md">
          <Title order={3}>{t('dashboard.activeInvestments') || 'Active Investments'}</Title>
          {isLoading ? (
            <Skeleton height={24} width={80} />
          ) : (
            <Badge color="blue" variant="light">
              {dashboardData?.stats?.activeInvestments || 0} Active
            </Badge>
          )}
        </Group>

        {isLoading ? (
          <Stack gap="md">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} withBorder padding="md">
                <Skeleton height={20} mb="sm" />
                <Skeleton height={16} mb="md" />
                <Skeleton height={12} />
              </Card>
            ))}
          </Stack>
        ) : (
          <Stack gap="md">
            {investments?.filter(inv => inv.status === 'active').map((investment) => {
              const progress = investment.daysRemaining ? 
                Math.max(0, Math.min(100, ((investment.duration - (investment.daysRemaining || 0)) / investment.duration) * 100)) : 0;
              
              return (
                <Card key={investment.id} withBorder padding="md">
                  <Group justify="apart" mb="xs">
                    <Text fw={500}>{investment.planName}</Text>
                    <Badge color="green" variant="light" size="sm">
                      {formatCurrency(investment.currentProfit)} earned
                    </Badge>
                  </Group>
                  
                  <Group justify="apart" mb="md">
                    <Text size="sm" c="dimmed">
                      Investment: {formatCurrency(investment.amount)}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {investment.daysRemaining} days remaining
                    </Text>
                  </Group>

                  <Progress
                    value={progress}
                    color="blue"
                    size="md"
                    radius="xl"
                    mb="xs"
                  />
                  
                  <Text size="xs" c="dimmed" ta="center">
                    {Math.round(progress)}% Complete
                  </Text>
                </Card>
              );
            })}
          </Stack>
        )}

        {!isLoading && (!investments || investments.filter(inv => inv.status === 'active').length === 0) && (
          <Group justify="center" py="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size="xl" variant="light" color="gray">
                <IconChartLine size={32} />
              </ThemeIcon>
              <Text c="dimmed" ta="center">
                {t('dashboard.noInvestments') || 'No active investments yet'}
              </Text>
              <Button component={Link} to="/invest" variant="light">
                {t('dashboard.startInvesting') || 'Start Investing'}
              </Button>
            </Stack>
          </Group>
        )}
      </Card>

      {/* Quick Actions */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder padding="lg" component={Link} to="/invest" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group>
            <ThemeIcon color="blue" size="lg">
              <IconCoin size={24} />
            </ThemeIcon>
            <div>
              <Text fw={500}>{t('dashboard.makeInvestment') || 'Make Investment'}</Text>
              <Text size="sm" c="dimmed">{t('dashboard.makeInvestmentDesc') || 'Choose a plan and start earning'}</Text>
            </div>
          </Group>
        </Card>

        <Card withBorder padding="lg" component={Link} to="/wallet" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group>
            <ThemeIcon color="green" size="lg">
              <IconWallet size={24} />
            </ThemeIcon>
            <div>
              <Text fw={500}>{t('dashboard.manageWallet') || 'Manage Wallet'}</Text>
              <Text size="sm" c="dimmed">{t('dashboard.manageWalletDesc') || 'Deposit or withdraw funds'}</Text>
            </div>
          </Group>
        </Card>

        <Card withBorder padding="lg" component={Link} to="/referrals" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Group>
            <ThemeIcon color="purple" size="lg">
              <IconUsers size={24} />
            </ThemeIcon>
            <div>
              <Text fw={500}>{t('dashboard.referralProgram') || 'Referral Program'}</Text>
              <Text size="sm" c="dimmed">{t('dashboard.referralProgramDesc') || 'Invite friends and earn rewards'}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}