const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

// Ensure directories exist
console.log('Creating directories...');
execSync('node scripts/ensure-dirs.js', { stdio: 'inherit' });

// Copy assets
console.log('Copying assets...');
execSync('node scripts/copy-assets.js', { stdio: 'inherit' });

// Build CSS
console.log('Building CSS...');
execSync('npx tailwindcss -i ./src/client/styles.css -o ./public/bundle/styles.css --minify', { stdio: 'inherit' });

// Bundle client JavaScript
console.log('Bundling client JavaScript...');
execSync('esbuild src/client/app-entry.ts --bundle --outfile=public/bundle/client-bundle.js --format=esm --minify', { stdio: 'inherit' });
execSync('esbuild src/client/test-terminals-entry.ts --bundle --outfile=public/bundle/terminal.js --format=esm --minify', { stdio: 'inherit' });

// Build server TypeScript
console.log('Building server...');
execSync('tsc', { stdio: 'inherit' });

// Build native executable (skip if building from Xcode)
if (process.env.SKIP_NATIVE_BUILD !== 'true') {
    console.log('Building native executable...');
    execSync('node build-native.js', { stdio: 'inherit' });
} else {
    console.log('Skipping native executable build (handled by Xcode)...');
}

console.log('Build completed successfully!');