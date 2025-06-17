// theme.config.ts
/**
 * UI69 Theme Configuration
 * 
 * Customize your app's colors and design tokens here.
 * Just like shadcn/ui, you can easily change any value to match your brand.
 * 
 * 🎨 To change your theme:
 * 1. Modify the colors below
 * 2. Save the file
 * 3. All components will automatically use your new colors!
 */

export interface LightTheme {
    // Base colors
    background: string;        // Main app background
    foreground: string;        // Primary text color

    // Component surfaces
    card: string;              // Card backgrounds
    cardForeground: string;    // Text on cards
    popover: string;           // Dropdown/modal backgrounds
    popoverForeground: string; // Text on dropdowns/modals

    // Brand colors
    primary: string;           // Primary buttons, links, focus states
    primaryForeground: string; // Text on primary colored backgrounds
    secondary: string;         // Secondary buttons and backgrounds
    secondaryForeground: string; // Text on secondary backgrounds

    // Utility colors
    muted: string;             // Subtle backgrounds
    mutedForeground: string;   // Subtle text (placeholders, descriptions)
    accent: string;            // Accent backgrounds (highlights)
    accentForeground: string;  // Text on accent backgrounds
    destructive: string;       // Error/danger buttons and alerts
    destructiveForeground: string; // Text on destructive backgrounds

    // Interactive elements
    border: string;            // Borders, dividers
    input: string;             // Input field backgrounds
    ring: string;              // Focus rings, selections
}

/**
 * 🎨 CUSTOMIZE YOUR THEME HERE
 * 
 * These are the default colors - change them to match your brand!
 * Colors should be in hex format (#000000) for React Native compatibility.
 */
export const lightTheme: LightTheme = {
    // 🔹 Base colors - The foundation of your app
    background: '#ffffff',        // Pure white background
    foreground: '#0a0a0a',        // Almost black text

    // 🔹 Surface colors - For cards, modals, etc.
    card: '#ffffff',              // White card backgrounds
    cardForeground: '#0a0a0a',    // Dark text on cards
    popover: '#ffffff',           // White popover backgrounds
    popoverForeground: '#0a0a0a', // Dark text on popovers

    // 🔹 Brand colors - Make these match your brand!
    primary: '#171717',           // 👈 CHANGE THIS to your brand color!
    primaryForeground: '#fafafa', // Light text on dark primary
    secondary: '#f5f5f5',         // Light gray for secondary elements
    secondaryForeground: '#171717', // Dark text on light secondary

    // 🔹 Utility colors - For subtle elements
    muted: '#f5f5f5',             // Very light gray
    mutedForeground: '#737373',   // Medium gray text
    accent: '#f5f5f5',            // Same as secondary for consistency
    accentForeground: '#171717',  // Dark text on accent
    destructive: '#ef4444',       // Red for errors/delete actions
    destructiveForeground: '#fafafa', // Light text on red

    // 🔹 Interactive elements
    border: '#e5e5e5',            // Light gray borders
    input: '#e5e5e5',             // Light gray input backgrounds
    ring: '#171717',              // Focus ring (usually matches primary)
};

/**
 * 🔧 Design Tokens
 * 
 * These control the shape and spacing of your components
 */
export const radius = {
    sm: 4,   // Small corners (tight, minimal)
    md: 6,   // Medium corners (balanced - most common)
    lg: 8,   // Large corners (soft, friendly)
    xl: 12,  // Extra large corners (very rounded)
};

/**
 * 📦 Export the current theme
 * 
 * This is what your components will use.
 * You can also create multiple themes and switch between them.
 */
export const currentTheme = lightTheme;

/**
 * 🎨 QUICK THEME EXAMPLES
 *
 * Copy and paste one of these to quickly change your theme:
 */

// 🔵 Blue Theme
// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   primary: '#3b82f6',           // Blue primary
//   ring: '#3b82f6',              // Blue focus ring
// };

// 🟢 Green Theme  
// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   primary: '#22c55e',           // Green primary
//   ring: '#22c55e',              // Green focus ring
// };

// 🟣 Purple Theme
// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   primary: '#8b5cf6',           // Purple primary
//   ring: '#8b5cf6',              // Purple focus ring
// };

// 🟠 Orange Theme
// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   primary: '#f97316',           // Orange primary
//   ring: '#f97316',              // Orange focus ring
// };

// 🔴 Red Theme
// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   primary: '#ef4444',           // Red primary
//   ring: '#ef4444',              // Red focus ring
// };

/**
 * 🎨 CUSTOM BRAND EXAMPLE
 *
 * Here's how to create a custom theme for your brand:
 */

// export const currentTheme: LightTheme = {
//   ...lightTheme,
//   
//   // Your brand colors
//   primary: '#your-brand-color',     // 👈 Put your brand color here
//   ring: '#your-brand-color',        // Usually same as primary
//   
//   // Optional: customize other colors
//   secondary: '#your-secondary-color',
//   accent: '#your-accent-color',
//   
//   // Optional: customize surface colors
//   background: '#fafafa',            // Slightly off-white
//   card: '#ffffff',                  // Pure white cards
// };

/**
 * 💡 PRO TIPS:
 * 
 * 1. Start by changing just the `primary` color - this will transform your app!
 * 2. Make sure `primaryForeground` has good contrast with `primary`
 * 3. Use online tools like coolors.co to generate color palettes
 * 4. Test your colors with both light and dark text
 * 5. Keep `border` and `input` subtle for a clean look
 */