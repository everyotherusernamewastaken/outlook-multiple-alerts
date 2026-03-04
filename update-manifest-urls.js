#!/usr/bin/env node

/**
 * Script to update manifest.xml URLs for deployment
 * Usage: node update-manifest-urls.js YOUR-GITHUB-USERNAME
 */

const fs = require('fs');
const path = require('path');

const username = process.argv[2];

if (!username) {
  console.error('❌ Error: Please provide your GitHub username');
  console.log('Usage: node update-manifest-urls.js YOUR-GITHUB-USERNAME');
  console.log('Example: node update-manifest-urls.js john-doe');
  process.exit(1);
}

const manifestPath = path.join(__dirname, 'manifest.xml');
const newBaseUrl = `https://${username}.github.io/outlook-multiple-alerts`;

console.log(`📝 Updating manifest.xml URLs...`);
console.log(`   Base URL: ${newBaseUrl}`);

try {
  // Read manifest
  let manifest = fs.readFileSync(manifestPath, 'utf8');
  
  // Replace localhost URLs
  const oldUrl = 'https://localhost:3000';
  const urlCount = (manifest.match(new RegExp(oldUrl, 'g')) || []).length;
  
  manifest = manifest.replace(new RegExp(oldUrl, 'g'), newBaseUrl);
  
  // Write back
  fs.writeFileSync(manifestPath, manifest, 'utf8');
  
  console.log(`✅ Updated ${urlCount} URLs in manifest.xml`);
  console.log(`\nYour add-in will now load from:`);
  console.log(`   ${newBaseUrl}/taskpane.html`);
  console.log(`\nNext steps:`);
  console.log(`   1. git add manifest.xml`);
  console.log(`   2. git commit -m "Update manifest URLs for GitHub Pages"`);
  console.log(`   3. git push`);
  console.log(`   4. Wait 1-2 minutes for GitHub Pages to update`);
  console.log(`   5. Test: ${newBaseUrl}/taskpane.html`);
  
} catch (error) {
  console.error('❌ Error updating manifest:', error.message);
  process.exit(1);
}
