const { test, expect } = require('@playwright/test');
const { UI_Helper } = require('../../utils/helpers/ui-helper');
const { RecurringForms } = require('../../pageObjects/RecurringForms');
const { Forms } = require('../../pageObjects/Forms');
const { HomePage } = require('../../pageObjects/HomePage');
const fs = require('fs');
const path = require('path');
/** @type {Forms} */
let rem;
/** @type {UI_Helper} */
let ui_helper;
/** @type {HomePage} */
let homePage;
/** @type {RecurringForms} */
let recurring_forms;
let browser;
let context;
let page;
let approver_email;
let secondary_approver_email;
let get_work_order_id;
let random_creator;
let random_approver;
let Accounting_System_id;
let random_secondary_approver;

test.describe('Single Property- Manual Billing Forms', () => {
    // This runs once before all tests in the suite
    test.beforeAll(async ({ browser: browserInstance }) => {
        browser = browserInstance;
    });

    test.beforeEach(async () => {
        recurring_forms = new RecurringForms(page);
        random_creator = await recurring_forms.get_random_creator_role();
        random_approver = await recurring_forms.get_random_approver_role();
        random_secondary_approver = await recurring_forms.get_random_secondary_approver_role();
        const storageStatePath = process.env.ENV === 'REC'
            ? path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_creator}_state.json`)
            : path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_creator}_state.json`);
        if (!fs.existsSync(storageStatePath)) {
            throw new Error(`Storage state file not found: ${storageStatePath}`);
        }
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });

        page = await context.newPage();
        ui_helper = new UI_Helper(page); // Instantiate UI_Helper here
        homePage = new HomePage(page); // Instantiate HomePage here
        recurring_forms = new RecurringForms(page); // Re-instantiate RecurringForms here
        rem = new Forms(page); // Instantiate Forms here

        if (!page || page.isClosed()) {
            page = await context.newPage();
            ui_helper = new UI_Helper(page);
            homePage = new HomePage(page);
            recurring_forms = new RecurringForms(page);
            rem = new Forms(page); // Instantiate Forms here
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
                await test.step('2307034 - Verify user navigated to Manual billing Forms Page', async () => {
                    console.log("we are in rec dashboard page");
                    await homePage.click_on_selected_page('Forms');
                    await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/dashboard");
                    await recurring_forms.click_on_selected_form('Manual Billing');
                    await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/manual-billing-form");
                });
            } else if (currentUrl.includes(process.env.TEST_DASHBOARD_URL)) {
                await test.step('2307034 - Verify user navigated to Manual billing Forms Page', async () => {
                    await homePage.click_on_selected_page('Forms');
                    await expect(page).toHaveURL("https://pulse-test.cbre.com/Forms/dashboard");
                    await recurring_forms.click_on_selected_form('Manual Billing');
                    await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/manual-billing-form");
                });
            }
        } catch (error) {
            console.log("Session expired or not logged in: " + error);
            // Perform login if the session has expired
            if (process.env.ENV === 'REC') {
                await ui_helper.performRecLogin();
                await test.step('2307034 - Verify user navigated to Manual billing Forms Page', async () => {
                    await homePage.click_on_selected_page('Forms');
                    await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/dashboard");
                    await recurring_forms.click_on_selected_form('Manual Billing');
                    await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/manual-billing-form");
                });
            } else {
                const storageStatePath = process.env.ENV === 'REC'
                    ? path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_creator}_state.json`)
                    : path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_creator}_state.json`);
                const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
                context = await browser.newContext({ storageState });
                page = await context.newPage();
            }
        }
    });


    test(`2307037 - Single Property - with out Attachment - Create a Manual Billing Form with Single Property, Work Order - No, Positive total amount`, async ({ browser }) => {
        console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
        await test.step(`2307037 - Verify whether User is able to submit Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
            await rem.select_project_id("1234 GARDINER LANE");
            await rem.select_Gl_Post_month();
            await rem.select_Gl_Post_date();
            await rem.click_on_Addnew_Record();
            await rem.select_tenant_name();
            await rem.enter_bill_code(1, 999);
            await rem.enter_bill_code_amount(1, 999)
            await rem.enter_record_description();
            await rem.click_save_record();
            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
            await rem.select_primary_approval(approver_email);
            await rem.select_accountant_email_id();
            await rem.submit_for_approval();
            get_work_order_id = await rem.get_work_item_number();
            await page.close();
        });
        await test.step(`2307035 - Verify whether User is able to Approve the Form(Primary Approver ${random_approver} when amt value is positive)`, async () => {
            const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
            const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
            context = await browser.newContext({ storageState });
            page = await context.newPage();
            await page.goto(process.env.REC_URL);
            await page.waitForTimeout(5000);
            const currentUrl = page.url();
            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
                await page.locator("#AzureADExchange").click({ force: true });//Work Account
                await page.waitForURL(process.env.REC_DASHBOARD_URL);
            }
            homePage = new HomePage(page);
            rem = new Forms(page);
            await homePage.click_on_selected_page('Forms');
            await rem.click_on_myactions();
            await rem.click_submitted_form_id(get_work_order_id);
            await rem.click_approve_submitted_form();
            expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
            await rem.waitForToastToDisappear();
            await page.close();
        });
    });
});
test(`2307038 - Single Property - with out Attachment - Secondary-Approver Submit MBF with work order as No and total bill amount as negative using creator and primary approve it with approver and secondary approve with secondary_approver`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver} and secondary approve with ${random_secondary_approver}`);
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(1.01, 999);
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    random_secondary_approver = await recurring_forms.verify_form_secondary_approver(random_secondary_approver, random_approver);
    secondary_approver_email = await rem.getEmailBasedOnText(random_secondary_approver)
    await rem.select_secondary_approval(secondary_approver_email);
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    console.log(get_work_order_id);
    await page.close();
    await test.step(`2307035 - Verify whether User is able to Approve the Form with Primary Approver ${random_approver} when amt value is Negative)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
    await test.step(`2307036 - Verify whether User is able to Approve the Form Secondary Approver ${random_secondary_approver} when amt value is Negative)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_secondary_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});
test(`2307039 - Single Property - with Attachment - Create a Manual Billing Form with Single Property, Work Order - No, Positive total amount `, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
    await test.step(`2307039 - Verify whether User is able to submit Form with Single Property,with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        await rem.click_on_Addnew_Record();
        await rem.select_tenant_name();
        await rem.enter_bill_code(1, 999);
        await rem.enter_bill_code_amount(1, 999);
        await rem.enter_record_description();
        await rem.click_save_record();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.add_attachment();
        await rem.submit_for_approval();
        get_work_order_id = await rem.get_work_item_number();
        await page.close();
    });
    await test.step(`2307035 - Verify whether User is able to Approve the Form(Primary Approver ${random_approver} when amt value is positive)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});
test(`2307041 - Single Property - with Attachment - Create a Manual Billing Form with Single Property, Work Order - Yes, Positive total amount `, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
    await test.step('2307039 - Verify whether User is able to submit Form with Single Property, Work Order -No, Positive total amount with attachments', async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        await rem.select_work_order();
        await rem.input_total_bill_amount();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.add_attachment();
        await rem.submit_for_approval();
        get_work_order_id = await rem.get_work_item_number();
        await page.close();
    });
    await test.step('2307035 - Verify whether User is able to Approve the Form(Primary Approver when amt value is positive)', async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});
test(` 2307040 - Single Property - with Attachment - Secondary-Approver Submit MBF with work order as No and total bill amount as negative using creator and primary approve it with approver and secondary approve with secondary_approver`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver} and secondary approve with ${random_secondary_approver}`);
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(1.01, 999);
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    random_secondary_approver = await recurring_forms.verify_form_secondary_approver(random_secondary_approver, random_approver);
    secondary_approver_email = await rem.getEmailBasedOnText(random_secondary_approver)
    await rem.select_secondary_approval(secondary_approver_email);
    await rem.add_attachment();
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    console.log(get_work_order_id);
    await page.close();
    await test.step(`2307035 - Verify whether User is able to Approve the Form with Primary Approver ${random_approver} when amt value is Negative)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
    await test.step(`2307036 - Verify whether User is able to Approve the Form Secondary Approver ${random_secondary_approver} when amt value is Negative)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_secondary_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.click_approve_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is approved and moved to next stage.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});
test(` 2307064 - Single Property - with out Attachment - Secondary-Approver Verify error message when both primary approver and secondary approver are same`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver} and secondary approve with ${random_secondary_approver}`);
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(1.01, 999);
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    await rem.select_secondary_approval(approver_email);
    await test.step('2307064 - Verify the error message when both Primary approver and secondary Approver are same', async () => {
        expect(await rem.get_error_message_secondary_approver()).toEqual(" Primary and Secondary approvers cannot be same. Please select a different approver ")
    });
    await page.close();
});
test(`2307058 - Single Property - with out Attachment - Reject a Manual Billing Form with Single Property, Work Order - No, Positive total amount `, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
    await test.step(`2307037 - Verify whether User is able to submit Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        await rem.click_on_Addnew_Record();
        await rem.select_tenant_name();
        await rem.enter_bill_code(1, 999);
        await rem.enter_bill_code_amount(1, 999)
        await rem.enter_record_description();
        await rem.click_save_record();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.submit_for_approval();
        get_work_order_id = await rem.get_work_item_number();
        await page.close();
    });
    await test.step(`2307058 - Verify whether ${random_approver} is able to Reject the Form when amt value is positive`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.enter_comments_in_submitted_form();
        await rem.click_reject_submitted_form();
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is rejected.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});

test(` 2307072 - Single Property Group - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details`, async ({ browser }) => {
    const random_secondary_approver_purpose_code = ['REC_ASSCDIR', 'REC_Director', 'REC_MDIR']
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(5000, 7500);
    await rem.select_purpose_code("WO : Write-off");
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    console.log("Expected Role id's are " + random_secondary_approver_purpose_code.sort())
    await test.step('2307072 - Single Property Group - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details', async () => {
        expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(random_secondary_approver_purpose_code.sort());
    });
    const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");
    secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)
    await rem.select_secondary_approval(secondary_approver_email);
    await rem.add_attachment();
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    console.log(get_work_order_id);
    await page.close();
});
test(` 2307073 - Single Property Group - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 15000, minAmount: 7500 and Purpose Code- Write Off(WO) in bill details`, async ({ browser }) => {
    const random_secondary_approver_purpose_code = ['REC_MDIR']
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(7500, 15000);
    await rem.select_purpose_code("WO : Write-off");
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    console.log("Expected Role id's are " + random_secondary_approver_purpose_code.sort())
    await test.step('2307073 - Single Property Group - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 15000, minAmount: 7500 and Purpose Code- Write Off(WO) in bill details', async () => {
        expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(random_secondary_approver_purpose_code.sort());
    });
    const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");
    secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)
    await rem.select_secondary_approval(secondary_approver_email);
    await rem.add_attachment();
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    console.log(get_work_order_id);
    await page.close();
});

test(`2307068 - Single Property - with out Attachment - Verify whether User can Delete the Manual Billing Form, Work Order - No, Positive total amount`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role Draft a MBF`);
    await test.step(`2307037 - Verify whether User is able to Save and Delete Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        await rem.click_on_Addnew_Record();
        await rem.select_tenant_name();
        await rem.enter_bill_code(1, 999);
        await rem.enter_bill_code_amount(1, 999)
        await rem.enter_record_description();
        await rem.click_save_record();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.click_button_approval_form(' Save As Draft ');
        let work_id = await rem.get_mbf_draft_work_id();
        await rem.click_button_approval_form(" Go to Dashboard ");
        await rem.dashboard_clickonviewAll_btn("Manual Billing");
        await rem.enter_submitted_form_id(work_id);
        await test.step('2307069 - Single Property Group - with out Attachment - Verify whether User can DRAFT the MBF', async () => {
            expect(await rem.get_work_order_status("Status:")).toEqual(" draft ");
        });
        await rem.dashboard_clickonactions_btn("delete");
        await rem.click_button_approval_form(" Yes ");
        await test.step('2307068 - Single Property Group - with out Attachment - Verify whether User can delete the Draft Form', async () => {
            expect(await rem.verify_approval_message()).toEqual(`Delete draft form sucessfully `);
            await rem.waitForToastToDisappear();
        });
    });
});

test(`2307069 - Single Property - with out Attachment - Verify whether User can DRAFT the Manual Billing Form, Work Order - No, Positive total amount`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role Draft a MBF`);
    context = await browser.newContext({ storageState: `${random_creator}` + "_state.json" });
    page = await context.newPage();
    await page.goto(process.env.REC_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
        await page.locator("#AzureADExchange").click({ force: true });//Work Account
        await page.waitForURL(process.env.REC_DASHBOARD_URL);
    }
    homePage = new HomePage(page);
    rem = new Forms(page);
    await test.step(` ${random_creator} Verify user navigated to Forms Page`, async () => {
        //await loginPage.click_on_menu_btn();
        await homePage.click_on_selected_page('Forms');
        await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/dashboard");
    });
    await test.step(`${random_creator} 2307034 - Verify user navigated to Manual billing Forms Page`, async () => {
        await rem.click_on_create_new_manual_form();
        await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/manual-billing-form");
    });
    await test.step(`2307037 - Verify whether User is able to submit Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        Accounting_System_id = await rem.get_accounting_system_id_value();
        await rem.click_on_Addnew_Record();
        await rem.select_tenant_name();
        await rem.enter_bill_code(1, 999);
        await rem.enter_bill_code_amount(1, 999)
        await rem.enter_record_description();
        await rem.click_save_record();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.click_button_approval_form(' Save As Draft ');
        let work_id = await rem.get_mbf_draft_work_id();
        await rem.click_button_approval_form(" Go to Dashboard ");
        await rem.dashboard_clickonviewAll_btn("Manual Billing");
        await rem.enter_submitted_form_id(work_id);
    });
    await test.step('2307069 - Single Property Group - with out Attachment - Verify whether User can DRAFT the MBF', async () => {
        expect(await rem.get_work_order_status("Status:")).toEqual(" draft ");
    });
    await rem.dashboard_clickonactions_btn("file_copy");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    await homePage.click_on_selected_page('Forms');
    await rem.dashboard_clickonviewAll_btn("Manual Billing");
    await rem.enter_submitted_form_id(get_work_order_id);
    let current_date = await rem.getCurrentDateFormatted();
    await test.step('2307080 - Single Property Group - with out Attachment - Verify Search criteria for MBF Status', async () => {
        expect(await rem.get_work_order_status("Status:")).toEqual(" In Progress ");
    });
    // await test.step(`2307081 - Verify Search criteria for Accounting Status with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
    //     expect(await rem.get_work_order_status("Accounting Status: ")).toEqual("");
    // });
    await test.step(`2307078 - Verify Search criteria for Property/Group with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        expect(await rem.get_column_value("Property/Group:")).toEqual("1234 GARDINER LANE");
    });
    await test.step(`2307079 - Verify Search criteria for Accounting System Id with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        expect(await rem.get_column_value("Accounting System ID:")).toEqual(Accounting_System_id);
    });
    await test.step(`2307082 - Verify Search criteria for for Submitted On Date with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        expect(await rem.get_column_value("Submitted On:")).toEqual(current_date);
    });
    await page.close();
});
test(`2307057 - Single Property - with out Attachment - Rework a Manual Billing Form with Single Property, Work Order - No, Positive total amount `, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
    await test.step(`2307037 - Verify whether User is able to submit Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {
        await rem.select_project_id("1234 GARDINER LANE");
        await rem.select_Gl_Post_month();
        await rem.select_Gl_Post_date();
        await rem.click_on_Addnew_Record();
        await rem.select_tenant_name();
        await rem.enter_bill_code(1, 999);
        await rem.enter_bill_code_amount(1, 999)
        await rem.enter_record_description();
        await rem.click_save_record();
        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
        await rem.select_primary_approval(approver_email);
        await rem.select_accountant_email_id();
        await rem.submit_for_approval();
        get_work_order_id = await rem.get_work_item_number();
        await page.close();
    });
    await test.step(`2307057 - Verify whether ${random_approver} is able to sent for Rework the Form when amt value is positive`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.click_submitted_form_id(get_work_order_id);
        await rem.enter_comments_in_submitted_form();
        await rem.click_button_approval_form(' Rework');
        expect(await rem.verify_approval_message()).toEqual(`Manual Billing form (#${get_work_order_id}) is sent back to submitter for Rework.`);
        await rem.waitForToastToDisappear();
        await page.close();
    });
});
test(` 2307065 - Single Property - with Attachment - Secondary-Approver Submit MBF with work order as No and total bill amount as negative using creator and try to approve it with secondary approver with out approved by Primary approver`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver} and secondary approve with ${random_secondary_approver}`);
    await rem.select_project_id("1234 GARDINER LANE");
    await rem.select_Gl_Post_month();
    await rem.select_Gl_Post_date();
    await rem.click_on_Addnew_Record();
    await rem.select_tenant_name();
    await rem.enter_bill_code(1, 999);
    await rem.enter_bill_code_negative_amount(1.01, 999);
    await rem.enter_record_description();
    await rem.click_save_record();
    approver_email = await rem.getEmailBasedOnText(`${random_approver}`)
    await rem.select_primary_approval(approver_email);
    recurring_forms = new RecurringForms(page);
    random_secondary_approver = await recurring_forms.verify_form_secondary_approver(random_secondary_approver, random_approver);
    secondary_approver_email = await rem.getEmailBasedOnText(random_secondary_approver)
    await rem.select_secondary_approval(secondary_approver_email);
    await rem.add_attachment();
    await rem.select_accountant_email_id();
    await rem.submit_for_approval();
    get_work_order_id = await rem.get_work_item_number();
    console.log(get_work_order_id);
    await page.close();
    await test.step(`2307065 - Single Property - with Attachment - Secondary-Approver Submit MBF with work order as No and total bill amount as negative using creator and try to approve it with ${random_secondary_approver} secondary approver with out approved by Primary approver when amt value is Negative)`, async () => {
        const storageStatePath = path.resolve(path.join(__dirname, '../', process.env.TEST_RESULTS_DIR), `${random_secondary_approver}_state.json`);
        const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
        context = await browser.newContext({ storageState });
        page = await context.newPage();
        await page.goto(process.env.REC_URL);
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        homePage = new HomePage(page);
        rem = new Forms(page);
        await homePage.click_on_selected_page('Forms');
        await rem.click_on_myactions();
        await rem.enter_submitted_form_id(get_work_order_id);
        expect(await rem.verify_form_id_search_result()).toEqual(' No records available. ');
        await page.close();
    });
});

test(`2307037 - Verify Forms Dashboard Page using Screenshot Comparision`, async ({ browser }) => {
    console.log(`Using ${random_creator} Role and primary approve it with ${random_approver}`);
    context = await browser.newContext({ storageState: `${random_creator}` + "_state.json" });
    page = await context.newPage();
    await page.goto(process.env.REC_URL, { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    const currentUrl = page.url();
    if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
        await page.locator("#AzureADExchange").click({ force: true });//Work Account
        await page.waitForURL(process.env.REC_DASHBOARD_URL);
    }
    homePage = new HomePage(page);
    rem = new Forms(page);
    await test.step(` ${random_creator} Verify user navigated to Forms Page`, async () => {
        await homePage.click_on_selected_page('Forms');
        await page.waitForTimeout(5000);
        const currentUrl = page.url();
        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {
            await page.locator("#AzureADExchange").click({ force: true });//Work Account
            await page.waitForURL(process.env.REC_DASHBOARD_URL);
        }
        await expect(page).toHaveURL("https://pulse-rec.cbre.com/Forms/dashboard");
    });
    await test.step('Verify the columns in Forms Dashboard page using Visual Comparision', async () => {
        const FormsDashboardTableHeaderLocator = rem.forms_dashboard_table_header;
        let screenshot_details = await rem.capture_screenshot_portion_of_page(FormsDashboardTableHeaderLocator, "forms_dashboard_table_header");
        await expect(screenshot_details.locator).toHaveScreenshot(screenshot_details.screenshotPath, { threshold: 0.05, maxDiffPixelRatio: 0.05 });
    });
    // This runs once after all tests in the suite
    test.afterAll(async () => {
        await page.close();
    });
});
