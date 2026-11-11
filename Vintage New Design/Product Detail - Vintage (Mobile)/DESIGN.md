---
name: Eclectic Modernist
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#564147'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#897177'
  outline-variant: '#dcbfc6'
  surface-tint: '#aa2c64'
  primary: '#a72961'
  on-primary: '#ffffff'
  primary-container: '#c7437a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb0c9'
  secondary: '#7a5900'
  on-secondary: '#ffffff'
  secondary-container: '#fdbf2e'
  on-secondary-container: '#6d4f00'
  tertiary: '#236756'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f806e'
  on-tertiary-container: '#f4fff9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e3'
  primary-fixed-dim: '#ffb0c9'
  on-primary-fixed: '#3e001e'
  on-primary-fixed-variant: '#8a0e4c'
  secondary-fixed: '#ffdea2'
  secondary-fixed-dim: '#fabd2b'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5c4200'
  tertiary-fixed: '#adf0db'
  tertiary-fixed-dim: '#91d4bf'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005141'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system captures a "Neo-Vintage" aesthetic—blending the nostalgic charm of a 1970s craft studio with the clean, high-end execution of modern SaaS. The brand personality is creative, artisanal, and premium. It avoids "shabby chic" cliches in favor of a sophisticated, editorial look that feels curated and intentional.

The visual style is a hybrid of **Modernism** and **Tactile Playfulness**. It utilizes expansive white space to let the vibrant palette breathe, while incorporating large radius curves and organic shapes to maintain a welcoming, human touch. The goal is to evoke a sense of bespoke quality and creative freedom.

## Colors

The palette is extracted directly from the soul of the "Vintage" brand, refined for digital legibility. 

- **Raspberry (Primary):** Used for primary actions and key brand moments. It carries the "craft" energy.
- **Mustard (Secondary):** An accent color for highlights, warnings (in a softer tone), and decorative elements.
- **Mint (Tertiary):** Used for success states and secondary visual interest to balance the warmth of the pinks.
- **Creamy Pink (Quaternary):** Primarily used for large-surface backgrounds, containers, and subtle accents.
- **Ink (Neutral):** A deep, warm charcoal instead of pure black, providing a softer but authoritative contrast for typography.
- **Paper (Background):** An off-white, slightly warm base that prevents the high-contrast fatigue of pure white.

## Typography

The typography system relies on the tension between the classic, literary feel of **Libre Caslon Text** and the geometric, friendly clarity of **Plus Jakarta Sans**. 

- **Headlines:** Should always use Libre Caslon Text. For a premium feel, use "Display" sizes for landing pages with tight letter-spacing.
- **Body:** Plus Jakarta Sans provides high readability for instructional content and user data.
- **Captions & Small Labels:** Use uppercase Plus Jakarta Sans with increased letter spacing to create an "architectural" feel within the playful layout.

## Layout & Spacing

The layout follows a **Fluid Grid** model with generous outer margins to simulate the feeling of a high-end printed magazine.

- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile. 
- **Rhythm:** Spacing is strictly based on an 8px scale. Use "Stack" units for vertical rhythm between components.
- **Safe Areas:** Cards and containers should use a minimum of 32px internal padding to maintain the "premium" airy feel.
- **Reflow:** On mobile, complex side-by-side forms should stack vertically, but maintain the large-radius container styling to preserve brand identity.

## Elevation & Depth

This design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Soft Ambient Shadows**.

- **Surface Tiers:** Use the "Paper" background (#FFFBFA) as the base. Elevated cards use a pure white surface.
- **Shadows:** Shadows should be extremely diffused (e.g., `box-shadow: 0 10px 30px rgba(45, 41, 38, 0.05)`). They should feel like a soft glow rather than a harsh drop.
- **Interactive States:** On hover, elements should lift slightly (move -2px) and the shadow should become slightly more pronounced but stay soft.
- **Depth Tints:** Use subtle 1px borders in the "Quaternary" creamy pink color to define boundaries without adding visual weight.

## Shapes

The shape language is defined by "The Oversized Curve." 

- **Standard Elements:** Buttons and input fields use a `0.75rem` (12px) radius.
- **Containers:** Cards, modals, and image uploaders use the `rounded-xl` setting (24px) to create a soft, friendly frame.
- **Iconography:** Use "Lineal" icons with rounded caps and joins to match the curvature of the UI.

## Components

### Buttons & Actions
- **Primary:** Raspberry background with White text. Bold, 24px padding on sides.
- **Secondary:** Mustard background for high-visibility secondary actions.
- **Ghost:** Mint colored text with a subtle Creamy Pink background tint on hover.

### Input Fields & Uploaders
- **Inputs:** Minimalist with a light 1px border. On focus, the border thickens and changes to Mint. Labels are always placed above the field in `label-md` style.
- **Image Uploaders:** Large, dashed containers with a `rounded-xl` radius. Use a Mustard "plus" icon as the focal point.

### Step-by-Step Progress
- **The Progress Bar:** A thick, Creamy Pink track with a Raspberry "filled" state. 
- **Indicators:** Use large circles with Libre Caslon numbers inside. Completed steps show a Mint checkmark.

### Cards & Chips
- **Cards:** Always use the 24px corner radius and the soft ambient shadow.
- **Chips:** Fully pill-shaped (radius 100px). Used for categories or tags. Use the Tertiary Mint color at 10% opacity for the background and 100% opacity for the text.