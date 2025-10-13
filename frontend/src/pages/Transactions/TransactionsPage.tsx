import { useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  Select,
  TextInput,
  Pagination,
  ThemeIcon,
  SimpleGrid,
  ActionIcon,
  CopyButton,
  Tooltip,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowDown,
  IconArrowUp,
  IconCoin,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconCopy,
  IconCheck,
  IconExternalLink,
  IconCalendar,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000,
    status: 'completed',
    date: '2024-01-15 14:30:25',
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    fromAddress: 'TQrZ9K1mFp8jKzAP5yN2cXhB4vN8fGhJ6L',
    description: 'USDT Deposit',
    fee: 0,
  },
  {
    id: '2',
    type: 'investment',
    amount: 500,
    status: 'completed',
    date: '2024-01-15 15:45:10',
    description: 'Daily Plan Investment',
    investmentId: 'INV001',
    fee: 0,
  },
  {
    id: '3',
    type: 'interest',
    amount: 6,
    status: 'completed',
    date: '2024-01-16 00:00:15',
    description: 'Daily Interest Payment',
    investmentId: 'INV001',
    fee: 0,
  },
  {
    id: '4',
    type: 'referral_bonus',
    amount: 30,
    status: 'completed',
    date: '2024-01-16 10:20:30',
    description: 'Referral Bonus - Friend Investment',
    referralUserId: 'USER123',
    fee: 0,
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: 200,
    status: 'pending',
    date: '2024-01-16 16:15:45',
    toAddress: 'TMqZ8K2nGp9jLzBP6yO3dXiC5wO9gHiK7M',
    description: 'USDT Withdrawal',
    fee: 1,
  },
  {
    id: '6',
    type: 'investment',
    amount: 300,
    status: 'completed',
    date: '2024-01-14 11:30:20',
    description: 'Weekly Plan Investment',
    investmentId: 'INV002',
    fee: 0,
  },
];

const mockStats = {
  totalTransactions: 156,
  totalVolume: 25430.50,
  pendingCount: 3,
  completedCount: 153,
};

export function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] = useDisclosure(false);
  const [filterType, setFilterType] = useState<string | null>('all');
  const [filterStatus, setFilterStatus] = useState<string | null>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <IconArrowDown size={16} />;
      case 'withdrawal': return <IconArrowUp size={16} />;
      case 'investment': return <IconCoin size={16} />;
      case 'interest': return <IconTrendingUp size={16} />;
      case 'referral_bonus': return <IconUsers size={16} />;
      default: return <IconRefresh size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'blue';
      case 'withdrawal': return 'orange';
      case 'investment': return 'purple';
      case 'interest': return 'green';
      case 'referral_bonus': return 'pink';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'blue';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredTransactions = mockTransactions.filter(tx => {
    const typeMatch = filterType === 'all' || tx.type === filterType;
    const statusMatch = filterStatus === 'all' || tx.status === filterStatus;
    const searchMatch = searchTerm === '' || 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && statusMatch && searchMatch;
  });

  const openTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    openDetails();
  };

  return (
    <Stack gap="lg" p="md">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Text fz={{base: 14, sm: 24}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white)">📊 Transaction History</Text>
          <Text c="dimmed" size="sm">
            View and manage all your transactions
          </Text>
        </div>
        <Button
          leftSection={<IconRefresh size={16} />}
          variant="light"
          size="sm"
        >
          Refresh
        </Button>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Card withBorder padding="md">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Total</Text>
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconCalendar size={14} />
            </ThemeIcon>
          </Group>
          <Text size="lg" fw={700}>{mockStats.totalTransactions}</Text>
          <Text size="xs" c="dimmed">Transactions</Text>
        </Card>

        <Card withBorder padding="md">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Volume</Text>
            <ThemeIcon color="green" variant="light" size="sm">
              <IconTrendingUp size={14} />
            </ThemeIcon>
          </Group>
          <Text size="lg" fw={700}>${mockStats.totalVolume.toFixed(0)}</Text>
          <Text size="xs" c="dimmed">USDT</Text>
        </Card>

        <Card withBorder padding="md">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Pending</Text>
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconRefresh size={14} />
            </ThemeIcon>
          </Group>
          <Text size="lg" fw={700}>{mockStats.pendingCount}</Text>
          <Text size="xs" c="dimmed">Transactions</Text>
        </Card>

        <Card withBorder padding="md">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Completed</Text>
            <ThemeIcon color="green" variant="light" size="sm">
              <IconCheck size={14} />
            </ThemeIcon>
          </Group>
          <Text size="lg" fw={700}>{mockStats.completedCount}</Text>
          <Text size="xs" c="dimmed">Transactions</Text>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card withBorder padding="md">
        <Group justify="apart" mb="md">
          <Title order={4}>🔍 Filters</Title>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
              setSearchTerm('');
            }}
          >
            Clear All
          </Button>
        </Group>
        
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Select
            label="Transaction Type"
            placeholder="All types"
            data={[
              { value: 'all', label: 'All Types' },
              { value: 'deposit', label: 'Deposits' },
              { value: 'withdrawal', label: 'Withdrawals' },
              { value: 'investment', label: 'Investments' },
              { value: 'interest', label: 'Interest' },
              { value: 'referral_bonus', label: 'Referral Bonus' },
            ]}
            value={filterType}
            onChange={setFilterType}
            leftSection={<IconFilter size={16} />}
          />
          
          <Select
            label="Status"
            placeholder="All statuses"
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          
          <TextInput
            label="Search"
            placeholder="Search transactions..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
        </SimpleGrid>
      </Card>

      {/* Transaction List */}
      <Card withBorder padding="md">
        <Group justify="apart" mb="md">
          <Title order={4}>📜 Transactions ({filteredTransactions.length})</Title>
        </Group>

        <Stack gap="md">
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              withBorder
              padding="md"
              style={{ cursor: 'pointer' }}
              onClick={() => openTransactionDetails(transaction)}
            >
              <Group justify="apart">
                <Group>
                  <ThemeIcon
                    color={getTypeColor(transaction.type)}
                    variant="light"
                  >
                    {getTypeIcon(transaction.type)}
                  </ThemeIcon>
                  <div>
                    <Text fw={500} size="sm">
                      {formatTransactionType(transaction.type)}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {transaction.date}
                    </Text>
                  </div>
                </Group>

                <Group>
                  <div style={{ textAlign: 'right' }}>
                    <Text fw={500}>
                      {transaction.type === 'withdrawal' || transaction.type === 'investment' ? '-' : '+'}
                      ${transaction.amount.toFixed(2)}
                    </Text>
                    {transaction.fee > 0 && (
                      <Text size="xs" c="dimmed">
                        Fee: ${transaction.fee.toFixed(2)}
                      </Text>
                    )}
                  </div>
                  <Badge
                    size="sm"
                    color={getStatusColor(transaction.status)}
                    variant="light"
                  >
                    {transaction.status}
                  </Badge>
                </Group>
              </Group>

              <Text size="xs" c="dimmed" mt="xs">
                {transaction.description}
              </Text>

              {transaction.txHash && (
                <Group mt="xs">
                  <Text size="xs" c="dimmed" ff="monospace">
                    {transaction.txHash.substring(0, 20)}...
                  </Text>
                  <CopyButton value={transaction.txHash}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy hash'}>
                        <ActionIcon size="xs" color={copied ? 'green' : 'blue'} onClick={(e) => { e.stopPropagation(); copy(); }}>
                          {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              )}
            </Card>
          ))}
        </Stack>

        {filteredTransactions.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No transactions found matching your criteria.
          </Text>
        )}

        {filteredTransactions.length > 0 && (
          <Group justify="center" mt="md">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={Math.ceil(filteredTransactions.length / 10)}
              size="sm"
            />
          </Group>
        )}
      </Card>

      {/* Transaction Details Modal */}
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        title={`📊 Transaction Details`}
        size="md"
        centered
      >
        {selectedTransaction && (
          <Stack gap="md">
            <Group justify="apart">
              <Group>
                <ThemeIcon
                  color={getTypeColor(selectedTransaction.type)}
                  variant="light"
                  size="lg"
                >
                  {getTypeIcon(selectedTransaction.type)}
                </ThemeIcon>
                <div>
                  <Text fw={500}>
                    {formatTransactionType(selectedTransaction.type)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedTransaction.date}
                  </Text>
                </div>
              </Group>
              <Badge
                size="lg"
                color={getStatusColor(selectedTransaction.status)}
                variant="light"
              >
                {selectedTransaction.status}
              </Badge>
            </Group>

            <Card withBorder padding="md" bg="gray.0">
              <Stack gap="sm">
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Amount:</Text>
                  <Text fw={500}>${selectedTransaction.amount.toFixed(2)} USDT</Text>
                </Group>
                
                {selectedTransaction.fee > 0 && (
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">Fee:</Text>
                    <Text fw={500}>${selectedTransaction.fee.toFixed(2)} USDT</Text>
                  </Group>
                )}
                
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Description:</Text>
                  <Text fw={500}>{selectedTransaction.description}</Text>
                </Group>

                {selectedTransaction.investmentId && (
                  <Group justify="apart">
                    <Text size="sm" c="dimmed">Investment ID:</Text>
                    <Text fw={500} ff="monospace">{selectedTransaction.investmentId}</Text>
                  </Group>
                )}
              </Stack>
            </Card>

            {selectedTransaction.txHash && (
              <Card withBorder padding="md">
                <Text size="sm" fw={500} mb="xs">Transaction Hash:</Text>
                <Group>
                  <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all', flex: 1 }}>
                    {selectedTransaction.txHash}
                  </Text>
                  <CopyButton value={selectedTransaction.txHash}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied!' : 'Copy hash'}>
                        <ActionIcon color={copied ? 'green' : 'blue'} onClick={copy}>
                          {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                  <Tooltip label="View on explorer">
                    <ActionIcon color="blue" variant="light">
                      <IconExternalLink size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Card>
            )}

            {(selectedTransaction.fromAddress || selectedTransaction.toAddress) && (
              <Card withBorder padding="md">
                {selectedTransaction.fromAddress && (
                  <div>
                    <Text size="sm" fw={500} mb="xs">From Address:</Text>
                    <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all' }}>
                      {selectedTransaction.fromAddress}
                    </Text>
                  </div>
                )}
                {selectedTransaction.toAddress && (
                  <div>
                    <Text size="sm" fw={500} mb="xs">To Address:</Text>
                    <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all' }}>
                      {selectedTransaction.toAddress}
                    </Text>
                  </div>
                )}
              </Card>
            )}

            <Button onClick={closeDetails} variant="light">
              Close
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
