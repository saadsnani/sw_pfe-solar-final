import { CapacitorConfig } from '@capacitor/cli';

const CAPACITOR_LIVE_SERVER_URL =
  process.env.CAPACITOR_LIVE_SERVER_URL ||
  'https://sw-pfe-solar-final.vercel.app';

const config: CapacitorConfig = {
  appId: 'com.solardashboard.app',
  appName: 'Solar Dashboard',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: CAPACITOR_LIVE_SERVER_URL,
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      spinnerColor: '#999999',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
  },
};

export default config;
