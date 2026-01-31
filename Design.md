# ADHD Support App - Design System (Apple HIG Compliant)

## Apple Human Interface Guidelines - Kernprinzipien

### 1. Klarheit (Clarity)

- Text ist in jeder Größe lesbar
- Icons sind präzise und verständlich
- Dezente Gestaltung betont Funktionalität
- Negativraum, Farbe und Schrift führen durch die Hierarchie

### 2. Zurückhaltung (Deference)

- UI unterstützt den Inhalt, konkurriert nicht
- Fluid Motion vermittelt Status
- Transluzenz und Blur geben Kontext

### 3. Tiefe (Depth)

- Visuelle Ebenen und realistische Bewegung
- Touch und Entdeckbarkeit fördern Freude
- Navigation durch Übergänge

---

## iOS Design Tokens

### Farben (iOS System Colors)

```typescript
export const colors = {
  // iOS System Colors
  system: {
    blue: "#007AFF",
    green: "#34C759",
    indigo: "#5856D6",
    orange: "#FF9500",
    pink: "#FF2D55",
    purple: "#AF52DE",
    red: "#FF3B30",
    teal: "#5AC8FA",
    yellow: "#FFCC00",
  },

  // App Primary (iOS Indigo-basiert)
  primary: "#5856D6",
  primaryLight: "rgba(88, 86, 214, 0.12)",

  // iOS Label Colors
  label: {
    primary: "#000000", // UIColor.label
    secondary: "#3C3C4399", // UIColor.secondaryLabel (60% opacity)
    tertiary: "#3C3C434D", // UIColor.tertiaryLabel (30% opacity)
    quaternary: "#3C3C432E", // UIColor.quaternaryLabel (18% opacity)
  },

  // iOS Background Colors
  background: {
    primary: "#FFFFFF", // UIColor.systemBackground
    secondary: "#F2F2F7", // UIColor.secondarySystemBackground
    tertiary: "#FFFFFF", // UIColor.tertiarySystemBackground
    grouped: "#F2F2F7", // UIColor.systemGroupedBackground
  },

  // iOS Fill Colors
  fill: {
    primary: "#78788033", // 20% opacity
    secondary: "#78788029", // 16% opacity
    tertiary: "#7676801F", // 12% opacity
    quaternary: "#74748014", // 8% opacity
  },

  // iOS Separator
  separator: "#3C3C4349", // UIColor.separator
  opaqueSeparator: "#C6C6C8", // UIColor.opaqueSeparator

  // Swipe Feedback
  swipe: {
    right: "#34C759", // System Green
    rightBg: "rgba(52, 199, 89, 0.12)",
    left: "#FF3B30", // System Red
    leftBg: "rgba(255, 59, 48, 0.12)",
  },

  // Prioritäten
  priority: {
    low: "#34C759", // System Green
    medium: "#FF9500", // System Orange
    high: "#FF9500", // System Orange
    urgent: "#FF3B30", // System Red
  },

  // Kategorien (iOS-konforme Farben)
  category: {
    time_blindness: "#AF52DE", // Purple
    forgetfulness: "#FF2D55", // Pink
    emotional_regulation: "#5AC8FA", // Teal
    task_initiation: "#FF9500", // Orange
    organization: "#34C759", // Green
    overwhelm: "#5856D6", // Indigo
    focus: "#007AFF", // Blue
    impulse_control: "#FF3B30", // Red
  },
};
```

---

## iOS Typografie (SF Pro)

```typescript
// iOS verwendet SF Pro automatisch als System Font
// Diese Werte entsprechen den Apple Text Styles

export const typography = {
  // Large Title - Navigation Bars
  largeTitle: {
    fontSize: 34,
    fontWeight: "700" as const,
    lineHeight: 41,
    letterSpacing: 0.37,
  },

  // Title 1 - Page Headers
  title1: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
    letterSpacing: 0.36,
  },

  // Title 2 - Section Headers
  title2: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 28,
    letterSpacing: 0.35,
  },

  // Title 3 - Subsections
  title3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 25,
    letterSpacing: 0.38,
  },

  // Headline - Emphasized Body
  headline: {
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },

  // Body - Primary Content
  body: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 22,
    letterSpacing: -0.41,
  },

  // Callout - Secondary Content
  callout: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 21,
    letterSpacing: -0.32,
  },

  // Subheadline
  subheadline: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 20,
    letterSpacing: -0.24,
  },

  // Footnote - Tertiary Content
  footnote: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: -0.08,
  },

  // Caption 1 - Labels
  caption1: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Caption 2 - Secondary Labels
  caption2: {
    fontSize: 11,
    fontWeight: "400" as const,
    lineHeight: 13,
    letterSpacing: 0.07,
  },
};
```

---

## iOS Spacing & Layout

```typescript
export const spacing = {
  // iOS Standard Margins
  layoutMargin: 16, // Standard horizontal margin
  layoutMarginReadable: 20, // Readable content width margin

  // Component Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const layout = {
  // iOS Corner Radii
  cornerRadius: {
    small: 8, // Buttons, small cards
    medium: 12, // Cards, inputs
    large: 16, // Large cards
    xlarge: 20, // Modal sheets
    continuous: "continuous", // iOS Continuous Corners (squircle)
  },

  // iOS Safe Areas (handled by SafeAreaView)
  safeArea: {
    top: "auto",
    bottom: 34, // Home indicator area
  },

  // iOS Touch Targets
  minTouchTarget: 44, // Minimum 44x44pt

  // iOS Navigation Bar Heights
  navBar: {
    standard: 44,
    large: 96,
  },

  // iOS Tab Bar Height
  tabBar: 49,
};
```

---

## iOS Materials & Effects

```typescript
import { Platform, StyleSheet } from "react-native";

// iOS Blur Materials
export const materials = {
  // Thick Material (Navigation Bars)
  thick: {
    ios: {
      blurType: "light",
      blurAmount: 20,
    },
  },

  // Regular Material (Cards)
  regular: {
    ios: {
      blurType: "light",
      blurAmount: 10,
    },
  },

  // Thin Material (Overlays)
  thin: {
    ios: {
      blurType: "xlight",
      blurAmount: 5,
    },
  },

  // Ultra Thin Material
  ultraThin: {
    ios: {
      blurType: "xlight",
      blurAmount: 2,
    },
  },
};

// iOS-konforme Schatten
export const shadows = {
  // Kleine Elevation (Buttons)
  small: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 1,
    },
    android: { elevation: 1 },
  }),

  // Mittlere Elevation (Cards)
  medium: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 3 },
  }),

  // Große Elevation (Modals, Floating Elements)
  large: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  }),

  // Extra Große Elevation (Sheets)
  xlarge: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
    },
    android: { elevation: 16 },
  }),
};
```

---

## iOS-konforme Komponenten

### Buttons (HIG Compliant)

```typescript
export const buttonStyles = StyleSheet.create({
  // Filled Button (Primary Action)
  filled: {
    backgroundColor: colors.primary,
    borderRadius: layout.cornerRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  filledText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.41,
  },

  // Gray Button (Secondary Action)
  gray: {
    backgroundColor: colors.fill.secondary,
    borderRadius: layout.cornerRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  grayText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.41,
  },

  // Plain Button (Tertiary/Text)
  plain: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  plainText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.41,
  },

  // Pressed State (alle Buttons)
  pressed: {
    opacity: 0.7,
  },
});
```

### Cards (iOS Style)

```typescript
export const cardStyles = StyleSheet.create({
  // Grouped Inset Card (Settings-Style)
  groupedInset: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.cornerRadius.medium,
    marginHorizontal: spacing.layoutMargin,
    ...shadows.small,
  },

  // Floating Card (Prominent)
  floating: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.cornerRadius.large,
    marginHorizontal: spacing.layoutMargin,
    ...shadows.large,
  },

  // Material Card (Blur Background)
  material: {
    borderRadius: layout.cornerRadius.large,
    overflow: "hidden",
    ...shadows.medium,
  },
});
```

### Voice Button (iOS Style)

```typescript
export const voiceButtonStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    // iOS-typischer subtiler Rand
    borderWidth: 1,
    borderColor: "rgba(88, 86, 214, 0.2)",
  },

  containerActive: {
    backgroundColor: "rgba(88, 86, 214, 0.2)",
    borderColor: colors.primary,
    // Subtile Skalierung beim Drücken
    transform: [{ scale: 0.96 }],
  },

  icon: {
    width: 28,
    height: 28,
    tintColor: colors.primary,
  },
});
```

---

## iOS Animationen

```typescript
// iOS-konforme Animation Curves
export const animations = {
  // Standard iOS Curve (ease-in-out)
  standard: {
    duration: 350,
    easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  },

  // iOS Spring Animation
  spring: {
    damping: 0.8,
    stiffness: 300,
    mass: 0.8,
    // Entspricht UIKit's default spring
  },

  // Quick Response (Button Press)
  quick: {
    duration: 100,
    easing: "ease-out",
  },

  // Page Transition
  pageTransition: {
    duration: 350,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },

  // Modal Presentation
  modalPresentation: {
    duration: 500,
    easing: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
};

// iOS Haptic Feedback Types
export const haptics = {
  // Selection (leichtes Tick)
  selection: "selection",

  // Impact Light (Button Tap)
  impactLight: "impactLight",

  // Impact Medium (Swipe Complete)
  impactMedium: "impactMedium",

  // Impact Heavy (Voice Button)
  impactHeavy: "impactHeavy",

  // Notification Success
  notificationSuccess: "notificationSuccess",

  // Notification Warning
  notificationWarning: "notificationWarning",

  // Notification Error
  notificationError: "notificationError",
};
```

---

## iOS Navigation Patterns

### Navigation Bar

```typescript
// Verwende expo-router mit nativer Navigation
export const navigationConfig = {
  // Large Title (scrollable)
  largeTitle: {
    headerLargeTitle: true,
    headerLargeTitleStyle: {
      fontSize: 34,
      fontWeight: "700",
    },
    headerTransparent: false,
    headerBlurEffect: "regular",
  },

  // Standard Title
  standardTitle: {
    headerLargeTitle: false,
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: "600",
    },
  },

  // Transparent (für custom headers)
  transparent: {
    headerTransparent: true,
    headerTitle: "",
  },
};
```

### Back Button

```typescript
// iOS Back Button Style
// - Chevron (<) + "Zurück" oder vorheriger Titel
// - Tint: Primary Color
// - Touch Target: min 44pt

export const backButton = {
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  tintColor: colors.primary,
};
```

---

## iOS-konforme Swipeable Cards

```typescript
export const swipeCardConfig = {
  // Swipe Threshold (iOS-typisch)
  swipeThreshold: 100,

  // Rotation Range
  maxRotation: 12, // Subtiler als Tinder (die haben ~15°)

  // Snap Back Animation
  snapBack: {
    damping: 15,
    stiffness: 200,
    mass: 0.8,
  },

  // Fly Out Animation
  flyOut: {
    duration: 300,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },

  // Stack Offset
  stackOffset: 8, // Vertikaler Offset zwischen Karten
  stackScale: 0.95, // Scale der hinteren Karten

  // Feedback Overlays
  overlay: {
    // Subtiler als üblich - iOS bevorzugt Zurückhaltung
    maxOpacity: 0.15,
    borderRadius: 16,
  },
};
```

---

## iOS Accessibility

```typescript
// Minimum Touch Targets
export const accessibility = {
  minTouchTarget: 44,

  // Dynamic Type Support
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.5,

  // Reduce Motion Support
  // Prüfe: AccessibilityInfo.isReduceMotionEnabled()
  reduceMotionAlternatives: {
    // Statt Animationen: Instant transitions
    // Statt Parallax: Static
    // Statt Bounce: Linear
  },

  // VoiceOver Labels
  accessibilityLabels: {
    voiceButton: "Aufnahme starten. Zum Sprechen gedrückt halten.",
    swipeCard: (index: number, total: number) =>
      `Karte ${index} von ${total}. Nach rechts wischen für hilfreich, nach links für nicht hilfreich.`,
    categoryTag: (category: string) => `Kategorie: ${category}`,
    priorityBadge: (priority: string) => `Priorität: ${priority}`,
  },
};
```

---

## ADHD-spezifische iOS Anpassungen

### Cognitive Load Reduction (mit iOS Patterns)

```typescript
export const adhdOptimizations = {
  // Eine Hauptaktion pro Screen
  // → iOS: Primary Button am unteren Rand
  // Klare Hierarchie
  // → iOS: Semantic Colors (label.primary, secondary, tertiary)
  // Kein Information Overload
  // → iOS: Grouped Inset Style, klare Trennung
  // Immediate Feedback
  // → iOS: Haptics bei jeder Interaktion
  // Forgiving Interactions
  // → iOS: Confirmation Sheets, Undo Support
};
```

### Focus States

```typescript
export const focusStates = {
  // Single Task Focus
  // Nur eine Karte aktiv, Rest gedimmt
  activeCard: {
    opacity: 1,
    scale: 1,
  },
  inactiveCard: {
    opacity: 0.5,
    scale: 0.95,
  },

  // Reading Focus
  // Reduziere visuelle Ablenkung beim Lesen
  readingMode: {
    reducedMotion: true,
    dimmedUI: true,
  },
};
```

---

## Component Checklist (Apple HIG)

Jede Komponente muss erfüllen:

- [ ] **44pt minimum touch target**
- [ ] **Haptic feedback** bei Interaktion
- [ ] **Pressed state** (opacity 0.7 oder scale 0.96)
- [ ] **SF Symbols** oder systemkonforme Icons
- [ ] **Dynamic Type** Support
- [ ] **VoiceOver** Labels
- [ ] **Reduce Motion** Alternative
- [ ] **Consistent spacing** (8pt grid)
- [ ] **System Colors** wo möglich
- [ ] **Native Navigation** (expo-router)
