#!/usr/bin/env node

/**
 * Simple test runner script for TalentoAI
 * This script makes testing easy and provides helpful output
 */

const { spawn } = require('child_process');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function showHelp() {
  log('\n📋 TalentoAI Test Commands:', colors.bold);
  log('  npm test              - Run all tests once');
  log('  npm run test:watch    - Run tests in watch mode');
  log('  npm run test:ui       - Run tests with UI interface');
  log('  npm run test:coverage - Run tests with coverage report');
  log('  npm run test:storybook - Run Storybook tests');
  log('\n🔍 Individual test files:');
  log('  npx vitest tests/Navbar.test.jsx');
  log('  npx vitest tests/ContactSection.test.jsx');
  log('  npx vitest tests/getInitialFromName.test.js');
  log('  npx vitest tests/contact-api.test.js');
  log('  npx vitest tests/Home.test.jsx');
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Running: ${command} ${args.join(' ')}`, colors.blue);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        log(`\n✅ Command completed successfully!`, colors.green);
        resolve();
      } else {
        log(`\n❌ Command failed with exit code ${code}`, colors.red);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      log(`\n❌ Error running command: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  log('🧪 TalentoAI Test Suite', colors.bold + colors.blue);
  log('========================', colors.blue);

  try {
    // Check if dependencies are installed
    const fs = require('fs');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.devDependencies['@testing-library/react']) {
      log('\n⚠️  Installing missing test dependencies...', colors.yellow);
      await runCommand('npm', ['install']);
    }

    if (args.length === 0) {
      // Default: run all tests
      await runCommand('npx', ['vitest', 'run', '--project', 'unit']);
    } else {
      // Pass through arguments to vitest
      await runCommand('npx', ['vitest', ...args]);
    }

  } catch (error) {
    log(`\n💡 Tips for troubleshooting:`, colors.yellow);
    log('  1. Make sure all dependencies are installed: npm install');
    log('  2. Check that test files are in the tests/ directory');
    log('  3. Ensure components are properly exported');
    log('  4. Use --help to see available commands');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, showHelp };
