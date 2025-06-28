#!/usr/bin/env node

/**
 * ui69 CLI with JavaScript/TypeScript auto-detection
 * 
 * Automatically detects if the project uses TypeScript or JavaScript
 * and installs the appropriate version of components.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Define component directory path
const COMPONENT_DIR = path.join(__dirname, '../components');

// Check if we need to install inquirer
try {
    require.resolve('inquirer');
} catch (error) {
    console.log('Installing dependencies...');
    execSync('npm install --no-save inquirer@^8.0.0');
    console.log('Dependencies installed!');
}

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

// Detect project type (TypeScript or JavaScript)
function detectProjectType() {
    const currentDir = process.cwd();

    // Check for TypeScript indicators
    const hasTypescript =
        fs.existsSync(path.join(currentDir, 'tsconfig.json')) ||
        fs.existsSync(path.join(currentDir, 'tsconfig.app.json')) ||
        fs.existsSync(path.join(currentDir, 'typescript.config.js'));

    // Check package.json for TypeScript dependencies
    let hasTypescriptDeps = false;
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const packageJson = require(packageJsonPath);
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            hasTypescriptDeps =
                'typescript' in allDeps ||
                '@types/react' in allDeps ||
                '@types/react-native' in allDeps;
        } catch (error) {
            // Ignore package.json parsing errors
        }
    }

    return {
        isTypeScript: hasTypescript || hasTypescriptDeps,
        configExtension: hasTypescript || hasTypescriptDeps ? 'ts' : 'js',
        componentExtension: hasTypescript || hasTypescriptDeps ? 'tsx' : 'jsx'
    };
}

// Convert TypeScript component to JavaScript
function convertTsxToJsx(tsxContent) {
    let jsxContent = tsxContent;

    // Remove TypeScript-specific imports and types
    jsxContent = jsxContent.replace(/import.*from ['"].*theme\.config['"];?/g,
        "import { currentTheme, radius } from '../../theme.config';");

    // Remove interface definitions
    jsxContent = jsxContent.replace(/export interface \w+\s*{[^}]*}/gs, '');

    // Remove type annotations from function parameters
    jsxContent = jsxContent.replace(/(\w+)\s*:\s*[^,)=]+/g, '$1');

    // Remove generic type parameters
    jsxContent = jsxContent.replace(/<[^>]+>/g, '');

    // Remove type assertions
    jsxContent = jsxContent.replace(/as \w+/g, '');

    // Remove React.FC and forwardRef types
    jsxContent = jsxContent.replace(/:\s*React\.FC.*?>/g, '');
    jsxContent = jsxContent.replace(/forwardRef<[^>]+>/g, 'forwardRef');

    // Remove return type annotations
    jsxContent = jsxContent.replace(/\)\s*:\s*[^{]+\s*=>/g, ') =>');
    jsxContent = jsxContent.replace(/\)\s*:\s*[^{]+\s*{/g, ') {');

    // Clean up extra whitespace and empty lines
    jsxContent = jsxContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Remove TypeScript-specific comments
    jsxContent = jsxContent.replace(/\/\/ @ts-ignore\n/g, '');

    return jsxContent;
}

// Theme configuration templates
const getThemeConfigTemplate = (isTypeScript) => {
    if (isTypeScript) {
        return `// theme.config.ts
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
    } else {
        return `// theme.config.js
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

/**
 * 🎨 CUSTOMIZE YOUR THEME HERE
 * 
 * These are the default colors - change them to match your brand!
 * Colors should be in hex format (#000000) for React Native compatibility.
 */
export const lightTheme = {
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
// export const currentTheme = {
//   ...lightTheme,
//   primary: '#3b82f6',           // Blue primary
//   ring: '#3b82f6',              // Blue focus ring
// };

// 🟢 Green Theme  
// export const currentTheme = {
//   ...lightTheme,
//   primary: '#22c55e',           // Green primary
//   ring: '#22c55e',              // Green focus ring
// };

// 🟣 Purple Theme
// export const currentTheme = {
//   ...lightTheme,
//   primary: '#8b5cf6',           // Purple primary
//   ring: '#8b5cf6',              // Purple focus ring
// };

/**
 * 💡 PRO TIPS:
 * 
 * 1. Start by changing just the 'primary' color - this will transform your app!
 * 2. Make sure 'primaryForeground' has good contrast with 'primary'
 * 3. Use online tools like coolors.co to generate color palettes
 * 4. Test your colors with both light and dark text
 * 5. Keep 'border' and 'input' subtle for a clean look
 */
`;
    }
};

// Check if theme config exists
function checkThemeConfigExists() {
    const currentDir = process.cwd();
    const themeConfigPaths = [
        path.join(currentDir, 'theme.config.js'),
        path.join(currentDir, 'theme.config.ts')
    ];

    return themeConfigPaths.some(configPath => fs.existsSync(configPath));
}

// Show error message when theme config is missing
function showThemeConfigMissing() {
    showSplash();
    log.error('ui69 is not initialized in this project.');
    console.log('');
    log.info('To get started, run the init command:');
    log.code('  npx ui69@latest init');
    console.log('');
    log.muted('This will create a theme.config file in your project root.');
    console.log('');
}

// Initialize ui69 in the project
async function initializeProject() {
    showSplash();
    log.title('Initializing ui69 in your project...');

    const projectType = detectProjectType();
    const currentDir = process.cwd();
    const themeConfigPath = path.join(currentDir, `theme.config.${projectType.configExtension}`);

    log.info(`Detected ${projectType.isTypeScript ? 'TypeScript' : 'JavaScript'} project`);

    // Check if theme config already exists
    if (fs.existsSync(themeConfigPath)) {
        log.warning(`theme.config.${projectType.configExtension} already exists in your project.`);

        const response = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `Do you want to overwrite the existing theme.config.${projectType.configExtension}?`,
                default: false
            }
        ]);

        if (!response.overwrite) {
            log.info(`Initialization cancelled. Your existing theme.config.${projectType.configExtension} was not modified.`);
            return;
        }
    }

    try {
        // Create theme config file
        const template = getThemeConfigTemplate(projectType.isTypeScript);
        await fs.writeFile(themeConfigPath, template);
        log.success(`Created theme.config.${projectType.configExtension} in your project root`);

        // Success message
        log.title('🎉 ui69 initialized successfully!');

        console.log('Next steps:');
        log.code(`  1. Customize your theme in theme.config.${projectType.configExtension}`);
        log.code('  2. Add components: npx ui69@latest add button');
        log.code('  3. Import and use: import { Button } from "./components/ui/button"');

        console.log('\\nQuick start:');
        log.code('  npx ui69@latest add button');
        log.code('  npx ui69@latest add input');
        log.code('  npx ui69@latest add toast');

    } catch (error) {
        log.error(`Failed to create theme.config.${projectType.configExtension}`);
        console.error(error);
        process.exit(1);
    }
}

// Function to install a component
async function installComponent(component) {
    // Check if theme config exists before allowing component installation
    if (!checkThemeConfigExists()) {
        showThemeConfigMissing();
        process.exit(1);
    }

    const projectType = detectProjectType();
    const components = getComponentsConfig();

    // Check if the component exists
    if (!components[component]) {
        log.error(`Component '${component}' not found.`);
        console.log(`\\nAvailable components:\\n${Object.keys(components).map(c => `  - ${c}`).join('\\n')}`);
        process.exit(1);
    }

    const config = components[component];

    log.title(`Installing ${config.name} component`);
    log.info(`Installing as ${projectType.componentExtension} (${projectType.isTypeScript ? 'TypeScript' : 'JavaScript'})`);

    // Create the necessary directories and copy the files
    for (const file of config.files) {
        const srcPath = file.src;
        const destPath = path.join(process.cwd(), file.dest.replace('.tsx', `.${projectType.componentExtension}`));

        // Check if source file exists
        if (!fs.existsSync(srcPath)) {
            log.error(`Source file not found: ${srcPath}`);
            log.info(`Expected at: ${srcPath}`);
            process.exit(1);
        }

        // Create directory if it doesn't exist
        try {
            await fs.ensureDir(path.dirname(destPath));
        } catch (error) {
            log.error(`Failed to create directory for ${file.dest}`);
            console.error(error);
            process.exit(1);
        }

        // Read and process the file
        try {
            let fileContent = await fs.readFile(srcPath, 'utf8');

            // Convert TypeScript to JavaScript if needed
            if (!projectType.isTypeScript && srcPath.endsWith('.tsx')) {
                fileContent = convertTsxToJsx(fileContent);
            }

            await fs.writeFile(destPath, fileContent);
            log.success(`Created ${colors.bold}${file.dest.replace('.tsx', `.${projectType.componentExtension}`)}`);
        } catch (error) {
            log.error(`Failed to copy file to ${file.dest}`);
            console.error(error);
            process.exit(1);
        }
    }

    // Show dependencies if any
    if (config.dependencies && config.dependencies.length > 0) {
        log.info(`\\n${config.name} requires the following dependencies:`);
        config.dependencies.forEach(dep => {
            log.code(`  ${dep}`);
        });

        console.log('\\nInstall them with:');
        if (config.dependencies.includes('expo-linear-gradient')) {
            log.code(`  npx expo install ${config.dependencies.join(' ')}`);
        } else {
            log.code(`  npm install ${config.dependencies.join(' ')}`);
        }
    }

    // Installation complete
    log.success(`\\n${config.name} installed successfully!`);
}

// Available components configuration
function getComponentsConfig() {
    return {
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
        card: {
            name: "Card",
            description: "Container component with multiple variants and sections",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/card.tsx'),
                    dest: 'components/ui/card.tsx',
                }
            ]
        },
        // Add more components as needed...
    };
}

// Show splash screen
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

    switch (command) {
        case 'init':
            await initializeProject();
            break;

        case 'add':
            const componentName = args[1];
            if (!componentName) {
                // Interactive component selection would go here
                log.error('Please specify a component name');
                log.code('  npx ui69@latest add button');
            } else {
                await installComponent(componentName);
            }
            break;

        case '--version':
        case '-v':
            try {
                const packageJson = require('../package.json');
                console.log(packageJson.version);
            } catch (error) {
                log.error('Unable to read package.json');
                process.exit(1);
            }
            break;

        case '--help':
        case '-h':
        default:
            showSplash();
            log.title('ui69 CLI');
            console.log('A collection of unstyled, accessible UI components for React Native');
            console.log('\\nCommands:');
            console.log('  init               Initialize ui69 in your project');
            console.log('  add [component]    Add a component to your project');
            console.log('  --help, -h         Show this help message');
            console.log('  --version, -v      Show the version number');
            console.log('\\nExamples:');
            log.code('  npx ui69@latest init');
            log.code('  npx ui69@latest add button');
            log.code('  npx ui69@latest add input');
            console.log('\\n' + colors.yellow + '⚠ Note: You must run "npx ui69@latest init" first before adding components.' + colors.reset);
            break;
    }
}

// Run the CLI
main().catch(error => {
    log.error('An error occurred:');
    console.error(error);
    process.exit(1);
});