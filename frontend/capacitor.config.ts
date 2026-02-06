import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.sandilya.momentai',
  appName: 'MomentAI',
  webDir: '../dist/frontend',
  server: {
    androidScheme: 'https',
  },
};

export default config;
