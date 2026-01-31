/**
 * iOS Design Tokens - Apple Human Interface Guidelines
 * Based on Design.md specifications
 */

// iOS System Colors
export const colors = {
  // iOS System Colors
  system: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC00',
  },

  // App Primary (iOS Indigo-based)
  primary: '#5856D6',
  primaryLight: 'rgba(88, 86, 214, 0.12)',
  primaryMedium: 'rgba(88, 86, 214, 0.2)',
  primaryDark: 'rgba(88, 86, 214, 0.5)',

  // iOS Label Colors
  label: {
    primary: '#000000',
    secondary: 'rgba(60, 60, 67, 0.6)', // 60% opacity
    tertiary: 'rgba(60, 60, 67, 0.3)', // 30% opacity
    quaternary: 'rgba(60, 60, 67, 0.18)', // 18% opacity
  },

  // iOS Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#FFFFFF',
    grouped: '#F2F2F7',
  },

  // iOS Fill Colors
  fill: {
    primary: 'rgba(120, 120, 128, 0.2)', // 20% opacity
    secondary: 'rgba(120, 120, 128, 0.16)', // 16% opacity
    tertiary: 'rgba(118, 118, 128, 0.12)', // 12% opacity
    quaternary: 'rgba(116, 116, 128, 0.08)', // 8% opacity
  },

  // iOS Separator
  separator: 'rgba(60, 60, 67, 0.29)',
  opaqueSeparator: '#C6C6C8',
} as const;

// iOS Typography - SF Pro (uses system font stack)
export const typography = {
  // Large Title - Navigation Bars
  largeTitle: {
    fontSize: '34px',
    fontWeight: 700,
    lineHeight: '41px',
    letterSpacing: '0.37px',
  },

  // Title 1 - Page Headers
  title1: {
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: '34px',
    letterSpacing: '0.36px',
  },

  // Title 2 - Section Headers
  title2: {
    fontSize: '22px',
    fontWeight: 700,
    lineHeight: '28px',
    letterSpacing: '0.35px',
  },

  // Title 3 - Subsections
  title3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '25px',
    letterSpacing: '0.38px',
  },

  // Headline - Emphasized Body
  headline: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
    letterSpacing: '-0.41px',
  },

  // Body - Primary Content
  body: {
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: '22px',
    letterSpacing: '-0.41px',
  },

  // Callout - Secondary Content
  callout: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '21px',
    letterSpacing: '-0.32px',
  },

  // Subheadline
  subheadline: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '-0.24px',
  },

  // Footnote - Tertiary Content
  footnote: {
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: '18px',
    letterSpacing: '-0.08px',
  },

  // Caption 1 - Labels
  caption1: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0',
  },

  // Caption 2 - Secondary Labels
  caption2: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: '13px',
    letterSpacing: '0.07px',
  },
} as const;

// iOS Spacing & Layout
export const spacing = {
  // iOS Standard Margins
  layoutMargin: 16,
  layoutMarginReadable: 20,

  // Component Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const layout = {
  // iOS Corner Radii
  cornerRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    full: 9999,
  },

  // iOS Touch Targets
  minTouchTarget: 44,

  // iOS Navigation Bar Heights
  navBar: {
    standard: 44,
    large: 96,
  },

  // Voice Button Size
  voiceButton: 80,

  // Tab Bar
  tabBar: {
    height: 49,
    floatingButtonSize: 64,
    floatingButtonElevation: -20, // negative to raise above tab bar
  },
} as const;

// iOS Animation Curves
export const animations = {
  // Standard iOS Curve
  standard: {
    duration: '350ms',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Quick Response (Button Press)
  quick: {
    duration: '100ms',
    easing: 'ease-out',
  },

  // Pulse Animation
  pulse: {
    duration: '2s',
    easing: 'ease-in-out',
  },

  // Page Transition
  pageTransition: {
    duration: '350ms',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
} as const;

// SF Pro Font Stack (system fonts that approximate SF Pro on web)
export const fontFamily = {
  system:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

// iOS Effects
export const effects = {
  backdropBlur: 'blur(20px)',
  tabBarShadow: '0 -0.5px 0 rgba(0, 0, 0, 0.12)',
  floatingButtonShadow: '0 4px 16px rgba(88, 86, 214, 0.3)',
} as const;

// CSS custom properties for iOS theme
export const cssVariables = `
  --ios-primary: ${colors.primary};
  --ios-primary-light: ${colors.primaryLight};
  --ios-primary-medium: ${colors.primaryMedium};
  --ios-background: ${colors.background.primary};
  --ios-label-primary: ${colors.label.primary};
  --ios-label-secondary: ${colors.label.secondary};
  --ios-fill-tertiary: ${colors.fill.tertiary};
  --ios-font-family: ${fontFamily.system};
`;
