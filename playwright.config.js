const { defineConfig } = require('@playwright/test');
const path = require('path');
const os = require('os');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: path.join(os.tmpdir(), 'dash-and-dandy-playwright'),
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 30_000
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],
  reporter: [['list']]
});
