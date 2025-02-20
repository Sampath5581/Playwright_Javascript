const { test, expect } = require('@playwright/test');
const { UI_Helper } = require('../../utils/helpers/ui-helper');
const { CriticalDates } = require('../../pageObjects/CriticalDates');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'utils/.env' });
let browser;
let context;
let page;
/** @type {UI_Helper} */
let ui_helper;
/** @type {CriticalDates} */
let critdates;

test.describe('Critical Dates Validations at Tenant Dashboard level', () => {
  test.beforeAll(async ({ browser: browserInstance }) => {
    browser = browserInstance;
    const storageStatePath = process.env.ENV === 'REC'
                ? path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), 'REC_ADMIN_state.json')
                : path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), 'TEST_ADMIN_state.json');
    if (!fs.existsSync(storageStatePath)) {
      throw new Error(`Storage state file not found: ${storageStatePath}`);
    }
    const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
    context = await browser.newContext({ storageState });

    page = await context.newPage();
    ui_helper = new UI_Helper(page);
    critdates = new CriticalDates(page);  
  });

  test.beforeEach(async () => {
    if (!page || page.isClosed()) {
      page = await context.newPage();
      ui_helper = new UI_Helper(page);
      critdates = new CriticalDates(page);
    }
    const targetUrl = process.env.ENV === 'REC' ? process.env.REC_URL : process.env.TEST_URL;
    await page.goto(targetUrl);
    await page.waitForLoadState('load');
    console.log(`Navigating to URL: ${targetUrl}`);

    const dashboardUrl = process.env.ENV === 'REC' ? process.env.REC_DASHBOARD_URL : process.env.TEST_DASHBOARD_URL;
    await page.waitForURL(dashboardUrl, { timeout: 160000 });    
   
    // Check if the session is still valid using UI_Helper
    const currentUrl = page.url();
    try {
      if (currentUrl.includes(process.env.REC_DASHBOARD_URL)) {
        await test.step('Verify whether User is able to Navigate to Tenants Detail overview Page', async () => {
          expect(await critdates.verify_property_overview_page('CriticalDates', 'TC031')).toBeTruthy();
          await ui_helper.click_on_tab_property_level("Tenants");
        });
      } else if (currentUrl.includes(process.env.TEST_DASHBOARD_URL)) {
        await test.step('Verify whether User is able to Navigate to Tenants Detail overview Page', async () => {
          expect(await critdates.verify_property_overview_page('CriticalDates', 'TC031')).toBeTruthy();
          await ui_helper.click_on_tab_property_level("Tenants");
        });
      }
    } catch (error) {
      console.log("Session expired or not logged in: " + error);
      // Perform login if the session has expired
      if (process.env.ENV === 'REC') {
        await ui_helper.performRecLogin();
      } else {
        //await ui_helper.performLogin();
        const storageStatePath = process.env.ENV === 'REC'
                    ? path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), 'REC_ADMIN_state.json')
                    : path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), 'TEST_ADMIN_state.json');
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
      }
    }
  });

  test('TC001 - CD page validations at Tenant Dashboard level', async () => {
    await critdates.TenantDashboardCriticalDatesPageValidations('CriticalDates', 'TC031', 'PropertyName');
  });

  test('TC002 - Add Recurring Critical Dates at Tenant Dashboard level', async () => {
    await critdates.addCriticalDateAtTenantDashboard('CriticalDates', 'TC032', 'Recurring');
  });

  test('TC003 - Edit Recurring Critical Dates at Tenant Dashboard level', async () => {
    await critdates.editRecurringCriticalDateTenantDashboard('CriticalDates', 'TC033', 'PropertyName');
  });

  // Failing this test case due to the issue with the Audit History feature
  test('TC004 - Audit History for Critical Dates at Tenant Dashboard level', async () => {
    await critdates.auditHistoryForManualCDTenantDashboard('CriticalDates', 'TC034', 'PropertyName');
  });

  test('TC005 - SORT values on Criticaldates columns tenant Dashboard', async () => {
    await critdates.criticalDateSortByColumnDataTenantDashboard('CriticalDates', 'TC034', 'PropertyName');
  });

  test('TC006 - Validate Error Messages for missing mandatory fields', async () => {
    await critdates.UIValidationMessagesAtTenantdashboarLevel('CriticalDates', 'TC037', 'PropertyName');
  });

  test('TC007 - Edit CD status Using Pen Icon at tenant dashboard level', async () => {
    await critdates.EditCDstatusUsingPenIconAtTenantDashboardLevel('CriticalDates', 'TC034', 'PropertyName');
  });

  test('TC008 - Export Critical dates at tenant dashboard level', async () => {
    await critdates.ExportCriticalDatesAtTenantDasboardLevel('CriticalDates', 'TC039', 'PropertyName');
  });

  // test('TC009 - NON RECURRING CD CRUD OPERATIONS AT TENANT DASHBOARD', async () => {
  //   await critdates.NonRecurringCDCrudOperationsAtTenantDashboard('CriticalDates', 'TC035', 'PropertyName');
  // });
});

test.afterAll(async () => {
  await context.close();
});