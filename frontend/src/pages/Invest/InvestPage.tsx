import React, { useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Card,
  SimpleGrid,
  Badge,
  Button,
  Group,
  NumberInput,
  Modal,
  ThemeIcon,
  LoadingOverlay,
  Alert,
  Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconCalendarWeek,
  IconCalendarMonth,
  IconCalendarStats,
  IconTrendingUp,
  IconAlertCircle,
  IconShield,
  IconShieldCheck,
  IconShieldX,
} from '@tabler/icons-react';
import { useInvestmentPlans, useCreateInvestment } from '@/hooks/api';
import { useSettings } from '@/contexts/SettingsContext';
import type { InvestmentPlan } from '@/types/api';
// Plan icons mapping
const getPlanIcon = (duration: number) => {
  if (duration <= 30) return IconCalendar; // Daily/short-term
  if (duration <= 90) return IconCalendarWeek; // Weekly/medium-term
  if (duration <= 365) return IconCalendarMonth; // Monthly
  return IconCalendarStats; // Long-term/quarterly
};

// Risk level icons
const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return IconShieldCheck;
    case 'medium': return IconShield;
    case 'high': return IconShieldX;
    default: return IconShield;
  }
};

// Risk level colors
const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low': return 'green';
    case 'medium': return 'yellow';
    case 'high': return 'red';
    default: return 'gray';
  }
};

export function InvestPage() {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);
  
  const { formatCurrency, t } = useSettings();
  const { data: plans, isLoading: isPlansLoading, error: plansError } = useInvestmentPlans();
  const createInvestmentMutation = useCreateInvestment();

  const handleInvest = async () => {
    if (!selectedPlan || !investmentAmount) return;
    
    try {
      await createInvestmentMutation.mutateAsync({
        planId: selectedPlan.id,
        amount: investmentAmount,
      });
      
      // Reset form and close modal on success
      setInvestmentAmount(0);
      setSelectedPlan(null);
      close();
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error('Investment creation failed:', error);
    }
  };

  const handlePlanSelect = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setInvestmentAmount(plan.minAmount); // Set default amount to minimum
    open();
  };

  if (plansError) {
    return (
      <Stack gap="lg" p="md">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error loading investment plans" 
          color="red"
        >
          {plansError.message || 'Failed to load investment plans. Please try again later.'}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" p="md" style={{ position: 'relative' }}>
      <LoadingOverlay visible={isPlansLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      <div>
        <Text fz={{base: 14, sm: 24}}>{t('invest.title') || 'Investment Plans'}</Text>
        <Text c="dimmed" size="sm">
          {t('invest.subtitle') || 'Choose a plan that suits your investment goals'}
        </Text>
      </div>

      {isPlansLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} withBorder padding="lg" radius="md">
              <Group justify="apart" mb="xs">
                <Skeleton height={40} width={40} radius="sm" />
                <Skeleton height={20} width={60} radius="sm" />
              </Group>
              <Skeleton height={20} mb="xs" />
              <Skeleton height={16} mb="md" />
              <Stack gap="xs">
                <Skeleton height={14} />
                <Skeleton height={14} />
                <Skeleton height={14} />
              </Stack>
              <Skeleton height={36} mt="md" />
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {plans?.filter(plan => plan.isActive).map((plan) => {
            const IconComponent = getPlanIcon(plan.duration);
            const RiskIcon = getRiskIcon(plan.riskLevel);
            const riskColor = getRiskColor(plan.riskLevel);
            
            return (
              <Card
                key={plan.id}
                withBorder
                padding="lg"
                radius="md"
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onClick={() => handlePlanSelect(plan)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <Group justify="apart" mb="xs">
                  <ThemeIcon color="blue" variant="light" size="lg">
                    <IconComponent size={24} />
                  </ThemeIcon>
                  <Group gap="xs">
                    <Badge color="green" variant="light">
                      {plan.profitPercentage}%
                    </Badge>
                    <Badge color={riskColor} variant="light" size="sm">
                      <RiskIcon size={12} style={{ marginRight: 4 }} />
                      {plan.riskLevel}
                    </Badge>
                  </Group>
                </Group>

                <Title order={4} mb="xs">
                  {plan.name}
                </Title>

                <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                  {plan.description}
                </Text>

                <Stack gap="xs">
                  <Group justify="apart" align="center">
                    <Text size="sm" c="dimmed">{t('invest.duration') || 'Duration'}:</Text>
                    <Text size="sm" fw={500}>{plan.duration} days</Text>
                  </Group>
                  
                  <Group justify="apart" align="center">
                    <Text size="sm" c="dimmed">{t('invest.minAmount') || 'Min Amount'}:</Text>
                    <Text size="sm" fw={500}>{formatCurrency(plan.minAmount)}</Text>
                  </Group>
                  
                  <Group justify="apart" align="center">
                    <Text size="sm" c="dimmed">{t('invest.maxAmount') || 'Max Amount'}:</Text>
                    <Text size="sm" fw={500}>{formatCurrency(plan.maxAmount)}</Text>
                  </Group>
                  
                  <Group justify="apart" align="center">
                    <Text size="sm" c="dimmed">{t('invest.totalReturn') || 'Total Return'}:</Text>
                    <Text size="sm" fw={500} c="green">{plan.totalReturn}%</Text>
                  </Group>
                </Stack>

                <Button
                  fullWidth
                  mt="md"
                  variant="light"
                  leftSection={<IconTrendingUp size={16} />}
                  loading={createInvestmentMutation.isPending}
                >
                  {t('invest.investNow') || 'Invest Now'}
                </Button>
              </Card>
            );
          }) || []}
        </SimpleGrid>
      )}

      {!isPlansLoading && (!plans || plans.length === 0) && (
        <Card withBorder padding="xl" ta="center">
          <ThemeIcon size={64} variant="light" color="gray" mx="auto" mb="md">
            <IconTrendingUp size={32} />
          </ThemeIcon>
          <Text size="lg" fw={500} mb="xs">
            {t('invest.noPlans') || 'No Investment Plans Available'}
          </Text>
          <Text c="dimmed" size="sm">
            {t('invest.noPlansDesc') || 'Investment plans are currently unavailable. Please check back later.'}
          </Text>
        </Card>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={selectedPlan ? `${t('invest.investIn') || 'Invest in'} ${selectedPlan.name}` : ''}
        centered
        size="md"
      >
        {selectedPlan && (
          <Stack gap="md">
            <Card withBorder padding="md" bg="light-dark(var(--mantine-color-blue-0), var(--mantine-color-blue-9))">
              <Group justify="apart" mb="xs">
                <Group>
                  <ThemeIcon color="blue" variant="light" size="sm">
                    {React.createElement(getPlanIcon(selectedPlan.duration), { size: 16 })}
                  </ThemeIcon>
                  <Text fw={500}>{selectedPlan.name}</Text>
                </Group>
                <Group gap="xs">
                  <Badge color="green">{selectedPlan.profitPercentage}%</Badge>
                  <Badge color={getRiskColor(selectedPlan.riskLevel)} variant="light" size="sm">
                    {selectedPlan.riskLevel}
                  </Badge>
                </Group>
              </Group>
              
              <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
                {selectedPlan.description}
              </Text>
              
              <SimpleGrid cols={2} spacing="sm">
                <div>
                  <Text size="xs" c="dimmed">{t('invest.duration') || 'Duration'}</Text>
                  <Text size="sm" fw={500}>{selectedPlan.duration} days</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('invest.profitRate') || 'Profit Rate'}</Text>
                  <Text size="sm" fw={500}>{selectedPlan.profitPercentage}%</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('invest.totalReturn') || 'Total Return'}</Text>
                  <Text size="sm" fw={500} c="green">{selectedPlan.totalReturn}%</Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">{t('invest.riskLevel') || 'Risk Level'}</Text>
                  <Text size="sm" fw={500} tt="capitalize">{selectedPlan.riskLevel}</Text>
                </div>
              </SimpleGrid>
              
              {selectedPlan.features && selectedPlan.features.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Text size="xs" c="dimmed" mb={4}>{t('invest.features') || 'Features'}</Text>
                  <Group gap={4}>
                    {selectedPlan.features.map((feature, index) => (
                      <Badge key={index} size="xs" variant="outline" color="blue">
                        {feature}
                      </Badge>
                    ))}
                  </Group>
                </div>
              )}
            </Card>

            <NumberInput
              label={t('invest.investmentAmount') || 'Investment Amount'}
              placeholder={t('invest.enterAmount') || 'Enter amount'}
              min={selectedPlan.minAmount}
              max={selectedPlan.maxAmount}
              value={investmentAmount}
              onChange={(value) => setInvestmentAmount(Number(value) || 0)}
              leftSection={"$"}
              description={`${t('invest.minAmount') || 'Min'}: ${formatCurrency(selectedPlan.minAmount)} - ${t('invest.maxAmount') || 'Max'}: ${formatCurrency(selectedPlan.maxAmount)}`}
              error={investmentAmount > 0 && (investmentAmount < selectedPlan.minAmount || investmentAmount > selectedPlan.maxAmount) ? 
                `${t('invest.amountRange') || 'Amount must be between'} ${formatCurrency(selectedPlan.minAmount)} and ${formatCurrency(selectedPlan.maxAmount)}` : null
              }
            />

            {investmentAmount > 0 && investmentAmount >= selectedPlan.minAmount && investmentAmount <= selectedPlan.maxAmount && (
              <Card withBorder padding="md" bg="light-dark(var(--mantine-color-green-0), var(--mantine-color-green-9))">
                <Text size="sm" mb="xs" fw={500}>{t('invest.expectedReturns') || 'Expected Returns'}</Text>
                <Stack gap="xs">
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">{t('invest.investment') || 'Investment'}:</Text>
                    <Text size="sm" fw={500}>{formatCurrency(investmentAmount)}</Text>
                  </Group>
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">{t('invest.estimatedProfit') || 'Est. Profit'}:</Text>
                    <Text size="sm" fw={500} c="green">
                      {formatCurrency(investmentAmount * selectedPlan.profitPercentage / 100)}
                    </Text>
                  </Group>
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">{t('invest.totalReturn') || 'Total Return'}:</Text>
                    <Text size="sm" fw={500} c="green">
                      {formatCurrency(investmentAmount * (1 + selectedPlan.totalReturn / 100))}
                    </Text>
                  </Group>
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">{t('invest.maturityDate') || 'Maturity Date'}:</Text>
                    <Text size="sm" fw={500}>
                      {new Date(Date.now() + selectedPlan.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            )}

            <Group justify="apart" mt="md">
              <Button 
                variant="outline" 
                onClick={close}
                disabled={createInvestmentMutation.isPending}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                onClick={handleInvest}
                disabled={
                  !investmentAmount || 
                  investmentAmount < selectedPlan.minAmount || 
                  investmentAmount > selectedPlan.maxAmount ||
                  createInvestmentMutation.isPending
                }
                loading={createInvestmentMutation.isPending}
              >
                {t('invest.confirmInvestment') || 'Confirm Investment'}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}