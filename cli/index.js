#!/usr/bin/env node

/**
 * rajsatyam CLI
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

// Ensure component directory exists
function ensureComponentsExist() {
    if (!fs.existsSync(COMPONENT_DIR)) {
        log.error(`Components directory not found: ${COMPONENT_DIR}`);
        log.info(`Make sure the package is installed correctly and the components directory exists.`);
        log.info(`Current directory: ${__dirname}`);
        process.exit(1);
    }
}

// Available components configuration
function getComponentsConfig() {
    // Check component directory exists
    ensureComponentsExist();

    return {
        button: {
            name: "Button",
            description: "Button",
            dependencies: [],
            files: [
                {
                    src: path.join(COMPONENT_DIR, 'ui/button.tsx'),
                    dest: 'components/ui/button.tsx',
                }
            ]
        }
        // Add more components here as your library grows
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
    });

    console.log('\nTo add a component:');
    log.code('  npx rajsatyam add <component>');
    console.log('\nOr select from the interactive menu:');
    log.code('  npx rajsatyam add');
}

// Show a splash screen
function showSplash() {
    console.log(`
${colors.bold}${colors.magenta}╭───────────────────────────────────────────────╮${colors.reset}
${colors.bold}${colors.magenta}│                                               │${colors.reset}
${colors.bold}${colors.magenta}│   ${colors.reset}${colors.bold}rajsatyam${colors.magenta}                                 │${colors.reset}
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
            log.title('rajsatyam CLI');
            console.log('A collection of unstyled, accessible UI components for React Native');
            console.log('\nCommands:');
            console.log('  add [component]    Add a component to your project (interactive if no component specified)');
            console.log('  list               List all available components');
            console.log('  --help, -h         Show this help message');
            console.log('  --version, -v      Show the version number');
            console.log('\nExamples:');
            log.code('  npx rajsatyam add button');
            log.code('  npx rajsatyam add     # Interactive component selection');
            log.code('  npx rajsatyam list');
            break;
    }
}

// Run the CLI
main().catch(error => {
    log.error('An error occurred:');
    console.error(error);
    process.exit(1);
});