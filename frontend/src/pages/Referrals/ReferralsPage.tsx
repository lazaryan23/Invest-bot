import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Button,
  Badge,
  SimpleGrid,
  ThemeIcon,
  CopyButton,
  ActionIcon,
  Tooltip,
  Alert,
  Progress,
  Avatar,
  Divider,
  Modal,
} from '@mantine/core';
import { useReferralData } from '@/hooks/api';
import { useSettings } from '@/contexts/SettingsContext';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconUsers,
  IconGift,
  IconCopy,
  IconCheck,
  IconShare,
  IconTrendingUp,
  IconCoins,
  IconUserPlus,
  IconLink,
  IconQrcode,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandTwitter,
  IconAward,
} from '@tabler/icons-react';

// Removed mock referral data; using real API data

const referralLevels = [
  { name: 'Bronze', minReferrals: 0, bonus: '3%', color: '#CD7F32' },
  { name: 'Silver', minReferrals: 10, bonus: '3.5%', color: '#C0C0C0' },
  { name: 'Gold', minReferrals: 25, bonus: '4%', color: '#FFD700' },
  { name: 'Platinum', minReferrals: 50, bonus: '4.5%', color: '#E5E4E2' },
  { name: 'Diamond', minReferrals: 100, bonus: '5%', color: '#B9F2FF' },
];

export function ReferralsPage() {
  const [shareOpened, { open: openShare, close: closeShare }] = useDisclosure(false);
  const { data, isLoading, error } = useReferralData();
  const settings = useSettings();
  const { formatCurrency } = settings;

  const referralCode = data?.referralCode?.code || '';
  const referralLink = data?.referralCode?.url || (referralCode ? `https://t.me/Invest_smartBot?start=${referralCode}` : '');

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    notifications.show({
      title: 'Copied!',
      message: 'Referral link copied to clipboard',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
  };

  const handleShare = (platform: string) => {
    const message = `Join me on Investment Bot and start earning passive income! Use my referral code: ${referralCode}`;
    
    let url = '';
    switch (platform) {
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  const getCurrentLevelInfo = () => {
    const totalReferrals = data?.stats?.totalReferrals ?? 0;
    return (
      referralLevels.find(level => 
        totalReferrals >= level.minReferrals &&
        (referralLevels.indexOf(level) === referralLevels.length - 1 ||
         totalReferrals < referralLevels[referralLevels.indexOf(level) + 1].minReferrals)
      ) || referralLevels[0]
    );
  };

  const getNextLevelInfo = () => {
    const currentIndex = referralLevels.findIndex(level => level.name === getCurrentLevelInfo().name);
    return currentIndex < referralLevels.length - 1 ? referralLevels[currentIndex + 1] : null;
  };

  const currentLevel = getCurrentLevelInfo();
  const nextLevel = getNextLevelInfo();
  const progressToNextLevel = nextLevel ? 
    (((data?.stats?.totalReferrals ?? 0) - currentLevel.minReferrals) / (nextLevel.minReferrals - currentLevel.minReferrals)) * 100 : 100;

  return (
    <Stack gap="lg" p="md">
      {/* Header */}
      {error && (
        <Alert color="red">{(error as any)?.message || 'Failed to load referral data'}</Alert>
      )}
      {isLoading && (
        <Text size="sm" c="dimmed">Loading referral data...</Text>
      )}
      <Group justify="space-between">
        <div>
          <Text fz={{base: 14, sm: 24}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white)">👥 Referral Program</Text>
          <Text c="dimmed" size="sm">
            Earn 3% bonus on every friend's investment
          </Text>
        </div>
        <Button
          leftSection={<IconShare size={16} />}
          onClick={openShare}
          variant="gradient"
          gradient={{ from: 'blue', to: 'purple' }}
        >
          Share & Earn
        </Button>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Total Referrals</Text>
            <ThemeIcon color="blue" variant="light" size="sm">
              <IconUsers size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700} c="blue">
            {data?.stats?.totalReferrals ?? 0}
          </Text>
          <Text size="xs" c="dimmed">{data?.stats?.activeReferrals ?? 0} active</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Total Earnings</Text>
            <ThemeIcon color="green" variant="light" size="sm">
              <IconCoins size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700} c="green">
            {formatCurrency(data?.stats?.totalEarnings || 0)}
          </Text>
          <Text size="xs" c="dimmed">Earnings</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">This Month</Text>
            <ThemeIcon color="orange" variant="light" size="sm">
              <IconTrendingUp size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700} c="orange">
            {formatCurrency(data?.stats?.currentMonthEarnings || 0)}
          </Text>
          <Text size="xs" c="dimmed">This month earnings</Text>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="apart" mb="xs">
            <Text size="sm" c="dimmed">Current Level</Text>
            <ThemeIcon color="yellow" variant="light" size="sm">
              <IconAward size={16} />
            </ThemeIcon>
          </Group>
          <Text size="xl" fw={700} style={{ color: currentLevel.color }}>
            {currentLevel.name}
          </Text>
          <Text size="xs" c="dimmed">{currentLevel.bonus} bonus</Text>
        </Card>
      </SimpleGrid>

      {/* Referral Link Section */}
      <Card withBorder padding="lg">
        <Group justify="apart" mb="md">
          <Title order={3}>🔗 Your Referral Link</Title>
          <Badge color="green" variant="light">Active</Badge>
        </Group>
        
        <Alert
          icon={<IconGift size={16} />}
          title="How it works"
          color="blue"
          variant="light"
          mb="md"
        >
          Share your referral link with friends. When they invest, you earn 3% of their investment amount instantly!
        </Alert>

        <Group justify="apart" align="center" mb="md">
          <div style={{ flex: 1 }}>
              <Text size="sm" c="dimmed" mb="xs">Referral Code:</Text>
              <Group>
                <Text ff="monospace" fw={500} size="lg">
                  {referralCode || '—'}
                </Text>
                <CopyButton value={referralCode}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Copied!' : 'Copy code'}>
                    <ActionIcon color={copied ? 'green' : 'blue'} onClick={copy}>
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </div>
          
          <Button
            leftSection={<IconQrcode size={16} />}
            variant="light"
            size="sm"
          >
            QR Code
          </Button>
        </Group>

          <Text size="sm" c="dimmed" mb="xs">Full Referral Link:</Text>
        <Group justify="apart" align="center">
          <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all', flex: 1 }}>
            {referralLink || '—'}
          </Text>
          <CopyButton value={referralLink}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
                <ActionIcon color={copied ? 'green' : 'blue'} onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>

        <Group mt="md">
          <Button
            leftSection={<IconBrandTelegram size={16} />}
            onClick={() => handleShare('telegram')}
            variant="outline"
            color="blue"
            size="sm"
          >
            Share on Telegram
          </Button>
          <Button
            leftSection={<IconBrandWhatsapp size={16} />}
            onClick={() => handleShare('whatsapp')}
            variant="outline"
            color="green"
            size="sm"
          >
            Share on WhatsApp
          </Button>
          <Button
            leftSection={<IconBrandTwitter size={16} />}
            onClick={() => handleShare('twitter')}
            variant="outline"
            color="cyan"
            size="sm"
          >
            Share on Twitter
          </Button>
        </Group>
      </Card>

      {/* Level Progress */}
      {nextLevel && (
        <Card withBorder padding="lg">
          <Group justify="apart" mb="md">
            <Title order={3}>🏆 Level Progress</Title>
            <Badge color={currentLevel.color} variant="light">
              {currentLevel.name} Level
            </Badge>
          </Group>

          <Group justify="apart" mb="xs">
              <Text size="sm">
              Progress to {nextLevel.name} Level
            </Text>
            <Text size="sm" c="dimmed">
              {(data?.stats?.totalReferrals ?? 0)} / {nextLevel.minReferrals} referrals
            </Text>
          </Group>

          <Progress
            value={progressToNextLevel}
            color={nextLevel.color}
            size="lg"
            radius="xl"
            mb="md"
          />

          <Group justify="apart">
            <div>
              <Text size="sm" fw={500}>Current Bonus: {currentLevel.bonus}</Text>
              <Text size="xs" c="dimmed">Your current referral bonus rate</Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text size="sm" fw={500}>Next Level: {nextLevel.bonus}</Text>
              <Text size="xs" c="dimmed">
                {Math.max(nextLevel.minReferrals - (data?.stats?.totalReferrals ?? 0), 0)} more referrals needed
              </Text>
            </div>
          </Group>
        </Card>
      )}

      {/* Referral Levels */}
      <Card withBorder padding="lg">
        <Title order={3} mb="md">🎆 Referral Levels</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md">
          {referralLevels.map((level) => (
            <Card
              key={level.name}
              withBorder
              padding="sm"
              style={{
                backgroundColor: level.name === currentLevel.name ? `${level.color}20` : undefined,
                borderColor: level.name === currentLevel.name ? level.color : undefined,
              }}
            >
              <Stack align="center" gap="xs">
                <ThemeIcon
                  size="lg"
                  style={{ backgroundColor: level.color, color: 'white' }}
                >
                  <IconAward size={20} />
                </ThemeIcon>
                <Text fw={500} size="sm">{level.name}</Text>
                <Text size="xs" c="dimmed">{level.minReferrals}+ referrals</Text>
                <Badge color={level.name === currentLevel.name ? 'green' : 'gray'} size="sm">
                  {level.bonus} bonus
                </Badge>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Card>

      {/* Referral History */}
      <Card withBorder padding="lg">
        <Group justify="apart" mb="md">
          <Title order={3}>📊 Your Referrals</Title>
          <Badge color="blue" variant="light">
            {data?.referredUsers?.length ?? 0} total
          </Badge>
        </Group>

        <Stack gap="md">
          {(data?.referredUsers || []).map((referral) => (
            <Card key={referral.id} withBorder padding="sm">
              <Group justify="apart">
                <Group>
                  <Avatar color="blue" radius="xl">
                    {referral.username.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <div>
                    <Text fw={500} size="sm">
                      {referral.username}
                    </Text>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        Joined {referral.registeredAt}
                      </Text>
                      <Badge size="xs" color="blue" variant="light">
                        Level {referral.level}
                      </Badge>
                    </Group>
                  </div>
                </Group>

                <div style={{ textAlign: 'right' }}>
                  <Text fw={500} size="sm" c="green">
                    +{formatCurrency(referral.yourEarnings)}
                  </Text>
                  <Text size="xs" c="dimmed">
                    from {formatCurrency(referral.totalInvested)} invested
                  </Text>
                  <Badge
                    size="xs"
                    color={referral.isActive ? 'green' : 'gray'}
                    mt="xs"
                  >
                    {referral.isActive ? 'active' : 'inactive'}
                  </Badge>
                </div>
              </Group>
            </Card>
          ))}
        </Stack>

        {(data?.referredUsers?.length ?? 0) === 0 && (
          <Group justify="center" py="xl">
            <Stack align="center" gap="md">
              <ThemeIcon size="xl" variant="light" color="gray">
                <IconUserPlus size={32} />
              </ThemeIcon>
              <Text c="dimmed" ta="center">
                No referrals yet. Start sharing your link!
              </Text>
            </Stack>
          </Group>
        )}
      </Card>

      {/* Share Modal */}
      <Modal opened={shareOpened} onClose={closeShare} title="📢 Share & Earn" centered>
        <Stack gap="md">
          <Alert
            icon={<IconGift size={16} />}
            color="blue"
            variant="light"
          >
            Earn 3% of every friend's investment when they join using your referral link!
          </Alert>

          <Card withBorder padding="md" bg="blue.0">
            <Text size="sm" mb="xs" fw={500}>Your Referral Code:</Text>
            <Group justify="apart">
              <Text ff="monospace" fw={700} size="lg">
                {referralCode || '—'}
              </Text>
              <CopyButton value={referralCode}>
                {({ copied, copy }) => (
                  <ActionIcon color={copied ? 'green' : 'blue'} onClick={copy}>
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          </Card>

          <Divider label="Share on social media" labelPosition="center" />

          <SimpleGrid cols={3} spacing="md">
            <Button
              leftSection={<IconBrandTelegram size={16} />}
              onClick={() => handleShare('telegram')}
              variant="outline"
              color="blue"
              fullWidth
            >
              Telegram
            </Button>
            <Button
              leftSection={<IconBrandWhatsapp size={16} />}
              onClick={() => handleShare('whatsapp')}
              variant="outline"
              color="green"
              fullWidth
            >
              WhatsApp
            </Button>
            <Button
              leftSection={<IconBrandTwitter size={16} />}
              onClick={() => handleShare('twitter')}
              variant="outline"
              color="cyan"
              fullWidth
            >
              Twitter
            </Button>
          </SimpleGrid>

          <Button onClick={handleCopyLink} leftSection={<IconLink size={16} />} fullWidth>
            Copy Referral Link
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
