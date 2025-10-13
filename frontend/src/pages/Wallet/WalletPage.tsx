import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Button,
  NumberInput,
  TextInput,
  Modal,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Alert,
  Divider,
  ActionIcon,
  CopyButton,
  Tooltip,
  LoadingOverlay,
  Skeleton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconWallet,
  IconArrowDown,
  IconArrowUp,
  IconCopy,
  IconCheck,
  IconAlertCircle,
  IconHistory,
} from '@tabler/icons-react';
import { useWalletData, useDepositAddress, useDeposit, useWithdraw, useWalletTransactions } from '@/hooks/api';
import type { TransactionStatus, TransactionType } from '@/types/api';

// Helper functions
const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'completed': return 'green';
    case 'pending': return 'yellow';
    case 'failed': return 'red';
    case 'cancelled': return 'gray';
    default: return 'gray';
  }
};

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case 'deposit': return IconArrowDown;
    case 'withdraw': return IconArrowUp;
    case 'investment': return IconWallet;
    case 'profit': return IconArrowDown;
    case 'referral': return IconArrowDown;
    default: return IconWallet;
  }
};

const getTransactionLabel = (type: TransactionType) => {
  switch (type) {
    case 'deposit': return 'Deposit';
    case 'withdraw': return 'Withdrawal';
    case 'investment': return 'Investment';
    case 'profit': return 'Profit';
    case 'referral': return 'Referral';
    default: return 'Transaction';
  }
};

export function WalletPage() {
  const { formatCurrency } = useSettings();
  const [depositOpened, { open: openDeposit, close: closeDeposit }] = useDisclosure(false);
  const [withdrawOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false);
  const [depositAmount, setDepositAmount] = useState<number>(10);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  
  // API hooks
  const { data: walletData, isLoading: isWalletLoading, error: walletError } = useWalletData();
  const { data: depositAddress, isLoading: isAddressLoading } = useDepositAddress();
  const { data: transactions, isLoading: isTransactionsLoading } = useWalletTransactions({ limit: 5 });
  const depositMutation = useDeposit();
  const withdrawMutation = useWithdraw();
  
  const isLoading = isWalletLoading || isAddressLoading;
  const availableBalance = walletData?.balance?.available || 0;
  const walletAddress = (depositAddress as any)?.address || (walletData as any)?.address?.address || 'TR3WrAeQAyCk8zrhPNkSHEG48XAz6vMJXY';
  const recentTransactions = (transactions as any[]) || [];

  const handleDeposit = async () => {
    if (depositAmount > 0) {
      try {
        await depositMutation.mutateAsync({
          amount: depositAmount,
          network: 'TRC20',
        });
        closeDeposit();
        setDepositAmount(10);
      } catch (error) {
        console.error('Deposit initiation failed:', error);
      }
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount > 0 && withdrawAddress) {
      if (withdrawAmount <= availableBalance) {
        try {
          await withdrawMutation.mutateAsync({
            amount: withdrawAmount,
            address: withdrawAddress,
            network: 'TRC20',
          });
          closeWithdraw();
          setWithdrawAmount(0);
          setWithdrawAddress('');
        } catch (error) {
          console.error('Withdrawal request failed:', error);
        }
      }
    }
  };

  if (walletError) {
    return (
      <Stack gap="lg" p="md">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error loading wallet data"
          color="red"
        >
          {walletError.message || 'Failed to load wallet data. Please try again later.'}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg" p="md" style={{ position: 'relative' }}>
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Text fz={{base: 14, sm: 24}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white))">
            Wallet
          </Text>
          <Text c="dimmed" size="sm">
            Manage your deposits and withdrawals
          </Text>
        </div>
      </Group>

      {/* Balance Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              Available Balance
            </Text>
            <ThemeIcon color="green" variant="light" size="sm">
              <IconWallet size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} mb={4} />
          ) : (
            <Text size="xl" fw={700} c="green">
              {formatCurrency(availableBalance)}
            </Text>
          )}
          <Text size="xs" c="dimmed">{walletData?.balance?.currency || 'USDT'}</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              Total Balance
            </Text>
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconArrowDown size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} mb={4} />
          ) : (
            <Text size="xl" fw={700}>
              {formatCurrency(walletData?.balance?.total || 0)}
            </Text>
          )}
          <Text size="xs" c="dimmed">Total</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              Locked Balance
            </Text>
            <ThemeIcon color="orange" variant="light" size="sm">
              <IconArrowUp size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} mb={4} />
          ) : (
            <Text size="xl" fw={700}>
              {formatCurrency(walletData?.balance?.locked || 0)}
            </Text>
          )}
          <Text size="xs" c="dimmed">In investments</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">
              Pending
            </Text>
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconHistory size={16} />
            </ThemeIcon>
          </Group>
          {isLoading ? (
            <Skeleton height={28} mb={4} />
          ) : (
            <Text size="xl" fw={700}>
              {walletData?.pendingTransactions || 0}
            </Text>
          )}
          <Text size="xs" c="dimmed">Transactions</Text>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Card withBorder padding="lg">
        <Title order={3} mb="md">Quick Actions</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Button
            size="lg"
            leftSection={<IconArrowDown size={20} />}
            onClick={openDeposit}
            variant="filled"
            color="blue"
            loading={depositMutation.isPending}
          >
            Deposit USDT
          </Button>
          <Button
            size="lg"
            leftSection={<IconArrowUp size={20} />}
            onClick={openWithdraw}
            variant="outline"
            color="green"
            loading={withdrawMutation.isPending}
          >
            Withdraw USDT
          </Button>
        </SimpleGrid>
      </Card>

      {/* Wallet Address */}
      <Card withBorder padding="lg">
        <Group justify="apart" mb="md">
          <Title order={3}>📍 Your Deposit Address</Title>
          <Badge color="green" variant="light">TRC20</Badge>
        </Group>
        
        <Group justify="apart" align="center">
          <Text ff="monospace" size="sm" style={{ wordBreak: 'break-all', flex: 1 }}>
            {walletAddress}
          </Text>
          <CopyButton value={walletAddress}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied!' : 'Copy address'}>
                <ActionIcon color={copied ? 'green' : 'blue'} onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
        
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Important"
          color="yellow"
          mt="md"
          variant="light"
        >
          Only send USDT (TRC20) to this address. Sending other tokens may result in permanent loss.
        </Alert>
      </Card>

      {/* Recent Transactions */}
      <Card withBorder padding="lg">
        <Group justify="apart" mb="md">
          <Title order={3}>📊 Recent Transactions</Title>
          <Button size="xs" variant="light">View All</Button>
        </Group>

        {isTransactionsLoading ? (
          <Stack gap="md">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} withBorder padding="sm">
                <Group justify="apart">
                  <Group>
                    <Skeleton height={32} width={32} radius="sm" />
                    <div>
                      <Skeleton height={16} width={80} mb={4} />
                      <Skeleton height={12} width={60} />
                    </div>
                  </Group>
                  <div style={{ textAlign: 'right' }}>
                    <Skeleton height={16} width={60} mb={4} />
                    <Skeleton height={16} width={40} />
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        ) : (
          <Stack gap="md">
            {recentTransactions.map((tx) => {
              const IconComponent = getTransactionIcon(tx.type);
              return (
                <Card key={tx.id} withBorder padding="sm">
                  <Group justify="apart">
                    <Group>
                      <ThemeIcon
                        color={tx.type === 'deposit' ? 'blue' : 'orange'}
                        variant="light"
                      >
                        <IconComponent size={16} />
                      </ThemeIcon>
                      <div>
                        <Text fw={500} size="sm">
                          {getTransactionLabel(tx.type)}
                        </Text>
                        <Text size="xs" c="dimmed">{new Date(tx.createdAt).toLocaleDateString()}</Text>
                      </div>
                    </Group>
                    
                    <Group>
                      <div style={{ textAlign: 'right' }}>
                        <Text fw={500}>
                          {tx.type === 'deposit' || tx.type === 'profit' || tx.type === 'referral' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </Text>
                        <Badge size="xs" color={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                    </Group>
                  </Group>
                  
                  {tx.hash && (
                    <Text size="xs" c="dimmed" ff="monospace" mt="xs">
                      {tx.hash}
                    </Text>
                  )}
                </Card>
              );
            })}
            
            {recentTransactions.length === 0 && (
              <Text c="dimmed" ta="center" py="xl">
                No transactions yet
              </Text>
            )}
          </Stack>
        )}
      </Card>

      {/* Deposit Modal */}
      <Modal
        opened={depositOpened}
        onClose={closeDeposit}
        title="💰 Deposit USDT"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
            Send USDT (TRC20) to the address below. Your balance will be updated after confirmation.
          </Alert>

          <NumberInput
            label="Deposit Amount"
            placeholder="Enter amount in USDT"
            min={10}
            value={depositAmount}
            onChange={(value) => setDepositAmount(Number(value) || 0)}
            leftSection="$"
            description="Minimum deposit: $10 USDT"
          />

          <Card withBorder padding="md" bg="blue.0">
            <Text size="sm" mb="xs" fw={500}>Send USDT to this address:</Text>
            <Group justify="apart" align="center">
              <Text ff="monospace" size="sm" style={{ wordBreak: 'break-all' }}>
                {walletAddress}
              </Text>
              <CopyButton value={walletAddress}>
                {({ copied, copy }) => (
                  <ActionIcon size="sm" color={copied ? 'green' : 'blue'} onClick={copy}>
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          </Card>

          <Button 
            onClick={handleDeposit} 
            disabled={depositAmount < 10}
            loading={depositMutation.isPending}
          >
            Confirm Deposit
          </Button>
        </Stack>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        opened={withdrawOpened}
        onClose={closeWithdraw}
        title="💸 Withdraw USDT"
        centered
      >
        <Stack gap="md">
          <Alert icon={<IconAlertCircle size={16} />} color="orange" variant="light">
            Withdrawals are processed within 24 hours. A 0.5% fee will be deducted.
          </Alert>

          <NumberInput
            label="Withdrawal Amount"
            placeholder="Enter amount in USDT"
            min={10}
            max={availableBalance}
            value={withdrawAmount}
            onChange={(value) => setWithdrawAmount(Number(value) || 0)}
            leftSection="$"
            description={`Available: ${formatCurrency(availableBalance)}`}
          />

          <TextInput
            label="Withdrawal Address"
            placeholder="Enter USDT (TRC20) address"
            value={withdrawAddress}
            onChange={(event) => setWithdrawAddress(event.currentTarget.value)}
            description="Only TRC20 USDT addresses are supported"
          />

          {withdrawAmount > 0 && (
            <Card withBorder padding="md" bg="green.0">
              <Text size="sm" mb="xs" fw={500}>Transaction Summary:</Text>
              <Group justify="apart">
                <Text size="sm">Amount:</Text>
                <Text size="sm" fw={500}>{formatCurrency(withdrawAmount)}</Text>
              </Group>
              <Group justify="apart">
                <Text size="sm">Fee (0.5%):</Text>
                <Text size="sm" fw={500}>{formatCurrency(withdrawAmount * 0.005)}</Text>
              </Group>
              <Divider my="xs" />
              <Group justify="apart">
                <Text size="sm" fw={500}>You'll receive:</Text>
                <Text size="sm" fw={700} c="green">
                  {formatCurrency(withdrawAmount - withdrawAmount * 0.005)}
                </Text>
              </Group>
            </Card>
          )}

          <Button
            onClick={handleWithdraw}
            disabled={withdrawAmount < 10 || !withdrawAddress || withdrawAmount > availableBalance}
            loading={withdrawMutation.isPending}
          >
            Confirm Withdrawal
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}