const { test, expect } = require('@playwright/test');

const { RecurringForms } = require('../../pageObjects/RecurringForms');

const { Forms } = require('../../pageObjects/Forms');

const { HomePage } = require('../../pageObjects/HomePage');

let page;

let context_name;

/** @type {Forms} */

let rem;

/** @type {RecurringForms} */

let recurring_forms;

/** @type{HomePage} */

let homePage;

let approver_email;

let secondary_approver_email;

let get_work_order_id;

let random_creator;

let random_approver;

let random_secondary_approver;

let Accounting_System_id;

let form_description;

test.describe('Recurring Charges Forms', () => {

    test.beforeEach(async ({ browser }) => {

        recurring_forms = new RecurringForms(page);

        random_creator = await recurring_forms.get_random_creator_role();

        random_approver = await recurring_forms.get_random_approver_role();

        random_secondary_approver = await recurring_forms.get_random_secondary_approver_role();

        console.log(`Using ${random_creator} Role and primary approve it with ${random_approver} and secondary approver with ${random_secondary_approver}`);

        context_name = await browser.newContext({ storageState: `${random_creator}` + "_state.json" });

        page = await context_name.newPage();

        await page.goto(process.env.REC_URL, { waitUntil: 'load' });

        await page.waitForTimeout(5000);

        const currentUrl = page.url();

        if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

            await page.locator("#AzureADExchange").click({ force: true });//Work Account

            await page.waitForURL(process.env.REC_DASHBOARD_URL);

        }

        homePage = new HomePage(page);

        recurring_forms = new RecurringForms(page);

        rem = new Forms(page);

        await test.step(` ${random_creator} Verify user navigated to Forms Page`, async () => {

            await page.waitForTimeout(5000);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await expect(page).toHaveURL(https://pulse-rec.cbre.com/Forms/dashboard);

        });

        await test.step(`Using ${random_creator} - Verify user navigated to recurring-charges-form Page`, async () => {

            await recurring_forms.click_on_selected_form('Recurring Charges');

            await expect(page).toHaveURL(https://pulse-rec.cbre.com/Forms/recurring-charges-form);

        });

    })

    test(` 2307420 - Verify error message when both primary approver and secondary approver are same`, async () => {

        await test.step(`2307420 - Verify whether User is able to submit Recurring Charges Form when both primary approver ${random_approver} and Secondary approver ${random_secondary_approver} are same `, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

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

    });

    test('2307403 - Create a Recurring Charges Billing Form with Positive total amount and with out attachments using random_creator Role and approve it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with out attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`2307404 - Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

    test('2307408 - Create a Recurring Charges Billing Form with Positive total amount and with attachments using random_creator Role and approve it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            await rem.select_accountant_email_id();

            await rem.add_attachment();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`2307404 - Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive and attachment exists)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

    test("2307421 - Verify that the secondary approver can't approve if it is not approved by Primary approver", async ({ browser }) => {

        await test.step(`Verify whether User is able to submit Recurring Charges Form when both primary approver ${random_approver} and Secondary approver ${random_secondary_approver} are different `, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(random_approver)

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

        });

        await test.step(`2307421 - Verify that the secondary approver ${random_secondary_approver} can't approve if it is not approved by Primary approver ${random_approver})`, async () => {

            context_name = await browser.newContext({ storageState: `${random_secondary_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            expect(await rem.verify_form_id_search_result()).toEqual(' No records available. ');

            await page.close();

        });

    });

 

    test(" Verify that the secondary approver can approve if it is not approved by Primary approver if secondary approver has access to primary approver role", async ({ browser }) => {

        await test.step(`Verify whether User is able to submit Recurring Charges Form when both primary approver ${random_approver} and Secondary approver ${random_secondary_approver} are different `, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(random_approver)

            await rem.select_primary_approval(approver_email);

            random_secondary_approver = await recurring_forms.verify_form_secondary_approver_1(random_secondary_approver);

            secondary_approver_email = await rem.getEmailBasedOnText(random_secondary_approver)

            await rem.select_secondary_approval(secondary_approver_email);

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`Verify that the secondary approver ${random_secondary_approver} can approve if it is not approved by Primary approver ${random_approver} when secondary approver has approval role access)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_secondary_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await page.close();

        });

    });

 

    test("2307405,2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with out attachments using random_creator Role and approve it with random_approver role", async ({ browser }) => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with out attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            if (random_approver == random_secondary_approver || random_approver == random_creator) {

                const nextSecondary_Approver = await recurring_forms.get_random_secondary_approver_role();

                secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            else {

                secondary_approver_email = await rem.getEmailBasedOnText(`${random_secondary_approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

        await test.step(`2307405 - Verify whether User is able to Approve the Recurring Charges Form with (Secondary Approver ${random_secondary_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_secondary_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test("2307409 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with attachments using random_creator Role", async () => {

        await test.step(`2307409 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            if (random_approver == random_secondary_approver || random_approver == random_creator) {

                const nextSecondary_Approver = await recurring_forms.get_random_secondary_approver_role();

                secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            else {

                secondary_approver_email = await rem.getEmailBasedOnText(`${random_secondary_approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

    });

 

 

    test("2307426 - Verify Secondary Approver roles for Rule maxAmount: 1000,minAmount: 0.01 and Purpose Code- Write Off(WO) in bill details", async () => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount from range 7500 to 15000 and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            let entered_bill_amount = await recurring_forms.enter_bill_code_negative_amount(1.01, 1000);

            await rem.select_purpose_code("WO : Write-off");

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            let expected_secondary_approver_roles = await recurring_forms.sort_random_secondary_approver_purpose_code_range(entered_bill_amount);

            console.log("Expected Secondary approval Role id's are " + expected_secondary_approver_roles)

            await test.step('2307426 - Recurring Charges Forms - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details', async () => {

                expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(expected_secondary_approver_roles);

            });

            const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");

            secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

            await rem.select_secondary_approval(secondary_approver_email);

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await context_name.close();

        });

    });

 

    test("2307427 - Verify Secondary Approver roles for Rule maxAmount: 5000,minAmount: 1000 and Purpose Code- Write Off(WO) in bill details", async () => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount from range 7500 to 15000 and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            let entered_bill_amount = await recurring_forms.enter_bill_code_negative_amount(1000, 5000);

            await rem.select_purpose_code("WO : Write-off");

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            let expected_secondary_approver_roles = await recurring_forms.sort_random_secondary_approver_purpose_code_range(entered_bill_amount);

            console.log("Expected Secondary approval Role id's are " + expected_secondary_approver_roles)

            await test.step('2307427 - Recurring Charges Forms - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details', async () => {

                expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(expected_secondary_approver_roles);

            });

            const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");

            secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

            await rem.select_secondary_approval(secondary_approver_email);

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await context_name.close();

        });

    });

 

    test("2307428 - Verify Secondary Approver roles for Rule maxAmount: 7500,minAmount: 5000 and Purpose Code- Write Off(WO) in bill details", async () => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount from range 5000 to 7500 and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            let entered_bill_amount = await recurring_forms.enter_bill_code_negative_amount(5000, 7500);

            await rem.select_purpose_code("WO : Write-off");

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            let expected_secondary_approver_roles = await recurring_forms.sort_random_secondary_approver_purpose_code_range(entered_bill_amount);

            console.log("Expected Secondary approval Role id's are " + expected_secondary_approver_roles)

            await test.step('2307428 - Recurring Charges Forms - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details', async () => {

                expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(expected_secondary_approver_roles);

            });

            const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");

            secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

            await rem.select_secondary_approval(secondary_approver_email);

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await context_name.close();

 

        });

    });

 

    test("2307429 - Verify Secondary Approver roles for Rule minAmount: 7500 and Purpose Code- Write Off(WO) in bill details", async () => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount from range 7500 to 15000 and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            let entered_bill_amount = await recurring_forms.enter_bill_code_negative_amount(7500, 15000);

            await rem.select_purpose_code("WO : Write-off");

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            let expected_secondary_approver_roles = await recurring_forms.sort_random_secondary_approver_purpose_code_range(entered_bill_amount);

            console.log("Expected Secondary approval Role id's are " + expected_secondary_approver_roles)

            await test.step('2307429 - Recurring Charges Forms - with out Attachment - Secondary-Approver Verify Secondary Approver roles for Rule maxAmount: 7500, minAmount: 5000 and Purpose Code- Write Off(WO) in bill details', async () => {

                expect(await rem.get_all_secondary_approver_email_ids("testuseraut.")).toEqual(expected_secondary_approver_roles);

            });

            const nextSecondary_Approver = await rem.select_secondary_approver_email_id_purpose_code(`${random_approver}`, "testuseraut.");

            secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

            await rem.select_secondary_approval(secondary_approver_email);

            await rem.add_attachment();

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await context_name.close();

        });

    });

 

    test(`2307424- with out Attachment - Verify whether User can Delete the Draft Recurring Charges Form, Work Order - No, Positive total amount`, async () => {

        await test.step(` 2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

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

            await rem.dashboard_clickonviewAll_btn("Recurring Charges");

            await rem.enter_submitted_form_id(work_id);

            await test.step('2307425 -with out Attachment - Verify whether User can DRAFT the Recurring Charges Form', async () => {

                expect(await rem.get_work_order_status("Status:")).toEqual(" draft ");

            });

            await rem.dashboard_clickonactions_btn("delete");

            await rem.click_button_approval_form(" Yes ");

            await test.step('2307424 -Verify whether User can delete the Draft Recurring Charges Form', async () => {

                expect(await rem.verify_approval_message()).toEqual(`Delete draft form sucessfully `);

                await rem.waitForToastToDisappear();

            });

        });

    });

 

    test(`2307425 -  with out Attachment - Verify whether User can DRAFT the Manual Billing Form, Work Order - No, Positive total amount`, async () => {

        await test.step(`2307037 - Verify whether User is able to submit Form with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            Accounting_System_id = await rem.get_accounting_system_id_value();

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

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

            await rem.dashboard_clickonviewAll_btn("Recurring Charges");

            await rem.enter_submitted_form_id(work_id);

        });

        await test.step('2307425 - with out Attachment - Verify whether User can DRAFT the Recurring Charges Form', async () => {

            expect(await rem.get_work_order_status("Status:")).toEqual(" draft ");

        });

        await test.step('2307423 - with out Attachment - Verify whether User can Copy the DRAFT the Recurring Charges Form', async () => {

            await rem.dashboard_clickonactions_btn("file_copy");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            await rem.select_accountant_email_id();

            form_description = await rem.enter_form_description();

            console.log(form_description);

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            expect(await rem.verify_submit_message()).toEqual(`${get_work_order_id} has been submitted successfully`);

        });

        await test.step(`2307438 - Verify Search criteria for Submitted On Date with role as ${random_creator}, Work Order -No, Positive total amount with out attachments`, async () => {

            let current_date = await rem.getCurrentDateFormatted();

            await homePage.click_on_selected_page('Forms');

            await rem.dashboard_clickonviewAll_btn("Recurring Charges");

            await rem.enter_submitted_form_id(get_work_order_id);

            expect(await rem.get_column_value("Submitted On:")).toEqual(current_date);

        });

 

        await test.step('2307436 - with out Attachment - Verify Search criteria for RCF Status', async () => {

            expect(await rem.get_work_order_status("Status:")).toEqual("In Progress");

        });

        await test.step(`2307434 - Verify Search criteria for Property/Group with Single Property with role as ${random_creator}, Work Order -No, Positive total amount with out attachments`, async () => {

            expect(await rem.get_column_value("Property/Group:")).toEqual("1234 GARDINER LANE");

        });

        await test.step(`2307435 - Verify Search criteria for Accounting System Id with role as ${random_creator}, Work Order -No, Positive total amount with out attachments`, async () => {

            expect(await rem.get_column_value("Accounting System ID:")).toEqual(Accounting_System_id);

        });

 

        await test.step(`2307439 - Verify Search criteria for Description with role as ${random_creator}, Work Order -No, Positive total amount with out attachments`, async () => {

            expect(await rem.get_column_value("Description:")).toEqual(form_description);

        });

        // await test.step(`2307437 - Verify Search criteria for Accounting Status with role as ${random_creator}, Work Order -No, Positive total amount with attachments`, async () => {

        //     expect(await rem.get_work_order_status("Accounting Status: ")).toEqual("");

        // });

        await page.close();

    });

    test('2307414 - Rework a Recurring Charges Billing Form with Positive total amount and with out attachments using random_creator Role and Rework it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with out attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`2307414 - Verify whether User is able to Rework on the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.enter_comments_in_submitted_form();

            await rem.click_button_approval_form(' Rework');

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is sent back to submitter for Rework.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test('2307415 - Reject a Recurring Charges Billing Form with Positive total amount and with out attachments using random_creator Role and Reject it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with out attachments`, async () => {

            await rem.select_project_id("1234 GARDINER LANE");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`2307415 - Verify whether User is able to Reject the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.enter_comments_in_submitted_form();

            await rem.click_reject_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is rejected.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test('2307412 - BSO Accountant - Create a Recurring Charges Billing Form with Positive total amount and with attachments using random_creator Role and approve it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with attachments`, async () => {

            await rem.select_project_id("1141 CADILLAC CT");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            expect(await rem.get_accounting_name()).toEqual("BSO Accounting")

            await rem.add_attachment();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`BSO Accountant - Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive and attachment exists)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            // await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test('2307410 - BSO Accountant - Create a Recurring Charges Billing Form with Positive total amount and with out attachments using random_creator Role and approve it with random_approver role', async ({ browser }) => {

        await test.step(`2307403,2307406 - Verify whether User is able to submit Recurring Charges Form with role as ${random_creator}, Positive total amount with attachments`, async () => {

            await rem.select_project_id("1141 CADILLAC CT");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_amount(1, 999)

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            expect(await rem.get_accounting_name()).toEqual("BSO Accounting")

            await rem.add_attachment();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`BSO Accountant - Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is positive and attachment exists)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            // await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test("2307411 BSO Accountant - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with out attachments using random_creator Role and approve it with random_approver role", async ({ browser }) => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with out attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1141 CADILLAC CT");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            if (random_approver == random_secondary_approver || random_approver == random_creator) {

                const nextSecondary_Approver = await recurring_forms.get_random_secondary_approver_role();

                secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            else {

                secondary_approver_email = await rem.getEmailBasedOnText(`${random_secondary_approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            //await rem.select_accountant_email_id();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

        await test.step(`2307405 - Verify whether User is able to Approve the Recurring Charges Form with (Secondary Approver ${random_secondary_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_secondary_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test("2307413 BSO Accountant - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with attachments using random_creator Role and approve it with random_approver role", async ({ browser }) => {

        await test.step(`2307407 - Verify whether User is able to submit Recurring Charges Form with Negative total amount and with attachments using random_creator Role ${random_creator}`, async () => {

            await rem.select_project_id("1141 CADILLAC CT");

            await rem.click_on_Addnew_Record();

            await rem.select_tenant_name();

            await recurring_forms.select_start_date('Start Date ');

            await recurring_forms.select_frequency('frequency');

            await rem.enter_bill_code(1, 999);

            await rem.enter_bill_code_negative_amount(1.01, 999);

            await rem.enter_record_description();

            await rem.click_save_record();

            approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

            await rem.select_primary_approval(approver_email);

            if (random_approver == random_secondary_approver || random_approver == random_creator) {

                const nextSecondary_Approver = await recurring_forms.get_random_secondary_approver_role();

                secondary_approver_email = await rem.getEmailBasedOnText(`${nextSecondary_Approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            else {

                secondary_approver_email = await rem.getEmailBasedOnText(`${random_secondary_approver}`)

                await rem.select_secondary_approval(secondary_approver_email);

            }

            // await rem.select_accountant_email_id();

            await rem.add_attachment();

            await rem.submit_for_approval();

            get_work_order_id = await rem.get_work_item_number();

            console.log(get_work_order_id);

            await page.close();

        });

        await test.step(`Verify whether User is able to Approve the Recurring Charges Form with (Primary Approver ${random_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

        await test.step(`2307405 - Verify whether User is able to Approve the Recurring Charges Form with (Secondary Approver ${random_secondary_approver} when amt value is Negative with out attachments)`, async () => {

            context_name = await browser.newContext({ storageState: `${random_secondary_approver}` + "_state.json" });

            page = await context_name.newPage();

            await page.goto(process.env.REC_URL);

            await page.waitForTimeout(5000);

            const currentUrl = page.url();

            if (currentUrl.includes(process.env.REC_LOGIN_URL)) {

                await page.locator("#AzureADExchange").click({ force: true });//Work Account

                await page.waitForURL(process.env.REC_DASHBOARD_URL);

            }

            homePage = new HomePage(page);

            rem = new Forms(page);

            recurring_forms = new RecurringForms(page);

            await homePage.click_on_selected_page('Forms');

            await homePage.click_on_selected_page('Forms');

            await recurring_forms.click_on_myactions('Recurring Charges');

            await rem.enter_submitted_form_id(get_work_order_id);

            await recurring_forms.click_submitted_form_id(get_work_order_id);

            await rem.click_approve_submitted_form();

            expect(await rem.verify_approval_message()).toEqual(`Recurring Charges form (#${get_work_order_id}) is approved and moved to next stage.`);

            await rem.waitForToastToDisappear();

            await page.close();

        });

    });

 

    test(` 2767475 - Verify total batch amount is getting displayed on the total batch amount column (All tenants amount summation)`, async () => {

        await rem.select_project_id("1234 GARDINER LANE");

        await rem.click_on_Addnew_Record();

        await rem.select_tenant_name();

        await recurring_forms.select_start_date('Start Date ');

        await recurring_forms.select_frequency('frequency');

        await rem.enter_bill_code(1, 999);

        await rem.enter_bill_code_negative_amount(1.01, 999);

        await rem.enter_record_description();

        await rem.add_another_tenant();

        await rem.click_save_record();

        await rem.select_random_tenant_name();

        await recurring_forms.select_start_date('Start Date ');

        await recurring_forms.select_frequency('frequency');

        await rem.enter_bill_code(1, 999);

        await rem.enter_bill_code_negative_amount(1.01, 999);

        await rem.enter_record_description();

        await rem.add_another_tenant();

        await rem.click_save_record();

        await test.step(`Verify total batch amount is getting displayed on the total batch amount column)`, async () => {

            expect(await rem.verify_total_batch_amount()).toBeTruthy();

        });

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

    });

 

    test(` 2767472 - Verify total batch amount is getting displayed on the total batch amount column (All tenants amount summation)`, async () => {

        await rem.select_project_id("1234 GARDINER LANE");

        await rem.click_on_Addnew_Record();

        await rem.select_tenant_name();

        await recurring_forms.select_start_date('Start Date ');

        await recurring_forms.select_frequency('frequency');

        await rem.enter_bill_code(1, 999);

        await rem.enter_bill_code_negative_amount(1.01, 999);

        await rem.enter_record_description();

        await rem.add_another_tenant();

        await rem.click_save_record();

        await rem.select_random_tenant_name();

        await recurring_forms.select_start_date('Start Date ');

        await recurring_forms.select_frequency('frequency');

        await rem.enter_bill_code(1, 999);

        await rem.enter_bill_code_negative_amount(1.01, 999);

        await rem.enter_record_description();

        await rem.add_another_tenant();

        await rem.click_save_record();

        await test.step(`Verify total batch amount is getting displayed on the total batch amount column)`, async () => {

            expect(await rem.verify_total_batch_amount()).toBeTruthy();

        });

        let tenant_details_forms_page=await rem.get_tenant_details();

        console.log('Tenant Details Forms Page:', tenant_details_forms_page);

        approver_email = await rem.getEmailBasedOnText(`${random_approver}`)

        await rem.select_primary_approval(approver_email);

        random_secondary_approver = await recurring_forms.verify_form_secondary_approver(random_secondary_approver, random_approver);

        secondary_approver_email = await rem.getEmailBasedOnText(random_secondary_approver)

        await rem.select_secondary_approval(secondary_approver_email);

        await rem.add_attachment();

        await rem.select_accountant_email_id();

        await rem.click_button_approval_form(' Save As Draft ');

        let work_id = await rem.get_mbf_draft_work_id();

        await rem.click_button_approval_form(" Go to Dashboard ");

        await rem.dashboard_clickonviewAll_btn("Recurring Charges");

        await rem.enter_submitted_form_id(work_id);

        await test.step(`Verify total batch amount is getting displayed on the total batch amount column in Dashboard page)`, async () => {

            expect(await rem.verify_total_batch_amount_dashboard_page()).toBeTruthy();

        });

        let tenant_details_forms_filter_page=await rem.get_tenant_details_filtered_dashboard();

        console.log('Tenant Details Forms Filter Page:', tenant_details_forms_filter_page);

        const areMapsEqual = await rem.compare_total_batch_amount(tenant_details_forms_page,tenant_details_forms_filter_page);

        console.log(`Are Maps Equal: ${areMapsEqual}`);

        expect(areMapsEqual).toBe(true); // Adjust the expectation based on your test case 

 

 

    });

});

 