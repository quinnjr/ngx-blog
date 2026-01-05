#!/usr/bin/env node

/**
 * NGX Blog CMS Setup Script
 * Cross-platform Node.js setup script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, silent = false) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    });
  } catch (error) {
    if (!silent) {
      log(`❌ Command failed: ${command}`, 'red');
    }
    throw error;
  }
}

function checkNodeVersion() {
  try {
    const version = exec('node --version', true).trim();
    log(`✅ Node.js ${version} found`, 'green');
    return true;
  } catch {
    log('❌ Node.js is not installed. Please install Node.js 18+ or 20+', 'red');
    return false;
  }
}

function checkPnpm() {
  try {
    const version = exec('pnpm --version', true).trim();
    log(`✅ pnpm ${version} found`, 'green');
    return true;
  } catch {
    log('📦 Installing pnpm...', 'yellow');
    try {
      exec('npm install -g pnpm');
      return true;
    } catch {
      log('❌ Failed to install pnpm', 'red');
      return false;
    }
  }
}

function main() {
  log('🚀 Setting up NGX Blog CMS...', 'cyan');
  console.log('');

  // Check prerequisites
  if (!checkNodeVersion()) {
    process.exit(1);
  }

  if (!checkPnpm()) {
    process.exit(1);
  }

  // Install dependencies (skip if running as postinstall)
  if (!process.env.npm_lifecycle_event || process.env.npm_lifecycle_event !== 'postinstall') {
    console.log('');
    log('📦 Installing dependencies...', 'yellow');
    exec('pnpm install');
  }

  console.log('');
  log('✅ Setup complete!', 'green');
  console.log('');
  log('🎉 NGX Blog CMS is ready to use!', 'cyan');
  console.log('');
  console.log('To start the development server:');
  log('  pnpm start', 'bright');
  console.log('');
  console.log('To build for production:');
  log('  pnpm build', 'bright');
  console.log('');
  console.log('To serve the production build:');
  log('  pnpm serve:ssr:ngx-blog-cms', 'bright');
  console.log('');
  log('Access the blog at: http://localhost:4200', 'cyan');
  log('Access the admin at: http://localhost:4200/admin', 'cyan');
  console.log('');
}

// Run setup
try {
  main();
} catch (error) {
  log('❌ Setup failed', 'red');
  console.error(error);
  process.exit(1);
}
