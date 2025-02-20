const { defineConfig } = require('@playwright/test');   // Do not change to import module. Breaks the flow.

process.env.PORT = '8080'; // Change the port number to a different value

require('dotenv').config({ path: 'utils/.env' });

const path = require('path');

const { projectConfig } = require('./projectConfig'); // Use require instead of import

 

module.exports = defineConfig({

  forbidOnly: !!process.env.forbidOnly,

  globalSetup: require.resolve('./config/global-setup.js'),

  workers: process.env.CI ? 1 : 5, // Increase workers for non-CI environments

  fullyParallel: false,

  retries: 0,

  globalTimeout: 10000 * 1000,  // Global timeout for the entire test suite

  timeout: 0, // Timeout for each test

  expect: {

    /**

     * Maximum time expect() should wait for the condition to be met.

     * For example in `await expect(locator).toHaveText();`

     */

    timeout: 40000

  },

  use: {

    // Set the default timeout for all actions, including page.screenshot

    actionTimeout: 30 * 1000,

    // Timeout for each navigation action like page.goto('/', { timeout: 80000 ms })

    navigationTimeout: 50 * 1000,

    trace: 'off',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    videoDir: path.join(__dirname, 'videos'), // Custom video storage location

    locale: process.env.locale,

    headless: false,

    browserName: process.env.browser,

    // channel: 'chrome',

    downloadsPath: __dirname,

    acceptDownloads: true,

    viewport: null, // Set the desired viewport size

    launchOptions: {

      slowMo: 0,

      args: ['--start-maximized', '--auth-server-allowlist="_"', '--allow-running-insecure-content', '--disable-web-security', '--ignore-certificate-errors']

    },

    extraHTTPHeaders: {

      // We set this header per GitHub guidelines.

      // Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",

    },

  },

  reporter: [

    ['html', { open: "never" }],

    ['junit', { outputFile: `reports/Playwright_${projectConfig.APM_ID}.xml` }],

    ['json', { outputFile: `reports/Playwright_${projectConfig.APM_ID}.json` }],

    ['allure-playwright', { outputFolder: 'my-allure-results' }],

    // ['./commons/cbreReporter.js']

  ],

});