import {Stack, NavLink, Text, Group, useMatches, UnstyledButton, rem} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import {
  IconDashboard,
  IconCoin,
  IconWallet,
  IconTransfer,
  IconUsers,
  IconUser,
} from '@tabler/icons-react';


const navigationItems = [
  { label: 'Dashboard', mobileLabel: 'Home', icon: IconDashboard, href: '/dashboard' },
  { label: 'Invest', mobileLabel: 'Invest', icon: IconCoin, href: '/invest' },
  { label: 'Wallet', mobileLabel: 'Wallet', icon: IconWallet, href: '/wallet' },
  { label: 'Transactions', mobileLabel: 'History', icon: IconTransfer, href: '/transactions' },
  { label: 'Referrals', mobileLabel: 'Friends', icon: IconUsers, href: '/referrals' },
  { label: 'Profile', mobileLabel: 'Profile', icon: IconUser, href: '/profile' },
];

// Full navigation for desktop
const desktopNavigationItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Invest', icon: IconCoin, href: '/invest' },
  { label: 'Wallet', icon: IconWallet, href: '/wallet' },
  { label: 'Transactions', icon: IconTransfer, href: '/transactions' },
  { label: 'Referrals', icon: IconUsers, href: '/referrals' },
  { label: 'Profile', icon: IconUser, href: '/profile' },
];

function MobileNavItem({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <UnstyledButton
      component={Link}
      to={item.href}
style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: rem(4),
        minWidth: rem(42),
        flex: 1,
        textDecoration: 'none',
        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
        borderRadius: rem(16),
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: isActive ? 'blur(12px)' : 'none',
        border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : 'none',
        boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.1)' : 'none',
        transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
      }}
    >
      <item.icon size={20} stroke={1.5} />
      <Text size="xs" mt={2} fw={isActive ? 600 : 500} style={{ fontSize: '9px', textAlign: 'center', letterSpacing: '0.1px' }}>
        {item.mobileLabel || item.label}
      </Text>
    </UnstyledButton>
  );
}

function DesktopNavItem({ item, isActive }: { item: any; isActive: boolean }) {
  return (
    <NavLink
      key={item.href}
      component={Link}
      to={item.href}
      label={item.label}
      leftSection={<item.icon size={20} />}
      active={isActive}
      styles={(theme) => ({
        root: {
          borderRadius: theme.radius.md,
          margin: '0 8px 4px 4px',
        },
      })}
    />
  );
}

export function Navigation() {
  const { t } = useSettings();
  const location = useLocation();
  const isMobile = useMatches({ base: true, md: false });

  if (isMobile) {
    // Mobile bottom navigation
    return (
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px',
            height: '64px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(24px)',
            borderRadius: '32px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
            margin: '0 auto',
            padding: '0 8px',
            gap: '4px',
          }}
        >
          {navigationItems.map((item) => (
            <MobileNavItem
              key={item.href}
              item={item}
              isActive={location.pathname === item.href}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop sidebar navigation
  return (
    <Stack gap={0} py="md"  h="100%" style={{
        backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6)"}}>
      <Group>
        <Text fz={{base: 14, sm: 24}} pl="xs" fw={700} mb="md" c="blue" size="lg">
          {t('app.title')}
        </Text>
      </Group>

      <Stack gap="xs" flex={1} pr="xs">
        {desktopNavigationItems.map((item) => (
          <DesktopNavItem
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
          />
        ))}
      </Stack>

      {/* User info section */}
      <Group justify="start" mt="auto" p="md">
        <Text fz={{base: 14, sm: 16}} c="light-dark(var(--mantine-color-black), var(--mantine-color-white)" size="sm" ta="start">
          {t('common.welcome')}
        </Text>
      </Group>
    </Stack>
  );
}
