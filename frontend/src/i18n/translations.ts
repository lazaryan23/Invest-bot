// Translation keys and values
export type TranslationKey = 
  | 'app.title'
  | 'nav.home'
  | 'nav.invest'
  | 'nav.wallet'
  | 'nav.transactions'
  | 'nav.referrals'
  | 'nav.profile'
  | 'dashboard.overview'
  | 'dashboard.newInvestment'
  | 'dashboard.totalInvested'
  | 'dashboard.totalProfit'
  | 'dashboard.totalBalance'
  | 'dashboard.referralEarnings'
  | 'dashboard.activeInvestments'
  | 'dashboard.noInvestments'
  | 'dashboard.startInvesting'
  | 'dashboard.makeInvestment'
  | 'dashboard.makeInvestmentDesc'
  | 'dashboard.manageWallet'
  | 'dashboard.manageWalletDesc'
  | 'dashboard.referralProgram'
  | 'dashboard.referralProgramDesc'
  | 'invest.title'
  | 'invest.subtitle'
  | 'invest.plans'
  | 'invest.duration'
  | 'invest.minAmount'
  | 'invest.maxAmount'
  | 'invest.totalReturn'
  | 'invest.riskLevel'
  | 'invest.profitRate'
  | 'invest.features'
  | 'invest.investNow'
  | 'invest.investIn'
  | 'invest.investmentAmount'
  | 'invest.enterAmount'
  | 'invest.amountRange'
  | 'invest.expectedReturns'
  | 'invest.investment'
  | 'invest.estimatedProfit'
  | 'invest.maturityDate'
  | 'invest.confirmInvestment'
  | 'invest.noPlans'
  | 'invest.noPlansDesc'
  | 'wallet.balance'
  | 'wallet.deposit'
  | 'wallet.withdraw'
  | 'wallet.available_balance'
  | 'wallet.total_deposited'
  | 'wallet.total_withdrawn'
  | 'wallet.pending_transactions'
  | 'transactions.title'
  | 'transactions.history'
  | 'referrals.title'
  | 'referrals.program'
  | 'profile.title'
  | 'profile.personal_info'
  | 'profile.preferences'
  | 'profile.dark_mode'
  | 'profile.language'
  | 'profile.currency_display'
  | 'common.welcome'
  | 'common.settings'
  | 'common.save'
  | 'common.cancel'
  | 'common.edit'
  | 'common.loading'
  | 'common.error'
  | 'common.success';

export const translations: Record<string, Record<TranslationKey, string>> = {
  en: {
    'app.title': 'InvestHub',
    'nav.home': 'Home',
    'nav.invest': 'Invest',
    'nav.wallet': 'Wallet',
    'nav.transactions': 'History',
    'nav.referrals': 'Friends',
    'nav.profile': 'Profile',
    'dashboard.overview': 'Here\'s your investment overview',
    'dashboard.newInvestment': 'New Investment',
    'dashboard.totalInvested': 'Total Invested',
    'dashboard.totalProfit': 'Total Profit',
    'dashboard.totalBalance': 'Total Balance',
    'dashboard.referralEarnings': 'Referral Earnings',
    'dashboard.activeInvestments': 'Active Investments',
    'dashboard.noInvestments': 'No active investments yet',
    'dashboard.startInvesting': 'Start Investing',
    'dashboard.makeInvestment': 'Make Investment',
    'dashboard.makeInvestmentDesc': 'Choose a plan and start earning',
    'dashboard.manageWallet': 'Manage Wallet',
    'dashboard.manageWalletDesc': 'Deposit or withdraw funds',
    'dashboard.referralProgram': 'Referral Program',
    'dashboard.referralProgramDesc': 'Invite friends and earn rewards',
    'invest.title': '💰 Investment Plans',
    'invest.subtitle': 'Choose a plan that suits your investment goals',
    'invest.plans': 'Available Plans',
    'invest.duration': 'Duration',
    'invest.minAmount': 'Min Amount',
    'invest.maxAmount': 'Max Amount',
    'invest.totalReturn': 'Total Return',
    'invest.riskLevel': 'Risk Level',
    'invest.profitRate': 'Profit Rate',
    'invest.features': 'Features',
    'invest.investNow': 'Invest Now',
    'invest.investIn': 'Invest in',
    'invest.investmentAmount': 'Investment Amount',
    'invest.enterAmount': 'Enter amount',
    'invest.amountRange': 'Amount must be between',
    'invest.expectedReturns': 'Expected Returns',
    'invest.investment': 'Investment',
    'invest.estimatedProfit': 'Est. Profit',
    'invest.maturityDate': 'Maturity Date',
    'invest.confirmInvestment': 'Confirm Investment',
    'invest.noPlans': 'No Investment Plans Available',
    'invest.noPlansDesc': 'Investment plans are currently unavailable. Please check back later.',
    'wallet.balance': 'Balance',
    'wallet.deposit': 'Deposit',
    'wallet.withdraw': 'Withdraw',
    'wallet.available_balance': 'Available Balance',
    'wallet.total_deposited': 'Total Deposited',
    'wallet.total_withdrawn': 'Total Withdrawn',
    'wallet.pending_transactions': 'Transactions',
    'transactions.title': '📊 Transaction History',
    'transactions.history': 'Recent Transactions',
    'referrals.title': '👥 Referral Program',
    'referrals.program': 'Earn 3% bonus on every friend\'s investment',
    'profile.title': '👤 My Profile',
    'profile.personal_info': '📝 Personal Information',
    'profile.preferences': '⚙️ Display Preferences',
    'profile.dark_mode': 'Dark Mode',
    'profile.language': 'Language',
    'profile.currency_display': 'Currency Display',
    'common.welcome': 'Welcome to InvestHub!',
    'common.settings': 'Settings',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  es: {
    'app.title': '💰 Bot de Inversión',
    'nav.home': 'Inicio',
    'nav.invest': 'Invertir',
    'nav.wallet': 'Billetera',
    'nav.transactions': 'Historial',
    'nav.referrals': 'Amigos',
    'nav.profile': 'Perfil',
    'dashboard.overview': 'Aquí está tu resumen de inversiones',
    'dashboard.newInvestment': 'Nueva Inversión',
    'dashboard.totalInvested': 'Total Invertido',
    'dashboard.totalProfit': 'Ganancia Total',
    'dashboard.totalBalance': 'Balance Total',
    'dashboard.referralEarnings': 'Ganancias por Referidos',
    'dashboard.activeInvestments': 'Inversiones Activas',
    'dashboard.noInvestments': 'Aún no tienes inversiones activas',
    'dashboard.startInvesting': 'Comenzar a Invertir',
    'dashboard.makeInvestment': 'Hacer Inversión',
    'dashboard.makeInvestmentDesc': 'Elige un plan y comienza a ganar',
    'dashboard.manageWallet': 'Administrar Billetera',
    'dashboard.manageWalletDesc': 'Depositar o retirar fondos',
    'dashboard.referralProgram': 'Programa de Referidos',
    'dashboard.referralProgramDesc': 'Invita amigos y gana recompensas',
    'invest.title': '💰 Planes de Inversión',
    'invest.subtitle': 'Elige un plan que se adapte a tus objetivos de inversión',
    'invest.plans': 'Planes Disponibles',
    'invest.duration': 'Duración',
    'invest.minAmount': 'Cantidad Mínima',
    'invest.maxAmount': 'Cantidad Máxima',
    'invest.totalReturn': 'Retorno Total',
    'invest.riskLevel': 'Nivel de Riesgo',
    'invest.profitRate': 'Tasa de Ganancia',
    'invest.features': 'Características',
    'invest.investNow': 'Invertir Ahora',
    'invest.investIn': 'Invertir en',
    'invest.investmentAmount': 'Cantidad de Inversión',
    'invest.enterAmount': 'Ingresar cantidad',
    'invest.amountRange': 'La cantidad debe estar entre',
    'invest.expectedReturns': 'Retornos Esperados',
    'invest.investment': 'Inversión',
    'invest.estimatedProfit': 'Ganancia Est.',
    'invest.maturityDate': 'Fecha de Vencimiento',
    'invest.confirmInvestment': 'Confirmar Inversión',
    'invest.noPlans': 'No Hay Planes de Inversión Disponibles',
    'invest.noPlansDesc': 'Los planes de inversión no están disponibles actualmente. Inténtalo más tarde.',
    'wallet.balance': 'Balance',
    'wallet.deposit': 'Depositar',
    'wallet.withdraw': 'Retirar',
    'wallet.available_balance': 'Balance Disponible',
    'wallet.total_deposited': 'Total Depositado',
    'wallet.total_withdrawn': 'Total Retirado',
    'wallet.pending_transactions': 'Transacciones',
    'transactions.title': '📊 Historial de Transacciones',
    'transactions.history': 'Transacciones Recientes',
    'referrals.title': '👥 Programa de Referidos',
    'referrals.program': 'Gana 3% de bonificación en cada inversión de amigos',
    'profile.title': '👤 Mi Perfil',
    'profile.personal_info': '📝 Información Personal',
    'profile.preferences': '⚙️ Preferencias de Visualización',
    'profile.dark_mode': 'Modo Oscuro',
    'profile.language': 'Idioma',
    'profile.currency_display': 'Mostrar Moneda',
    'common.welcome': '¡Bienvenido! 👋',
    'common.settings': 'Configuración',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
  },
  fr: {
    'app.title': '💰 Bot d\'Investissement',
    'nav.home': 'Accueil',
    'nav.invest': 'Investir',
    'nav.wallet': 'Portefeuille',
    'nav.transactions': 'Historique',
    'nav.referrals': 'Amis',
    'nav.profile': 'Profil',
    'dashboard.overview': 'Voici votre aperçu d\'investissement',
    'dashboard.newInvestment': 'Nouvel Investissement',
    'dashboard.totalInvested': 'Total Investi',
    'dashboard.totalProfit': 'Bénéfice Total',
    'dashboard.totalBalance': 'Solde Total',
    'dashboard.referralEarnings': 'Gains de Parrainage',
    'dashboard.activeInvestments': 'Investissements Actifs',
    'dashboard.noInvestments': 'Aucun investissement actif pour le moment',
    'dashboard.startInvesting': 'Commencer à Investir',
    'dashboard.makeInvestment': 'Faire un Investissement',
    'dashboard.makeInvestmentDesc': 'Choisissez un plan et commencez à gagner',
    'dashboard.manageWallet': 'Gérer le Portefeuille',
    'dashboard.manageWalletDesc': 'Déposer ou retirer des fonds',
    'dashboard.referralProgram': 'Programme de Parrainage',
    'dashboard.referralProgramDesc': 'Invitez des amis et gagnez des récompenses',
    'invest.title': '💰 Plans d\'Investissement',
    'invest.subtitle': 'Choisissez un plan qui correspond à vos objectifs d\'investissement',
    'invest.plans': 'Plans Disponibles',
    'invest.duration': 'Durée',
    'invest.minAmount': 'Montant Min',
    'invest.maxAmount': 'Montant Max',
    'invest.totalReturn': 'Rendement Total',
    'invest.riskLevel': 'Niveau de Risque',
    'invest.profitRate': 'Taux de Profit',
    'invest.features': 'Caractéristiques',
    'invest.investNow': 'Investir Maintenant',
    'invest.investIn': 'Investir dans',
    'invest.investmentAmount': 'Montant d\'Investissement',
    'invest.enterAmount': 'Entrez le montant',
    'invest.amountRange': 'Le montant doit être entre',
    'invest.expectedReturns': 'Rendements Attendus',
    'invest.investment': 'Investissement',
    'invest.estimatedProfit': 'Profit Est.',
    'invest.maturityDate': 'Date d\'Echéance',
    'invest.confirmInvestment': 'Confirmer l\'Investissement',
    'invest.noPlans': 'Aucun Plan d\'Investissement Disponible',
    'invest.noPlansDesc': 'Les plans d\'investissement ne sont pas disponibles actuellement. Veuillez revenir plus tard.',
    'wallet.balance': 'Solde',
    'wallet.deposit': 'Dépôt',
    'wallet.withdraw': 'Retrait',
    'wallet.available_balance': 'Solde Disponible',
    'wallet.total_deposited': 'Total Déposé',
    'wallet.total_withdrawn': 'Total Retiré',
    'wallet.pending_transactions': 'Transactions',
    'transactions.title': '📊 Historique des Transactions',
    'transactions.history': 'Transactions Récentes',
    'referrals.title': '👥 Programme de Parrainage',
    'referrals.program': 'Gagnez 3% de bonus sur chaque investissement d\'ami',
    'profile.title': '👤 Mon Profil',
    'profile.personal_info': '📝 Informations Personnelles',
    'profile.preferences': '⚙️ Préférences d\'Affichage',
    'profile.dark_mode': 'Mode Sombre',
    'profile.language': 'Langue',
    'profile.currency_display': 'Affichage de Devise',
    'common.welcome': 'Bienvenue! 👋',
    'common.settings': 'Paramètres',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  de: {
    'app.title': '💰 Investment Bot',
    'nav.home': 'Startseite',
    'nav.invest': 'Investieren',
    'nav.wallet': 'Wallet',
    'nav.transactions': 'Verlauf',
    'nav.referrals': 'Freunde',
    'nav.profile': 'Profil',
    'dashboard.overview': 'Hier ist Ihre Investment-Übersicht',
    'dashboard.newInvestment': 'Neue Investition',
    'dashboard.totalInvested': 'Gesamt Investiert',
    'dashboard.totalProfit': 'Gesamtgewinn',
    'dashboard.totalBalance': 'Gesamtsaldo',
    'dashboard.referralEarnings': 'Empfehlungsverdienst',
    'dashboard.activeInvestments': 'Aktive Investitionen',
    'dashboard.noInvestments': 'Noch keine aktiven Investitionen',
    'dashboard.startInvesting': 'Investieren Beginnen',
    'dashboard.makeInvestment': 'Investition Tätigen',
    'dashboard.makeInvestmentDesc': 'Wählen Sie einen Plan und beginnen Sie zu verdienen',
    'dashboard.manageWallet': 'Wallet Verwalten',
    'dashboard.manageWalletDesc': 'Geld einzahlen oder abheben',
    'dashboard.referralProgram': 'Empfehlungsprogramm',
    'dashboard.referralProgramDesc': 'Freunde einladen und Belohnungen verdienen',
    'invest.title': '💰 Investitionspläne',
    'invest.subtitle': 'Wählen Sie einen Plan, der zu Ihren Investitionszielen passt',
    'invest.plans': 'Verfügbare Pläne',
    'invest.duration': 'Dauer',
    'invest.minAmount': 'Mindestbetrag',
    'invest.maxAmount': 'Höchstbetrag',
    'invest.totalReturn': 'Gesamtrendite',
    'invest.riskLevel': 'Risikoniveau',
    'invest.profitRate': 'Gewinnrate',
    'invest.features': 'Funktionen',
    'invest.investNow': 'Jetzt Investieren',
    'invest.investIn': 'Investieren in',
    'invest.investmentAmount': 'Investitionsbetrag',
    'invest.enterAmount': 'Betrag eingeben',
    'invest.amountRange': 'Der Betrag muss zwischen',
    'invest.expectedReturns': 'Erwartete Renditen',
    'invest.investment': 'Investition',
    'invest.estimatedProfit': 'Gesch. Gewinn',
    'invest.maturityDate': 'Fälligkeitsdatum',
    'invest.confirmInvestment': 'Investition Bestätigen',
    'invest.noPlans': 'Keine Investitionspläne Verfügbar',
    'invest.noPlansDesc': 'Investitionspläne sind derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.',
    'wallet.balance': 'Guthaben',
    'wallet.deposit': 'Einzahlung',
    'wallet.withdraw': 'Abhebung',
    'wallet.available_balance': 'Verfügbares Guthaben',
    'wallet.total_deposited': 'Gesamt Eingezahlt',
    'wallet.total_withdrawn': 'Gesamt Abgehoben',
    'wallet.pending_transactions': 'Transaktionen',
    'transactions.title': '📊 Transaktionsverlauf',
    'transactions.history': 'Letzte Transaktionen',
    'referrals.title': '👥 Empfehlungsprogramm',
    'referrals.program': 'Verdienen Sie 3% Bonus auf jede Freundes-Investition',
    'profile.title': '👤 Mein Profil',
    'profile.personal_info': '📝 Persönliche Informationen',
    'profile.preferences': '⚙️ Anzeigeeinstellungen',
    'profile.dark_mode': 'Dunkler Modus',
    'profile.language': 'Sprache',
    'profile.currency_display': 'Währungsanzeige',
    'common.welcome': 'Willkommen! 👋',
    'common.settings': 'Einstellungen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolgreich',
  },
};

// Hook to use translations
export function useTranslations(language: string) {
  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return { t };
}