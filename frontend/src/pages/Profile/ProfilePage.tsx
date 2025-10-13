import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Stack,
  Title,
  Text,
  Card,
  Group,
  Button,
  TextInput,
  Switch,
  Select,
  Avatar,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Alert,
  Divider,
  Modal,
  PasswordInput,
  Tabs,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconSettings,
  IconShield,
  IconBell,
  IconMoon,
  IconSun,
  IconEdit,
  IconCheck,
  IconX,
  IconKey,
  IconDevices,
  IconTrash,
  IconMail,
  IconPhone,
  IconWorld,
  IconBrandTelegram,
} from '@tabler/icons-react';

// Mock user data
const mockUserData = {
  id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'john_crypto',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  telegramId: 123456789,
  country: 'United States',
  language: 'English',
  timezone: 'UTC-5',
  joinDate: '2024-01-01',
  lastLogin: '2024-01-16 15:30:25',
  isVerified: true,
  twoFactorEnabled: true,
  avatar: null,
  preferences: {
    darkMode: false,
    notifications: {
      email: true,
      telegram: true,
      investment: true,
      withdrawal: true,
      referral: true,
      security: true,
    },
    language: 'en',
    currency: 'USD',
  },
};

const mockSecurityLog = [
  {
    id: '1',
    action: 'Login',
    device: 'Chrome on Windows',
    location: 'New York, US',
    timestamp: '2024-01-16 15:30:25',
    status: 'success',
  },
  {
    id: '2',
    action: 'Withdrawal Request',
    device: 'Telegram Bot',
    location: 'New York, US',
    timestamp: '2024-01-16 14:20:15',
    status: 'success',
  },
  {
    id: '3',
    action: 'Password Change',
    device: 'Mobile App',
    location: 'New York, US',
    timestamp: '2024-01-15 10:15:30',
    status: 'success',
  },
  {
    id: '4',
    action: 'Failed Login Attempt',
    device: 'Unknown',
    location: 'Unknown Location',
    timestamp: '2024-01-14 22:45:12',
    status: 'failed',
  },
];

export function ProfilePage() {
  const settings = useSettings();
  const { t } = settings;
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [securityOpened, { open: openSecurity, close: closeSecurity }] = useDisclosure(false);
  const [notificationSettings, setNotificationSettings] = useState(mockUserData.preferences.notifications);

  const form = useForm({
    initialValues: {
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      email: mockUserData.email,
      phone: mockUserData.phone,
      country: mockUserData.country,
      language: mockUserData.language,
    },
  });

  const handleSaveProfile = () => {
    notifications.show({
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      color: 'green',
      icon: <IconCheck size={16} />,
    });
    setEditing(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    notifications.show({
      title: 'Settings Updated',
      message: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`,
      color: value ? 'green' : 'orange',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'failed': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Stack gap="lg" p="md">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Text fz={{base: 14, sm: 24}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white)">{t('profile.title')}</Text>
          <Text c="dimmed" size="sm">
            Manage your account settings and preferences
          </Text>
        </div>
        <Group>
          {editing ? (
            <>
              <Button
                leftSection={<IconCheck size={16} />}
                onClick={handleSaveProfile}
                color="green"
              >
                Save Changes
              </Button>
              <Button
                leftSection={<IconX size={16} />}
                onClick={() => setEditing(false)}
                variant="outline"
                color="red"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              leftSection={<IconEdit size={16} />}
              onClick={() => setEditing(true)}
              variant="light"
            >
              Edit Profile
            </Button>
          )}
        </Group>
      </Group>

      {/* Profile Overview */}
      <Card withBorder padding="lg">
        <Group>
          <Avatar size={80} color="blue">
            {mockUserData.firstName.charAt(0) + mockUserData.lastName.charAt(0)}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Group justify="apart">
              <div>
                <Group gap="sm">
                  <Title order={3}>
                    {mockUserData.firstName} {mockUserData.lastName}
                  </Title>
                  {mockUserData.isVerified && (
                    <Badge color="green" variant="light" size="sm">
                      ✓ Verified
                    </Badge>
                  )}
                </Group>
                <Text c="dimmed" size="sm">
                  @{mockUserData.username} • Joined {mockUserData.joinDate}
                </Text>
              </div>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mt="md">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="blue">
                  <IconMail size={12} />
                </ThemeIcon>
                <Text size="sm">{mockUserData.email}</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="green">
                  <IconBrandTelegram size={12} />
                </ThemeIcon>
                <Text size="sm">Connected</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="orange">
                  <IconWorld size={12} />
                </ThemeIcon>
                <Text size="sm">{mockUserData.country}</Text>
              </Group>
            </SimpleGrid>
          </div>
        </Group>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} variant="default">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="preferences" leftSection={<IconSettings size={16} />}>
            Preferences
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile">
          <Card withBorder padding="lg" mt="md">
            <Title order={4} mb="md">📝 Personal Information</Title>
            
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                leftSection={<IconUser size={16} />}
                disabled={!editing}
                {...form.getInputProps('firstName')}
              />
              
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                disabled={!editing}
                {...form.getInputProps('lastName')}
              />
              
              <TextInput
                label="Email Address"
                placeholder="Enter email"
                leftSection={<IconMail size={16} />}
                disabled={!editing}
                {...form.getInputProps('email')}
              />
              
              <TextInput
                label="Phone Number"
                placeholder="Enter phone"
                leftSection={<IconPhone size={16} />}
                disabled={!editing}
                {...form.getInputProps('phone')}
              />
              
              <Select
                label="Country"
                placeholder="Select country"
                leftSection={<IconWorld size={16} />}
                disabled={!editing}
                data={[
                  'United States',
                  'Canada',
                  'United Kingdom',
                  'Germany',
                  'France',
                  'Australia',
                  'Japan',
                  'Other'
                ]}
                {...form.getInputProps('country')}
              />
              
            </SimpleGrid>

            <Divider my="md" />

            <Group justify="apart">
              <div>
                <Text fw={500}>Account Verification</Text>
                <Text size="sm" c="dimmed">
                  Complete verification to increase your limits
                </Text>
              </div>
              {mockUserData.isVerified ? (
                <Badge color="green" size="lg">
                  ✓ Verified
                </Badge>
              ) : (
                <Button size="sm" variant="light">
                  Verify Account
                </Button>
              )}
            </Group>
          </Card>
        </Tabs.Panel>

        {/* Security Tab */}
        <Tabs.Panel value="security">
          <Stack gap="md" mt="md">
            <Card withBorder padding="lg">
              <Title order={4} mb="md">🔒 Security Settings</Title>
              
              <Stack gap="md">
                <Group justify="apart">
                  <div>
                    <Text fw={500}>Two-Factor Authentication</Text>
                    <Text size="sm" c="dimmed">
                      Add an extra layer of security to your account
                    </Text>
                  </div>
                  <Switch
                    checked={mockUserData.twoFactorEnabled}
                    color="green"
                    size="md"
                  />
                </Group>

                <Group justify="apart">
                  <div>
                    <Text fw={500}>Change Password</Text>
                    <Text size="sm" c="dimmed">
                      Update your account password
                    </Text>
                  </div>
                  <Button
                    leftSection={<IconKey size={16} />}
                    variant="outline"
                    size="sm"
                    onClick={openSecurity}
                  >
                    Change
                  </Button>
                </Group>

                <Group justify="apart">
                  <div>
                    <Text fw={500}>Active Sessions</Text>
                    <Text size="sm" c="dimmed">
                      Manage your active login sessions
                    </Text>
                  </div>
                  <Button
                    leftSection={<IconDevices size={16} />}
                    variant="outline"
                    size="sm"
                  >
                    Manage
                  </Button>
                </Group>
              </Stack>
            </Card>

            {/* Security Log */}
            <Card withBorder padding="lg">
              <Group justify="apart" mb="md">
                <Title order={4}>📈 Security Activity</Title>
                <Button size="xs" variant="light">
                  View All
                </Button>
              </Group>

              <Stack gap="sm">
                {mockSecurityLog.slice(0, 4).map((log) => (
                  <Card key={log.id} withBorder padding="sm">
                    <Group justify="apart">
                      <Group>
                        <ThemeIcon
                          color={getStatusColor(log.status)}
                          variant="light"
                          size="sm"
                        >
                          {log.status === 'success' ? <IconCheck size={14} /> : <IconX size={14} />}
                        </ThemeIcon>
                        <div>
                          <Text fw={500} size="sm">{log.action}</Text>
                          <Text size="xs" c="dimmed">
                            {log.device} • {log.location}
                          </Text>
                        </div>
                      </Group>
                      <Text size="xs" c="dimmed">
                        {log.timestamp}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        {/* Notifications Tab */}
        <Tabs.Panel value="notifications">
          <Card withBorder padding="lg" mt="md">
            <Title order={4} mb="md">🔔 Notification Preferences</Title>
            
            <Stack gap="md">
              <Group justify="apart">
                <div>
                  <Text fw={500}>Email Notifications</Text>
                  <Text size="sm" c="dimmed">
                    Receive notifications via email
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onChange={(event) => handleNotificationChange('email', event.currentTarget.checked)}
                  color="blue"
                />
              </Group>

              <Group justify="apart">
                <div>
                  <Text fw={500}>Telegram Notifications</Text>
                  <Text size="sm" c="dimmed">
                    Receive notifications via Telegram
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.telegram}
                  onChange={(event) => handleNotificationChange('telegram', event.currentTarget.checked)}
                  color="blue"
                />
              </Group>

              <Divider my="xs" />

              <Group justify="apart">
                <div>
                  <Text fw={500}>Investment Updates</Text>
                  <Text size="sm" c="dimmed">
                    Notifications about your investments
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.investment}
                  onChange={(event) => handleNotificationChange('investment', event.currentTarget.checked)}
                  color="green"
                />
              </Group>

              <Group justify="apart">
                <div>
                  <Text fw={500}>Withdrawal Alerts</Text>
                  <Text size="sm" c="dimmed">
                    Notifications about withdrawals
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.withdrawal}
                  onChange={(event) => handleNotificationChange('withdrawal', event.currentTarget.checked)}
                  color="orange"
                />
              </Group>

              <Group justify="apart">
                <div>
                  <Text fw={500}>Referral Updates</Text>
                  <Text size="sm" c="dimmed">
                    Notifications about your referrals
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.referral}
                  onChange={(event) => handleNotificationChange('referral', event.currentTarget.checked)}
                  color="purple"
                />
              </Group>

              <Group justify="apart">
                <div>
                  <Text fw={500}>Security Alerts</Text>
                  <Text size="sm" c="dimmed">
                    Important security notifications
                  </Text>
                </div>
                <Switch
                  checked={notificationSettings.security}
                  onChange={(event) => handleNotificationChange('security', event.currentTarget.checked)}
                  color="red"
                />
              </Group>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Preferences Tab */}
        <Tabs.Panel value="preferences">
          <Stack gap="md" mt="md">
            <Card withBorder padding="lg">
            <Title order={4} mb="md">{t('profile.preferences')}</Title>
              
              <Stack gap="md">
                <Group justify="apart">
                  <div>
                    <Text fw={500}>{t('profile.dark_mode')}</Text>
                    <Text size="sm" c="dimmed">
                      Toggle dark theme
                    </Text>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onChange={(event) => {
                      settings.setDarkMode(event.currentTarget.checked);
                      notifications.show({
                        title: 'Theme Updated',
                        message: `${event.currentTarget.checked ? 'Dark' : 'Light'} mode enabled`,
                        color: event.currentTarget.checked ? 'dark' : 'yellow',
                        icon: event.currentTarget.checked ? <IconMoon size={16} /> : <IconSun size={16} />,
                      });
                    }}
                    color="dark"
                    onLabel={<IconMoon size={16} />}
                    offLabel={<IconSun size={16} />}
                  />
                </Group>


              </Stack>
            </Card>
            

            {/* Danger Zone */}
            <Card withBorder padding="lg" style={{ borderColor: 'red' }}>
              <Title order={4} mb="md" c="red">⚠️ Danger Zone</Title>
              
              <Alert
                icon={<IconTrash size={16} />}
                title="Account Deletion"
                color="red"
                variant="light"
                mb="md"
              >
                Once you delete your account, there is no going back. All your data will be permanently deleted.
              </Alert>

              <Group justify="apart">
                <div>
                  <Text fw={500} c="red">Delete Account</Text>
                  <Text size="sm" c="dimmed">
                    Permanently delete your account and all data
                  </Text>
                </div>
                <Button
                  leftSection={<IconTrash size={16} />}
                  color="red"
                  variant="outline"
                  size="sm"
                >
                  Delete Account
                </Button>
              </Group>
            </Card>
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Change Password Modal */}
      <Modal
        opened={securityOpened}
        onClose={closeSecurity}
        title="🔐 Change Password"
        centered
      >
        <Stack gap="md">
          <Alert
            icon={<IconShield size={16} />}
            color="blue"
            variant="light"
          >
            Choose a strong password that you haven't used elsewhere.
          </Alert>

          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            required
          />
          
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            required
          />
          
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            required
          />

          <Group justify="apart">
            <Button variant="outline" onClick={closeSecurity}>
              Cancel
            </Button>
            <Button
              leftSection={<IconKey size={16} />}
              onClick={() => {
                notifications.show({
                  title: 'Password Changed',
                  message: 'Your password has been successfully updated.',
                  color: 'green',
                });
                closeSecurity();
              }}
            >
              Change Password
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
