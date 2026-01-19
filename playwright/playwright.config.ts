import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 30 : 15),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['junit', { outputFile: 'report.xml', includeProjectInTestName: true }], ['list']] : 'html',
  use: {
    actionTimeout: 0,
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  webServer: {
    command: `pnpm run --filter @axonivy/form-editor-standalone ${process.env.CI ? 'serve' : 'dev'}`,
    url: process.env.CI ? 'http://localhost:4173' : 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  globalSetup: './tests/global.setup',
  globalTeardown: './tests/global.teardown',
  projects: [
    { name: 'integration-chrome', use: { ...devices['Desktop Chrome'] }, testDir: './tests/integration' },
    { name: 'integration-firefox', use: { ...devices['Desktop Firefox'] }, testDir: './tests/integration' },
    { name: 'integration-webkit', use: { ...devices['Desktop Safari'] }, testDir: './tests/integration' },
    { name: 'screenshots', use: { ...devices['Desktop Chrome'], colorScheme: 'light' }, testDir: './tests/screenshots', retries: 0 }
  ]
});
