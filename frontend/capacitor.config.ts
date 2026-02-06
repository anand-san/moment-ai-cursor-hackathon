import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.sandilya.momentai',
  appName: 'MomentAI',
  webDir: '../dist/frontend',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },
};

export default config;
