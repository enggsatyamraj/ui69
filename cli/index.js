#!/usr/bin/env node

/**
 * ui69 CLI
 * 
 * A CLI tool for adding unstyled, accessible React Native UI components to your project.
 * Inspired by shadcn/ui for web.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Define component directory path - this is critical for finding component files
// We need to use __dirname to get the actual location of this script
const COMPONENT_DIR = path.join(__dirname, '../components');

// Check if we need to install inquirer
try {
    require.resolve('inquirer');
} catch (error) {
    console.log('Installing dependencies...');
    execSync('npm install --no-save inquirer@^8.0.0');
    console.log('Dependencies installed!');
}

// Import inquirer for interactive prompts
const inquirer = require('inquirer');

// Colors for terminal output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    bold: "\x1b[1m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m"
};

// Logger
const log = {
    success: (text) => console.log(`${colors.green}✓ ${text}${colors.reset}`),
    error: (text) => console.log(`${colors.red}✖ ${text}${colors.reset}`),
    info: (text) => console.log(`${colors.blue}ℹ ${text}${colors.reset}`),
    warning: (text) => console.log(`${colors.yellow}⚠ ${text}${colors.reset}`),
    title: (text) => console.log(`\n${colors.bold}${text}${colors.reset}\n`),
    code: (text) => console.log(`${colors.cyan}${text}${colors.reset}`),
    prompt: (text) => console.log(`${colors.magenta}? ${text}${colors.reset}`),
    muted: (text) => console.log(`${colors.gray}${text}${colors.reset}`)
};

// Theme configuration template
const THEME_CONFIG_TEMPLATE = `// theme.config.ts
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
 * 1. Start by changing just the \`primary\` color - this will transform your app!
 * 2. Make sure \`primaryForeground\` has good contrast with \`primary\`
 * 3. Use online tools like coolors.co to generate color palettes
 * 4. Test your colors with both light and dark text
 * 5. Keep \`border\` and \`input\` subtle for a clean look
 */
`;

// Ensure component directory exists
function ensureComponentsExist() {
    if (!fs.existsSync(COMPONENT_DIR)) {
        log.error(`Components directory not found: ${COMPONENT_DIR}`);
        log.info(`Make sure the package is installed correctly and the components directory exists.`);
        log.info(`Current directory: ${__dirname}`);
        process.exit(1);
    }
}

// Initialize ui69 in the project
async function initializeProject() {
    showSplash();
    log.title('Initializing ui69 in your project...');

    const currentDir = process.cwd();
    const themeConfigPath = path.join(currentDir, 'theme.config.ts');

    // Check if theme.config.ts already exists
    if (fs.existsSync(themeConfigPath)) {
        log.warning('theme.config.ts already exists in your project.');

        const response = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: 'Do you want to overwrite the existing theme.config.ts?',
                default: false
            }
        ]);

        if (!response.overwrite) {
            log.info('Initialization cancelled. Your existing theme.config.ts was not modified.');
            return;
        }
    }

    try {
        // Create theme.config.ts
        await fs.writeFile(themeConfigPath, THEME_CONFIG_TEMPLATE);
        log.success('Created theme.config.ts in your project root');

        // Check if it's a TypeScript project and suggest tsconfig update
        const tsconfigPath = path.join(currentDir, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
            log.info('TypeScript project detected!');
        }

        // Success message
        log.title('🎉 ui69 initialized successfully!');

        console.log('Next steps:');
        log.code('  1. Customize your theme in theme.config.ts');
        log.code('  2. Add components: npx ui69 add button');
        log.code('  3. Import and use: import { Button } from "./components/ui/button"');

        console.log('\nQuick start:');
        log.code('  npx ui69 add button');
        log.code('  npx ui69 add input-otp');
        log.code('  npx ui69 add drawer');

    } catch (error) {
        log.error('Failed to create theme.config.ts');
        console.error(error);
        process.exit(1);
    }
}

// Available components configuration
function getComponentsConfig() {
    // Check component directory exists
    ensureComponentsExist();

    return {
        alert: {
            name: "Alert",
            description: "Alert component with multiple variants, icons, titles, descriptions, and action support",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/alert.tsx'),
                    dest: 'components/ui/alert.tsx',
                }
            ]
        },
        button: {
            name: "Button",
            description: "Button component with multiple variants and sizes",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/button.tsx'),
                    dest: 'components/ui/button.tsx',
                }
            ]
        },
        checkbox: {
            name: "Checkbox",
            description: "Checkbox input with multiple variants, group support, indeterminate state, and professional SVG icons",
            dependencies: ['react-native-svg'],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/checkbox.tsx'),
                    dest: 'components/ui/checkbox.tsx',
                }
            ]
        },
        radio: {
            name: "Radio",
            description: "Radio button component with group management, multiple variants, and single-selection logic",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/radio.tsx'),
                    dest: 'components/ui/radio.tsx',
                }
            ]
        },
        switch: {
            name: "Switch",
            description: "Toggle switch component with smooth animations, multiple variants, and group support",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/switch.tsx'),
                    dest: 'components/ui/switch.tsx',
                }
            ]
        },
        skeleton: {
            name: "Skeleton",
            description: "Skeleton loading component with shimmer and wave animations",
            dependencies: ['react-native-reanimated', 'expo-linear-gradient'],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/skeleton.tsx'),
                    dest: 'components/ui/skeleton.tsx',
                }
            ]
        },
        seperator: {
            name: "Seperator",
            description: "Seperator component for dividing content",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/seperator.tsx'),
                    dest: 'components/ui/seperator.tsx',
                }
            ]
        },
        card: {
            name: "Card",
            description: "Container component with default and warning variants, plus header, content and footer sections",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/card.tsx'),
                    dest: 'components/ui/card.tsx',
                }
            ]
        },
        badge: {
            name: "Badge",
            description: "Small status indicator with multiple variants and dot style option",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/badge.tsx'),
                    dest: 'components/ui/badge.tsx',
                }
            ]
        },
        avatar: {
            name: "Avatar",
            description: "User profile image component with fallback, status indicators, and grouping support",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/avatar.tsx'),
                    dest: 'components/ui/avatar.tsx',
                }
            ]
        },
        accordion: {
            name: "Accordion",
            description: "Collapsible content sections with customizable styling and animations",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/accordion.tsx'),
                    dest: 'components/ui/accordion.tsx',
                }
            ]
        },
        'input-otp': {
            name: "InputOTP",
            description: "One-time password input component with support for different input types, patterns, and custom dimensions",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/input-otp.tsx'),
                    dest: 'components/ui/input-otp.tsx',
                }
            ]
        },
        input: {
            name: "Input",
            description: "Text input component with multiple variants, validation, and icon support",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/input.tsx'),
                    dest: 'components/ui/input.tsx',
                }
            ]
        },
        toast: {
            name: "Toast",
            description: "Toast notifications with animations, gestures, and multiple variants",
            dependencies: ['react-native-reanimated', 'react-native-gesture-handler', 'react-native-safe-area-context'],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/toast.tsx'),
                    dest: 'components/ui/toast.tsx',
                }
            ]
        },
        select: {
            name: "Select",
            description: "Select dropdown component with smooth animations and positioning",
            dependencies: ['react-native-safe-area-context', 'react-native-svg'],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/select.tsx'),
                    dest: 'components/ui/select.tsx',
                }
            ]
        },
        drawer: {
            name: "Drawer",
            description: "Customizable drawer/sheet component with gesture support, smooth animations, and custom dimensions",
            dependencies: ['react-native-safe-area-context', 'react-native-gesture-handler'],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/drawer.tsx'),
                    dest: 'components/ui/drawer.tsx',
                }
            ]
        },
    };
}

// Interactive component selector with space selection
async function selectComponents() {
    // Get components configuration
    const components = getComponentsConfig();

    // Show splash screen
    showSplash();

    log.title('Which components would you like to add?');

    // Convert components to choices format for inquirer
    const choices = Object.entries(components).map(([key, value]) => ({
        name: `${value.name}`,
        value: key,
        checked: false
    }));

    try {
        const response = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedComponents',
                message: 'Select components using space, then press Enter to confirm',
                choices: choices,
                validate: (answer) => {
                    if (answer.length < 1) {
                        return 'You must choose at least one component.';
                    }
                    return true;
                }
            }
        ]);

        return response.selectedComponents;
    } catch (error) {
        log.error('Error selecting components:');
        console.error(error);
        process.exit(1);
    }
}

// Function to install a component
async function installComponent(component) {
    // Get components configuration
    const components = getComponentsConfig();

    // Check if the component exists
    if (!components[component]) {
        log.error(`Component '${component}' not found.`);
        console.log(`\nAvailable components:\n${Object.keys(components).map(c => `  - ${c}`).join('\n')}`);
        process.exit(1);
    }

    const config = components[component];

    log.title(`Installing ${config.name} component`);

    // Check if theme.config.ts exists
    const themeConfigPath = path.join(process.cwd(), 'theme.config.ts');
    if (!fs.existsSync(themeConfigPath)) {
        log.warning('theme.config.ts not found in your project.');
        log.info('UI69 components require theme.config.ts to work properly.');

        const response = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'initFirst',
                message: 'Would you like to run "npx ui69 init" first to set up the theme?',
                default: true
            }
        ]);

        if (response.initFirst) {
            await initializeProject();
            console.log(''); // Add some spacing
        } else {
            log.warning('Proceeding without theme.config.ts. Components may not work correctly.');
        }
    }

    // Create the necessary directories and copy the files
    for (const file of config.files) {
        const srcPath = file.src;
        const destPath = path.join(process.cwd(), file.dest);

        // Check if source file exists
        if (!fs.existsSync(srcPath)) {
            log.error(`Source file not found: ${srcPath}`);
            log.info(`Expected at: ${srcPath}`);
            log.info(`Current directory: ${__dirname}`);
            process.exit(1);
        }

        // Create directory if it doesn't exist
        try {
            await fs.ensureDir(path.dirname(destPath));
            log.success(`Created directory for ${path.dirname(file.dest)}`);
        } catch (error) {
            log.error(`Failed to create directory for ${file.dest}`);
            console.error(error);
            process.exit(1);
        }

        // Copy the file
        try {
            await fs.copy(srcPath, destPath);
            log.success(`Created ${colors.bold}${file.dest}`);
        } catch (error) {
            log.error(`Failed to copy file to ${file.dest}`);
            console.error(error);
            process.exit(1);
        }
    }

    // Show dependencies if any
    if (config.dependencies && config.dependencies.length > 0) {
        log.info(`\n${config.name} requires the following dependencies:`);
        config.dependencies.forEach(dep => {
            log.code(`  ${dep}`);
        });

        console.log('\nInstall them with:');
        if (config.dependencies.includes('expo-linear-gradient')) {
            log.code(`  npx expo install ${config.dependencies.join(' ')}`);
        } else {
            log.code(`  npm install ${config.dependencies.join(' ')}`);
        }
    }

    // Installation complete
    log.success(`\n${config.name} installed successfully!`);
}

// List all available components
function listComponents() {
    // Get components configuration
    const components = getComponentsConfig();

    showSplash();
    log.title('Available Components');

    Object.entries(components).forEach(([name, config]) => {
        console.log(`${colors.bold}${name}${colors.reset}`);
        console.log(`  ${config.description}`);
        if (config.dependencies && config.dependencies.length > 0) {
            console.log(`  ${colors.gray}Dependencies: ${config.dependencies.join(', ')}${colors.reset}`);
        }
        console.log('');
    });

    console.log('To add a component:');
    log.code('  npx ui69 add <component>');
    console.log('\nOr select from the interactive menu:');
    log.code('  npx ui69 add');
}

// Show a splash screen
function showSplash() {
    console.log(`
${colors.bold}${colors.magenta}╭───────────────────────────────────────────────╮${colors.reset}
${colors.bold}${colors.magenta}│                                               │${colors.reset}
${colors.bold}${colors.magenta}│   ${colors.reset}${colors.bold}ui69${colors.magenta}                                    │${colors.reset}
${colors.bold}${colors.magenta}│   ${colors.reset}${colors.bold}UI components for React Native${colors.magenta}              │${colors.reset}
${colors.bold}${colors.magenta}╰───────────────────────────────────────────────╯${colors.reset}
  `);
}

// Main CLI function
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    // Handle different commands
    switch (command) {
        case 'init':
            await initializeProject();
            break;

        case 'add':
            const componentName = args[1];
            if (!componentName) {
                // If no component specified, show interactive selector
                const selectedComponents = await selectComponents();

                // Install each selected component
                for (const component of selectedComponents) {
                    await installComponent(component);
                }
            } else {
                await installComponent(componentName);
            }
            break;

        case 'list':
            listComponents();
            break;

        case '--version':
        case '-v':
            try {
                const packageJson = require('../package.json');
                console.log(packageJson.version);
            } catch (error) {
                log.error('Unable to read package.json');
                console.error(error);
                process.exit(1);
            }
            break;

        case '--help':
        case '-h':
        default:
            showSplash();
            log.title('ui69 CLI');
            console.log('A collection of unstyled, accessible UI components for React Native');
            console.log('\nCommands:');
            console.log('  init               Initialize ui69 in your project (creates theme.config.ts)');
            console.log('  add [component]    Add a component to your project (interactive if no component specified)');
            console.log('  list               List all available components');
            console.log('  --help, -h         Show this help message');
            console.log('  --version, -v      Show the version number');
            console.log('\nExamples:');
            log.code('  npx ui69 init');
            log.code('  npx ui69 add button');
            log.code('  npx ui69 add input-otp');
            log.code('  npx ui69 add drawer');
            log.code('  npx ui69 add     # Interactive component selection');
            log.code('  npx ui69 list');
            break;
    }
}

// Run the CLI
main().catch(error => {
    log.error('An error occurred:');
    console.error(error);
    process.exit(1);
});