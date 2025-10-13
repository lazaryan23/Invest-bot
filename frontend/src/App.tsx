import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppShell, Container, LoadingOverlay } from '@mantine/core';
import { Helmet } from 'react-helmet-async';

// Components
import { Navigation } from '@/components/Navigation/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { TelegramBackButton, TelegramWebAppManager } from '@/components/Telegram/TelegramUI';

// Pages
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { InvestPage } from '@/pages/Invest/InvestPage';
import { WalletPage } from '@/pages/Wallet/WalletPage';
import { TransactionsPage } from '@/pages/Transactions/TransactionsPage';
import { ReferralsPage } from '@/pages/Referrals/ReferralsPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

function App() {
  const isLoading = false; // We'll handle loading in individual components

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Investment Bot - Secure Crypto Investment Platform</title>
        <meta name="description" content="Earn passive income with our secure cryptocurrency investment platform. Competitive returns, transparent operations, and instant withdrawals." />
      </Helmet>

      <Router>
        <TelegramWebAppManager />
        <TelegramBackButton />
        <AppShell
          navbar={{
            width: { base: 0, md: 280 },
            breakpoint: 'md',
            collapsed: { mobile: true },
          }}
          footer={{
            height: { base: 84, md: 0 },
          }}
          padding={{ base: 'xs', md: 0 }}
          styles={(theme) => ({
            main: {
              backgroundColor: 'var(--mantine-color-gray-0)',
              minHeight: '100vh',
              [`@media (max-width: ${theme.breakpoints?.md})`]: {
                paddingBottom: '94px', // Space for mobile nav
              },
            },
          })}
        >
          {/* Desktop Sidebar */}
          <AppShell.Navbar hiddenFrom="base">
            <Navigation />
          </AppShell.Navbar>

          {/* Mobile Bottom Navigation */}
          <AppShell.Footer hiddenFrom="md">
            <Navigation />
          </AppShell.Footer>

          <AppShell.Main bg= "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6)">
            <Container size="xl" p="0">
              <LoadingOverlay visible={isLoading} />
              
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/invest" element={<InvestPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/referrals" element={<ReferralsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Container>
          </AppShell.Main>
        </AppShell>
      </Router>
    </ErrorBoundary>
  );
}

export default App;