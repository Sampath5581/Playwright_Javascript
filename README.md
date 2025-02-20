# Playwright Framework with Copilot

 

![CBRE_Logo](commons/images/readME_cbre_logo.png)

 

1. [Introduction](#introduction)

2. [Getting Started](#getting-started)

    * [Pre-requisites](#1-pre-requisites)

    * [Installing necessary Dependencies](#2-installing-necessary-dependencies)

    * [What is in the Playwright Framework?](#3-what-is-there-in-the-playwright-framework)

    * [How to start using the framework?](#4-how-to-start-using-the-framework)

    * [Managing Secrets](#5-managing-secrets)

    * [Posting Metrics](#6-posting-metrics)

    * [Email Test Report](#7-email-test-report)

    * [Running Tests](#8-running-tests)

    * [Running Tests in Docker](#9-running-tests-in-docker)

    * [Running Tests in ADO](#10-running-tests-in-azure-pipelines)

    * [Running Tests in Github](#11-running-tests-in-github-actions)

    * [Playwright with copilot](#12-playwright-with-copilot)

   

3. [Features](#13-features)

4. [Report Generation](#report-generation)

5. [Additional Documentation](#additional-documentation)

6. [Version](#version-10)

 

# Introduction

 

Playwright is lightweight framework for Automation Testing and Web Testing. Because of the light-weight framework and additional features like Headless test execution makes Playwright comparitively faster than other competitive Automation Testing tools.

 

Playwright allows testing in multiple browsers like Chromium, Firefox and Webkit. It has built-in cross-browser web automation which makes testing reliable and fast.

 

Additionally, Playwright has the capability to do mobile application testing on devices like Pixel 5, iPhone etc.

 

# Getting Started

 

## 1. Pre-requisites

 

Playwright Framework requires NodeJS installed in your machine.

To install NodeJS.

Navigate to the below URL and download the installer file based on your machine.

 

* [NodeJS](https://nodejs.org/en/download/)

 

Run the installer file and follow the necessary steps to install NodeJS.

 

To install VSCode (You can use your choice of code editor)

Navigate to the below URL and download VSCode  based on your machine.

 

* [VS Code](https://code.visualstudio.com/download/)

 

***

 

## 2. Installing necessary dependencies

 

Run the following commands in Command Prompt, Terminal or VS Code Terminal

 

```Shell

npm i

# install npm packages

npx playwright install --with-deps

# install necessary dependencies

```

 

Once the Playwright Framework is cloned and necessary dependenices are installed, you can start developing the test cases.

 

***

 

## 3. What is there in the Playwright Framework?

 

This Playwright Framework contains the following folders and files.

 

![Folder_Structure](commons/images/readME_folder_structure2.PNG)

 

### <u>commons</u>

 

Commons contains the images and files that we need to execute certain important functions. Files which are necessary to send email reports, post metrics to DevOps Portal and Database Connectivity are stored in commons.

 

To learn more about sending metrics to DevOps Portal click here - [Sending Metrics](#5-posting-metrics)

 

To learn more about Database Connectivity click here - [Sequelize](https://sequelize.org/)

 

### <u>screenshots</u>

 

Screenshots folder is the default location for screenshots taken during the test. It also contains necessary images required for the framework.

 

### <u>node-modules</u>

 

Node modules folder contains the dependencies that are installed such as playwright-core, csv-parser and so on.

 

### <u>pageObjects</u>

 

PageObjects folder contains the page elements of a particular page. It is structured in such a way that, all the locators of a certain page are stored in individual js files with the page name as file name.

 

### <u>playwright-report</u>

 

playwight-report folder contains the necessary files to display the report of the most recent run test. It contains an html file which by default opens in a browser when any test fails.

To see the report, run the below command in the terminal.

 

```Shell

npx playwright show-report

```

 

### <u>tests</u>

 

tests folder contains the actual test files that will be executed while running a test.

 

For example:

appLogin.spec.js file contains Login and different tests (verifying links, verifying sections etc) pertaining to DevX appication's Home page.

Similarly other files shall contain various other tests for other pages of the application.

 

### <u>utils</u>

 

utils folder contains necessary utilities that are requires for the framework. Here we are also storing the files which contain logging in information such as usernames and passwords.

 

***---***  PLEASE UPDATE THE 'secrets.json' and/or 'values.csv' and/or '.env' FILES WITH YOUR RESPECTIVE USERNAME AND PASSWORD VALUES.

 

### <u>playwright.config.js</u>

 

The Playwright Config files contains the configuration information that we need to run the tests. This is the file we need to execute to run the tests.

 

Information such as -

What reporters to be used? Whether to run in headless mode? Which browser to be used? How many retries should be performed? can all be configured in the Playwright Config file.

 

### <u>projectConfig.js</u>

 

The projectConfig file contains the necessary configurations required for the Playwright Framework. We can add/edit/remove key-value pairs to configure the framework. When adding new key-value pairs that are needed in the test files - please import projectConfig file using the below command.

 

```js

import { projectConfig } from '../projectConfig';

```

 

***

 

## 4. How to Start using the Framework?

 

### <u>a. Change the URL </u>

 

Open 'appLogin.spec.js' file inside tests folder. This is a sample test file that calls login method in pageObjects (LoginPage.Js).

 

Change the URL in the 'const' with your applications URL.

Each line in appLogin.Spec.Js has comments which explain the  code. We write our test cases in the spec.js files.

It is advised to write the test cases pertaining to a page in the application into one file.

For eg: There are 20 test cases in Home Page of an application. All test cases must be in one spec.js file titled appHome.spec.js

 

### <u>b. Capture Login Page Elements</u>

 

To use our Playwright Framework efficiently, we provided the Page Objects in a separate folder which contains all the locators of a page. We can then utilize this file to call the page objects into our test file.

 

Capture the page elements and their locators pertaining to your login page of the application and store them in the LoginPage.js file in pageObjects folder.

 

These page.locator elements are stored in a class called 'LoginPage'.

 

This works similarly for the Homepage. (change pageObjects in the HomePage.js file). Similarly page object of other pages of your application will go into their respective JavaScript files.

To learn more about PageObjects in Playwright, refer to - [Playwright POM](https://playwright.dev/docs/pom)

 

### <u>c. Login Method</u>

 

LoginPage class also contains the logging in method.

 

The 'MFASuppressedLogin' async block contains the steps performed to login to the application.

 

The 'loginFromCSVData' async block contains the same steps but it is for parsing the data from a CSV file.

 

### <u>d. Sample creation of 1st workflow</u>

 

* Writing the code: Writing the test case script using JavaScript is very simple in Playwright. To create tests edit spec files in the 'tests' folder to add tests according to test case requirements via code manually.

 

* To create test cases via Codegen:

Codegen is an in-built feature that Playwright Provides us which will automatically generate the code depending on the actions performed in the browser window.

 

### Record and Playback

 

To generate code, execute the below code in the terminal. (change the URL to your desired URL)

 

```Shell

npx playwright codegen {appURL}

# For example:

npx playwright https://www.cbre.com/

```

 

![RM_CodeGen](commons/images/readME_codegen.PNG)

Running this code opens two windows, a browser window and a 'Playwright Inspector' window. As you perform necessary actions in the browser window, a playwright test script is generated in the Playwright Inspector window. You can then copy-paste it to your 'tests' folder and run it as usual.

 

## 5. Managing Secrets

 

When executing tests which shall need secrets values to be input, it is advised to not keep sensitive information in the source code. To avoid this, we can pass secrets/sensitive information as environment variables.

 

1. Passing env variables in local.

 

    Based on the operating system and terminal you use to run the test scripts, you can set environment variables or provide sensitive information directly in the terminal.

 

    Examples:

 

    In Bash:

 

    ```bash

    USERNAMEVALUE={yourEmail}@cbre.com PASSWORDVALUE={yourPassword} npx playwright test

    ```

 

    In PowerShell:

 

    ```PowerShell

 

    $env:USERNAMEVALUE={yourEmail}@cbre.com

    $env:PASSWORDVALUE={yourPassword}

    npx playwright test

    ```

 

    In Batch:

 

    ```Batch

    set USERNAMEVALUE = {yourEmail}@cbre.com

    set PASSWORDVALUE = {yourPassword}

    npx playwright test

    ```

 

2. Passing env variables in CI/CD

 

    In Azure DevOps, you can create a variable group with the necessary key-value pairs.

 

    ![EnvVarGrp](commons/images/readMe_vargrp2.PNG)

 

    You can then use these values in the script as shown below-

 

    ```js

      await loginPage.MFASuppressedLogin(process.env.USERNAMEVALUE, process.env.PASSWORDVALUE);

    ```

 

    Additionally to run in the pipeline, you need to change the script as shown below-

 

    *** Based on the agent, you can run the script in any terminal. Remember to provide the env variables accordingly.

 

    ```yml

    - powershell: |

        $env:USERNAMEVALUE='$(USERNAMEVALUE)'

        $env:PASSWORDVALUE='$(PASSWORDVALUE)'

        npx playwright test

      displayName: 'Running Playwright Tests'

    ```

 

3. Using CryptoJS

 

    Alternatively you can use CryptoJS, which has been integrated with the newer Playwright Framework to store secrets in an encrypted way.

 

    To use this particular package, you first need to encrypt the sensitive information.

 

    To do this, simple run the below command-

 

    ```bash

    npm run encrypt "yourSecretUsername"

    npm run encrypt "yourSecretPassword"

    ```

 

    The terminal window will encrypt the value you have provided and gives you a key (encrypted).

 

    You can then copy the encrypted value and paste it in the 'testConfig.js' file under testConfig.

 

    ```js

      export const testConfig = {

          // This is YourSecretValue

        secretUsername : decryptPassword("yourSecretUsername_ENCRYPTED_USERNAME"),

        secretPassword : decryptPassword("yourSecretPassword_ENCRYPTED_PASSWORD"),

 

      }

    ```

 

    You can then use your encrypted value in your test file like below -

 

    ```js

    await loginPage.MFASuppressedLogin(testConfig.secretUsername, testConfig.secretPassword),

    ```

 

     This will decrypt the password and input the actual value while running the tests.

 

## 6. Posting Metrics

 

### Step 1: Naviagate to [DevOps Portal](https://devopsportal.cbre.com/)

 

![DevOps_Portal](commons/images/readMe_DOP.PNG)

 

### Step 2: Search for your Application

 

![Search_Application](commons/images/readMe_Overview_DOP.PNG)

 

### Step 3: Click on Auto Regression Test Gate

 

![AutoReg_Gate](commons/images/readMe_Gates_AutoReg.PNG)

 

### Step 4: Toggle to Metrics Snippet

 

![Mertics_Snippet](commons/images/readMe_Metrics.PNG)

 

### Step 5: Select 'Playwright' as the tool

 

![Playwright_Metrics](commons/images/readMe_MetricsSnippet.PNG)

 

### Step 6: Capture the Application ID

 

Enter your Application ID in the 'projectConfig.js' file.

 

Note: Application ID is a number (no quotation marks)

 

```js

export const projectConfig = {

  APP_NAME: 'Application Name',

  APP_ID: XXX, // Enter your application number here.

  SEND_METRICS: true,

}

```

 

### Cheking Metrics

 

We can confirm whether our metrics are being posted by navigating to Auto Regression Gate in DevOps Portal.

 

![Metrics](commons/images/readMe_AutoRegMetrics.PNG)

 

## 7. Email Test Report

 

To send email reports of your Playwright Tests. Navigate to 'projectConfig.js' file and add the specific email addresses in the 'MAIL_LIST'.

 

```js

export const projectConfig = {

  APP_NAME: 'Application Name',

  SEND_EMAIL: true,

  MAIL_LIST: 'john.doe@cbre.com',

}

```

 

## 8. Running Tests

 

To run the tests, execute the following command.

 

```Shell

npx playwright test

```

 

This executes all the tests present in the tests folder.

 

To execute only a single test file. You can run the same command followed by the test file name.

 

```Shell

npx playwright test appLogin.spec.js

```

 

[Learn more about running tests with other options](https://playwright.dev/docs/running-tests)

 

## 9. Running Tests in Docker

 

Playwright provides a pre-built docker image which can be used to run our end-to-end test scripts.

 

[Learn about Playwright Docker](https://playwright.dev/docs/docker)

 

### Pre-requisites

 

Ensure that docker is installed and is up and running.

 

### Pull the Docker Image

 

Playwright Docker image is published in Docker Hub and can be accessed by clicking [here](https://hub.docker.com/_/microsoft-playwright)

 

Run the below command to pull the docker image.

 

```shell

docker pull mcr.microsoft.com/playwright:v1.30.0-focal

```

 

Run the below command to run the docker image.

 

```shell

docker run --rm -it -v ${PWD}:/tests -w /tests --ipc=host mcr.microsoft.com/playwright:v1.30.0-focal /bin/bash

```

 

Once we are connected to the root, we can run our end-to-end test cases.

 

![Docker_Playwright](commons/images/readMe_Dock-Play.png)

 

## 10. Running Tests in Azure Pipelines

 

The root folder of this template contains a 'azure-pipelines.yml' file.

 

```yml

name: Playwright Automation

trigger:

  - master

jobs:

  - job: All_Tests

    timeoutInMinutes: 60

    pool:

      name: #Your_Agent_Name

    steps:

      - task: NodeTool@0

        inputs:

          versionSpec: "16.x"

        displayName: "Install Node.js"

 

      - script: |

          npm ci

        displayName: "Install npm packages"

 

      - script: |

          npx playwright install --with-deps

        displayName: "Install necessary dependencies"

 

      - script: |

          npx playwright install chrome

        displayName: "Installing Chrome"

        # if chrome is already installed on the agent, you can skip this.

        # if pipeline fails on this task, try using force flag.

 

      - script: |

          npx playwright test

        displayName: "Run all test cases."

       

      - task: PublishTestResults@2

        condition: succeededOrFailed()

        inputs:

          testRunner: JUnit

          testResultsFiles: '**/reports/XMLReport.xml'

          mergeTestResults: true  

 

      - publish: $(System.DefaultWorkingDirectory)/playwright-report

        artifact: playwright-report

        condition: always()

```

 

You can also edit the pipeline with the below code to use Dockerfile.

 

```yml

name: Playwright Automation

trigger:

- master

 

jobs:

  - job: Build

    condition: succeededOrFailed()

    pool:

      name: #Your_Agent_Name

    steps:

      - template: docker_build.yml

 

      - task: PublishTestResults@2

        condition: succeededOrFailed()

        inputs:

          testRunner: JUnit

          testResultsFiles: '**/reports/XMLReport.xml'

          mergeTestResults: true

       

      - publish: $(System.DefaultWorkingDirectory)/playwright-report

        artifact: playwright-report

        condition: always()

     

      - template: docker_prune.yml

```

 

To Learn more about running Playwright Test in Azure Pipelines. Click here - [Azure Pipelines](https://playwright.dev/docs/ci#azure-pipelines)

 

## 11. Running Tests in GitHub Actions

 

In the root folder of the application, create a '.github/workflows' folder. Inside the workflows, create a 'tests.yml' file  and add the below code.

 

```yml

# This is a basic sample workflow that is automatically triggered or when pushed to main

on:

  push:

    branches:

      - main  # Please add the name of the branch you want the GitHub Actions to run on when you push updated code.

     

jobs:

  e2e-tests:

    runs-on: windows-latest

 

    steps:

      - uses: actions/checkout@v2

      - uses: actions/setup-node@v2

        with:

          node-version: "18.x"

      - uses: microsoft/playwright-github-action@v1

     

      - name: Install Playwright Browsers

        run: npx playwright install --with-deps

     

      - name: Install dependencies and run tests

        run: npm install && npx playwright test

     

      - uses: actions/upload-artifact@v2

        if: always()

        with:

         name: playwright-report

         path: playwright-report/

         retention-days: 30

     

      - name: Publish Test Results

        uses: EnricoMi/publish-unit-test-result-action/composite@v2

        if: always()

        with:

          files: |

            reports/XMLReport.xml

```

 

To Learn more about running Playwright Test in GitHub Actions. Click here - [GitHub Actions](https://playwright.dev/docs/ci#github-actions)

 

## 12. Playwright with copilot

By Using Copilot prompts from template we will get code suggestions based on instructions provided.

 

Code suggestions: Copilot can provide helpful code suggestions as developers type, potentially saving time and reducing errors by offering commonly used code snippets or even entire functions.

 

Assistance with complex tasks: When working on complex tasks or unfamiliar languages/frameworks, Copilot can offer guidance and examples, helping developers understand and implement solutions more efficiently.

 

Learning tool: Copilot can serve as a learning tool by demonstrating best practices, coding patterns, and techniques, thereby helping developers improve their skills and expand their knowledge base.

 

Prototype development: For prototyping or exploring ideas, Copilot can quickly generate code snippets that developers can iterate upon, accelerating the development process.

 

Code completion: Copilot can provide intelligent code completion suggestions based on the context of the code being written, making it easier for developers to write code faster and with fewer mistakes.

 

Language translation: Copilot can translate code snippets from one programming language to another, making it easier for developers to work in multiple languages or migrate codebases.

 

# How to configure Copilot to VS code.

Request copilot access from https://devx.cbre.com/toolbox/99  once you got copilot licence login to GitHub from Vs code authorize copilot and copilot will be enabled in your VS code

Add copilot extension from VS code extensions

Copilot instructions : https://cbre.sharepoint.com/sites/intra-TS-DevOpsCoE/SitePages/Github---CoPilot.aspx

 

# Test script authoring

## To develop e2e UI work flow the user will have to fallowing steps  in your test spec files respectively .

To Call required libraries Playwright

Describe the test and specific test case information

Those tasks can be performed by calling copilot prompts (All the prompts in this readme file had been curated by DevOps as a service team)

1. // declare a const test from Playwright.

2. // Test describe

3. // Test cases

# Prompts usage, curate and contribution

```

Sample Prompts for Manual test case design :

Prompts for Manual test case design 1 from a user story:

Create a manual test case in a table format with the following columns:

 

Title : A brief description of what the test steps is trying to achieve based on Action

Action: The specific action the tester will perform.

Expected Result: The anticipated outcome of the testers action.

 

User Story: User should be able to launch cbre.com and verify the website title includes "CBRE".

```

 

```

Prompts for Automated test script from manual test case

Create a playwright script for above manual test case with pass and fail conditions with below instructions

1.Declare a Const test from Playwright

2.test describe as "CBRE Home page Verification"

```

 

```

prompts for Automated test script 2

Objective: Create a Playwright script that automates interactions with the CBRE website and verifies functionalities.

 

Functionality:

  Declare a Const test from Playwright

  test describe as "CBRE Home page Verification"

  Launch the CBRE website at https://www.cbre.com/.

  Optional: If a "Accept All Cookies" button exists, click it. Handle potential absence of the button gracefully.

  Click on the link with text "Offices".

  Verify that the page redirects to a URL containing "/offices".

  ```

 

```

prompt for refining the test case

Create a manual test case in a table format with the following columns for above playwright script

 

Title : A brief description of what the test steps is trying to achieve based on Action

Action: The specific action the tester will perform.

Expected Result: The anticipated outcome of the tester's action

```

 

```

Prompts for test design :

 

// launch cbre application https://www.cbre.com/

// Click on button has-text Accept All Cookies

// Click on Offices link

// validating url redirecting to /offices

```

``` JS

Following is an example  for an external facing application  without using SSO .

// launch cbre application https://www.cbre.com/

// Click on button has-text Accept All Cookies

// Click on offices link

// verify page redirected to /offices

 

// declare const for test from playwright

const { test, expect } = require('@playwright/test');

  ```

 

  ```

 Sample prompts for Automated test script 3

  Objective: Create a Playwright script that automates interactions with the DEVX website and verifies Information Exchange functionalities.

 

 Functionality:

    Declare a Const test from Playwright

    test describe as "DEVX Information exchange verification"

    launch a browser context with httpcredentials

    navigate to page

    navigate to the url 'https://uat.devx.cbre.com/'

    Click on Sign In

    Handle popup

    Enter username on the popup

    Click on Next in popup

    wait for Information Exchange

    Click on Information Exchange

    click on Post your question

    Input Question Title

    Input Details

    enter test in tags

    Press Enter

    Click on Post Your Question

 

  ```

 

 ```

 Sample prompt for refining the test case

 Create a manual test case in a table format with the following columns for above playwright script

    Title : A brief description of what the test steps is trying to achieve based on Action

    Action: The specific action the tester will perform.

    Expected Result: The anticipated outcome of the tester's action

```

```

Sample prompt for defining a function

Objective : Define a function name it as loginToApplication that takes two parameters: page and popup.

Functionality:

    1. Fill in the username field in the popup.

    2. Use SSO handle logic

    3. Fill in the password field in the popup.

    4. Click on the "Sign In" or "Submit" button in the popup.

    5. Wait for the navigation to complete.

    6. Get the storage state of the page.

    7. Return the storage state.

```

```

Sample prompt for script creation by importing specific pages

Objective: Create a Playwright script that automates interactions with the DEVX website and verifies Software Templates functionalities.

 

Functionality:

  1. Declare a Const test from Playwright

  2. Import testConfig from testConfig

  3. test describe as "DEVX Software Template"

  4. launch a browser context with httpcredentials

  5. navigate to page

  6. navigate to the url 'https://uat.devx.cbre.com/'

  7. Click on Sign In

  8. Handle popup

  9. Create a Instance for Login Page.

 10. Enter username on the popup

 11. Click on Next in popup.

 12. Mouse over Reusable Code/API

 13. Click On Software Templates

 14. Verify page redirected to /software-templates

```

```

Sample prompt for script creation for API test

Objective: Create a Playwright script that automates API actions with request fixture for below functionality.

Functionality:

1. declare const for test from playwright

2. declare const and parse the data from the JSON file

3. Read Json from "../utils/API_Data/data.json"

4. test describe as “API REquest”

5. test case for Post Request to ‘/api/users’

6. Assign stringyfied JSON to a variable

7. Set attribute value in JSON

8. Post request

9. verify the response is Ok

10. Verify the status code

11. Store the id in a variable

```

 

``` JS

Following is an example  for an external facing application  without using SSO .

// launch cbre application https://www.cbre.com/

// Click on button has-text Accept All Cookies

// Click on offices link

// verify page redirected to /offices

 

// declare const for test from playwright

const { test, expect } = require('@playwright/test');

 

// test describe

test.describe('CBRE', () => {

 

    // test case

    test('CBRE', async ({ browser }) => {

 

        // launch browser context

        const context = await browser.newContext();

 

        // open new page

        const page = await context.newPage();

 

        // navigate to url

        await page.goto('https://www.cbre.com/');

 

        // Click on button has-text "Accept All Cookies"

        await page.click('button:has-text("Accept All Cookies")');

 

        // Click on offices link

        await page.click('text=Offices');

 

        // verify page redirected to /offices

        await expect(page.url()).toBe('https://www.cbre.com/offices');

    })

})

```

```JS

Following is an example for an internal facing application  with SSO .

// launch a browser context with httpcredentials

// navigate to page

// navigate to the url 'https://uat.devx.cbre.com/'

// Click on Sign In

// Handle popup

// Enter username on the popup

// Click on Next in popup

// wait for Information Exchange

// Click on Information Exchange

// click on Post your question

// Input Question Title

// Input Details

// enter test in tags

// Press Enter

// Click on Post Your Question

// declare const for test from playwright

const { test, expect } = require('@playwright/test');

 

// import testConfig from testConfig.js

const { testConfig } = require("../testConfig");

 

// test describe

test.describe('DevX', () => {

    // test case

    test('DevX', async ({ browser }) => {

        // launch browser context with httpcredentials

        const context = await browser.newContext({

            httpCredentials: {

                username: testConfig.username,

                password: testConfig.password,

            }

        });

 

        // open new page

        const page = await context.newPage();

 

        // navigate to url

        await page.goto('https://uat.devx.cbre.com/');

 

        // Click on Sign In

        await page.click('text=Sign In');

 

        // Handle popup

        const [popup] = await Promise.all([

            page.waitForEvent('popup'),

        ]);

 

        // Enter username on the popup

        await popup.fill('input[name="loginfmt"]', testConfig.username);

 

        // Click on Next in popup

        await popup.click('text=Next');

 

        // wait for Information Exchange

        await page.waitForSelector('text=Information Exchange');

 

        // Click on Information Exchange

        await page.click('text=Information Exchange');

 

        // click on Post your question

        await page.click('text=Post your question');

 

        // Input Question Title

        await page.fill('input[name="title"]', 'Test Question');

 

        // Input Details

        await page.fill('textarea[name="details"]', 'Test Details');

 

        // enter test in tags

        await page.fill('input[name="tags"]', 'test');

 

        // Press Enter

        await page.press('input[name="tags"]', 'Enter');

 

        // Click on Post Your Question

        await page.click('text=Post Your Question');

 

    });

})

```

```js

Following is the example Prompts for DB

// declare const for test from playwright

// declare variable dbname

// declare variable query

// declare variable colName

// execute query

// validate Prashanth is active or not in DB and return the result

 // test case for DB

    test('DB', async ({  }) => {

 

        // declare variable dbname

        var dbname = "postgres";

 

        // declare variable query

        var query = `SELECT * from employee where id = 1`;

       // declare variable colName

        var colName = "isactive";

        // execute query

        var result = await executeQuery(dbname, query, colName);

        // validate result

        console.log(result);

        expect(result).toBe('N');

 

})

```

```js

Following is the example Prompts for API Test

// declare const for test from playwright

// declare const and parse the data from the JSON file

//test describe

// test case for Post Request

// Assign stringyfied JSON to a variable

// Set attribute value in JSON

// post request

// verify the response is Ok

// verify the status code

// strore the id in a variable

// get request

// declare const test from '@playwright/test';

const { test, expect } = require('@playwright/test');

// declare const and parse the data from the JSON file

const data = JSON.parse(JSON.stringify(require('../utils/API_Data/data.json')));

// import { request } from '@playwright/test';

 

test.describe('API Test', () => {

 

    // test case for POST request

    test('API Test', async ({ request }) => {

        // Assign stringyfied JSON to a variable

        let jsonString = data;

               

        // Set attribute value in JSON

        jsonString.name = 'Anik3';

       

        // Convert JavaScript object back to JSON

        let jsonFinal = JSON.stringify(jsonString);

        console.log(jsonFinal);  

 

        // post request

        const response = await request.post("/api/users", jsonFinal);

        const responseBody = await response.json();

        console.log(responseBody);

       

        // Log the id

        console.log("Response:"+responseBody.id);

        console.log("createdAt:"+responseBody.createdAt);

        // strore the id in a variable

        let id = responseBody.id;

 

    });

}

);

```

```

Sample prompt for defining a function verifydropdownvalues

 Define a function verifydropdownvalues that takes two parameters: expectedValues (a list) and dropdown.

Inside the function, perform the following steps:

1.Click on the dropdown.

2. Get all elements from the dropdown.

3.Assign the length of the elements to a variable length.

4. Loop through all the elements.

5.For each element, check if it is in expectedValues.

 

```

```js

async function verifydropdownvalues(expectedValues, dropdown) {

    await dropdown.click();

    await setTimeout(3000);

    let dropdownAll = await this.page.$$("//mat-option[@role='option']");

    let dropdownValuesCount = await dropdownAll.length;

    console.log("Number of dropdown values are : " + dropdownValuesCount);

    const dropdownValues = [];

    for (let i = 0; i < dropdownValuesCount; i++) {

      let value = await dropdownAll[i].textContent();

      dropdownValues.push(value);

    }

    console.log("Dropdown values:" + dropdownValues);

    console.log("Expected values:" + expectedValues);

    expect(expectedValues).toEqual(dropdownValues);

  }

```

# Sample Prompts for Page Object Model

```

1. Prompt for Variable declaration :

  define variables {test, expect} to use test and expect from playwright using {keyword}

  {keyword}: const

 

2. Prompt for import modules with multiple  variables from directory :

  In separate lines, import modules {variables} using {keyword} to use from {directory}

  {keyword}: const

  {variables}: variable1,variable2,variable3

  {directory}: pageObjects/constants

 

3. Prompt to read a dotenv file from the .env file in the utils directory using the require keyword:

  Read dotenv file from .env file in utils directory using {keyword}

  {keyword}: require

 

4. Prompt to define the variable data to read from the utils/secrets.json file using the const keyword:

  define variable {variable} using {keyword} to read from {file_path}

  {keyword}: const

  {variable}: data

  {file_path}: utils/secrets.json

 

5. Prompt to define the reusable_variables using the let keyword.

  define reusable variables {reusable_variables} using {keyword}

  {keyword}: let

  {reusable_variables}: webcontext, page, context, loginPage, basePage

 

6. Prompt to define a test.beforeAll hook with a browser fixture and initialise a BasePage class using it. Then, define a test.describe block to create a  “Smoke Test” test suite.

  define test.beforeAll hook with browser fixture and initialize BasePage class using it

      define test.describe block to create a {test_suite_name} test suite

      {test_suite_name}: Smoke Test

 

7. Prompt to define before all and after all for Login to application and Close context after each test

  define variable userName and password using const keyword to get username of {user} from secrets.json file and password of {password} from dotenv file

      {user}: admin

      {password}: password

      define test.beforeEach hook inside test.describe block to execute before each test case

      add code {testCaseFlow} to test.beforeEach hook

      {testCaseFlow}:

          create a new context using createNewContext function from BasePage class using userName, password and constants.TRUE as arguments.

          create a new page using createNewPage function from BasePage class using context as argument.

          create a new instance of LoginPage class using page and test as arguments.

          login to application using loginApp function from LoginPage class using userName as argument.

          create a new instance of LoginPage class using page

    define test.afterEach hook inside test.describe block to execute after each test case

      add code {closeContext} to test.afterEach hook

      {closeContext}:close the context using close function.

 

8. Prompt to define test case based on Page Objective model (POM)

  define a test case {testCase} inside test.describe block to using below {test_steps}

      {testCase}: Validate user is navigated to Activate EMEA page

    {test_steps}:

      1. search an opportunity using searchsearchTextInSearchBox function from TrackerPage class using searchText as argument

      2. click on matching opportunity number using clickOnOpportunityNumber function from TrackerPage class using opportunityNumber as argument

        3. define waitUntilActivateEMEAPageIsLoaded function in ActivateEMEAPage class to wait until Activate EMEA page is loaded.

        4. In TrackerPage class validate user is navigated to activate EMEA page using waitUntilActivateEMEAPageIsLoaded function from ActivateEMEAPage class.

 

9. Prompt for define a function

  Objective : Define a function name it as loginToApplication that takes two parameters: page and popup.

  Functionality:

        1. Fill in the username field in the popup.

        2. Use SSO handle logic

        3. Fill in the password field in the popup.

        4. Click on the "Sign In" or "Submit" button in the popup.

        5. Wait for the navigation to complete.

        6. Get the storage state of the page.

        7. Return the storage state.

 

10. Prompt for define a test case for Soap API POST

Objective :  Define the test suite 'API Testing' using test.describe.parallel

define variables {test, expect} to use test and expect from playwright using {keyword}

{keyword}: const

define variable {variable} using {keyword} to read from {file_path}

  {keyword}: const

  {variable}: data

  {file_path}: ./utils/apiHeaders.js

define a test case 'SOAP API Test' inside the test suite.

define the constants {variables}

{variables}:originSys, targetSys

 define the variables soapApiEndpoint and apiHeaders.

{testCaseFlow}:  

  Call generateApiHeaders function with originSys and targetSys as arguments and assign the result to apiHeaders.

  Define the paths xmlRequestFilePath and expectedResponseFilePath to the XML request and response files respectively.

  Read the XML request body from the file and assign it to soapRequestBody.

  Read the expected response from the file and assign it to expectedResponse.

  Define the API endpoint currentEndPoint.

  Send a POST request to the SOAP API endpoint with apiHeaders and soapRequestBody as request headers and data respectively. Assign the response to response.

  Get the response text and assign it to actualResponse.

  Assert that the response status is 200.

  Assert that the actualResponse equals expectedResponse.

 

```

 

# Test Execution

```bash

 npx playwright test ${filename}

```

 

# Parallelize tests in a single file

By default, tests in a single file are run in order. If you have many independent tests in a single file, you might want to run them in parallel with test.describe.parallel().

 

Note that parallel tests are executed in separate worker processes and cannot share any state or global variables. Each test executes all relevant hooks just for itself, including beforeAll and afterAll.

```JS

import { test } from '@playwright/test';

 

test.describe.parallel("Example Desxription"() => {

 

test('runs in parallel 1', async ({ page }) => { /* ... */ });

test('runs in parallel 2', async ({ page }) => { /* ... */ });

 

});

```

Alternatively, you can opt-in all tests into this fully-parallel mode in the configuration file:

 

```JS

import { defineConfig } from '@playwright/test';

 

export default defineConfig({

  fullyParallel: true,

});

```

# Test execution based on Tags(Intelligent execution)

If you want to perform risk based testing and tag test cases that are more crucial for certain release then , with this feature you can tag your tests as @critical/@high/@medium/@low.

 

To tag a test, either provide an additional details object when declaring a test, or add @-token to the test title. Note that tags must start with @ symbol.

 

```js

import { test, expect } from '@playwright/test';

 

test('test login page', {

  tag: '@smoke',

}, async ({ page }) => {

  // ...

});

 

```

You can also tag all tests in a group or provide multiple tags:

 

```js

import { test, expect } from '@playwright/test';

 

test.describe('group', {

  tag: '@report',

}, () => {

  test('test sample 1', async ({ page }) => {

    // ...

  });

 

  test('test sample 2', {

    tag: ['@smoke', '@High'],

  }, async ({ page }) => {

    // ...

  });

});

```

You can now run tests that have a particular tag with --grep command line option.

 

```bash

npx playwright test --grep @smoke

```

Or if you want the opposite, you can skip the tests with a certain tag:

 

```bash

npx playwright test --grep-invert @smoke

```

To run tests containing either tag (logical OR operator):

```bash

npx playwright test --grep "@tag1|@tag2"

```

Or run tests containing both tags (logical AND operator) using regex lookaheads:

 

```bash

npx playwright test --grep "(?=.*@high)(?=.*@medium)"

```




# Test Execution in debug

```bash

 npx playwright test ${filename}  --debug

```

![alt text](image.png)

 Use click on  step over arrow to continue each step.

 

 # Test case Generation using Copilot

 1) Place the cursor on .spec file which we need to generate test cases

 2) Go to Copilot Chat from Vs Code and enter below Prompt

```

Convert test script into manual test case in tabular format

 

```

 

## 13. Features

 

### <u>HTTP Authentication</u>

 

Browser level HTTP Authentication method (MFALogin) is added to the CBRE Playwright Template in order to cater to the login to the applications with MFA active accounts.

Simply, use the below function while logging in.

 

```js

await loginPage.MFALogin(data.userNameValueSSO);

```

 

### <u>Emailer</u>

 

New version of CBRE Playwright Template contains Email feature, where our test cases and their results are consolidated and sent to us after our test scripts are executed.

 

**To generate accurate reports use 'test.describe'**

 

For example:

 

```js

test.describe('Test_CodeGen', () => {

  test('Test Case', async ({ page }) => {

    await page.goto('https://www.cbre.com/');

    await page.getByRole('link', { name: 'Offices' }).click();

    await page.getByRole('link', { name: 'Explore all US Offices' }).click();

    await page.getByRole('button', { name: 'Tennessee' }).click();

    await page.getByRole('button', { name: 'Texas' }).click();

  });

});

```

 

![Email_Snippet](commons/images/readMe_email_snippet.PNG)

 

### <u>Posting Metrics</u>

 

We can post test metrics to CBRE DevOps Portal by using postMetrics feature. This ensures that the Auto Regression Gate is compliant for the respective application.

 

To accurately post metrics, follow the steps provided [here](#5-posting-metrics)

 

***---***  PLEASE DOUBLE-CHECK YOUR APPLICATION ID

 

### Record Playback

 

Please check out [Codegen](#record-and-playback)

 

### <u>Auto-wait</u>

 

Playwright has a in-built auto-wait feature which will wait for a certain locator to become available to perform an action.

For Example:

 

```js

const { test, expect } = require('@playwright/test');

 

test('Click on Offices', async ({ page }) => {

  await page.goto('https://www.cbre.com/');

  await page.click('//a[text()="Offices"]');

  }

);

```

 

In this test, a browser opens and navigates to '<https://www.cbre.com/>'. It then waits for the particular locator to become available and then click on it.

However, if you want to manually configure the wait times, you can change the timeout for the test duration and expect function in the config file.

 

### <u>Retries </u>

 

If a test fails, Playwright will try to execute the test again given how many retries are provided in the config file.

Retries option takes number value.

 

### <u>Traces </u>

 

Traces is a beautiful feature that Playwright provides. When opened, it displays a timeline of the test (pictures) with the code that is executed. Additionally it also contains the screenshots of each steps before and after that particular code is executed.

 

### <u>How to parse data from JSON, CSV?</u>

 

In our Playwright Framework, you can parse data from a JSON file as well as CSV file.

 

* Using JSON to parse data.  

 

Utils folder contains a JSON file from which we parse Username and Password into out test. While running a test, we use JSON.parse to parse the required data into a constant called 'data'.

We then use this data to get the values into the username and password fields respectively.

To do that, we run an async block containing the steps required for logging in. (Check LoginPage class & MFASuppressedLogin async block). The below code takes data from the JSON file.

 

```js

await loginPage.MFASuppressedLogin(data.userNameValue, data.passwordValue);

```

 

If MFA non-suppressed account is used to login, we can use the below function.

 

```js

await loginPage.MFALogin(data.userNameValue, data.passwordValue);

```

 

* Using ENV Variables.  

 

Utils folder also contains '.env' file which can be populated with necessary information such as login information, URLs, environment details and so on. We can then use process.env to use these environment variables.

 

```js

await loginPage.MFALogin(process.env.userNameValue, process.env.passwordValue);

```

# Environment variables for Azure Pipelines:

To add variables to the Azure Pipelines library, follow these steps:

 

1. Sign in to your Azure DevOps organization and go to your project.

2. Select 'Pipelines' from the left-hand menu, and then select 'Library'.

3. In the Library page, click on '+ Variable group'.

4. In the 'Variable group' page, provide a name for your variable group in the 'Variable group name' field.

5. Click on '+ Add' to add a new variable.

6.  Provide the name and value for your variable. If you want to secure the value of the variable (for example, if it's a password or a secret), check the 'Keep this value secret' box.

7. Click on 'Save' to save your variable group.

Now, you've successfully added variables to the Azure Pipelines library. You can link this variable group to your pipeline to use these variables.

 

###  Defining environment variables in the pipeline YAML file:

  ```yaml

  steps:

    - script: echo $(myVariable)

  env:

    myVariable: 'my value'

 

  ```

  In this above example, myVariable is an environment variable that is set to 'my value'. You can use this variable in your scripts and tests by referencing it as $(myVariable).

### Defining environment variables in the pipeline settings:

You can also define environment variables in the pipeline settings. To do this:

 

Go to your pipeline in Azure DevOps.

Click on 'Edit'.

Click on the 'Variables' tab.

Click on '+ Add'.

Enter the name and value of your variable.

Click on 'OK'.

Once you've defined your environment variables, you can use them in your scripts and tests by referencing them as $(variableName).

 

* Using CSV to parse data.  

 

Similarly, Utils folder also contains values.csv file which contain the necessary information required to login.

'loginFromCSVData' async block parses data from CSV into out test to the username and password field. The below code takes the data from the CSV file.

 

```js

await loginPage.loginFromCSVData();

```

 

## Report Generation

 

Playwright by defaults generates HTML report which can be viewed in the browser window. However, there are multiple formats in which you can generate Playwright Test Reports.

 

* Reporters

  * List

  * Line

  * Dot

  * HTML

  * JSON

  * JUnit

 

Snippet of HTML Report  

 

![Snippet of HTML Report](commons/images/readME_HTML_report.PNG)  

 

Snippet of XML Report published in Azure Pipelines  

 

![Snippet of XML Report published in Azure Pipelines](commons/images/readME_XML_report.PNG)

 

[Learn more about Playwright Reporters](https://playwright.dev/docs/test-reporters)

 

## API Automation

 

Playwright can be used to get access to the REST API of your application.

 

Sometimes you may want to send requests to the server directly from Node.js without loading a page and running js code in it. A few examples where it may come in handy:

 

Test your server API.

Prepare server side state before visiting the web application in a test.

Validate server side post-conditions after running some actions in the browser.

All of that could be achieved via APIRequestContext methods.

 

  ### <u>Configuration</u>

  API requires authorization, so we'll configure the token once for all tests. While at it, we'll also set the baseURL to simplify the tests. You can either put them in the playwright configuration file using the project configuration

 

```js

  import { defineConfig } from '@playwright/test';

  export default defineConfig({

  use: {

    // All requests we send go to this API endpoint.

    baseURL: 'https://api.github.com', //Your API Endpoint

    extraHTTPHeaders: {

      // We set this header per GitHub guidelines.

          // 'Accept': 'application/vnd.github.v3+json',* use when needed

      // Add authorization token to all requests.

      // Assuming personal access token available in the environment.

      'Authorization': `token ${projectConfig.API_Token}`,

    },

  }

});

```

 

Creating APIdata fixure

```js

const base = require('@playwright/test');

exports.test = base.test.extend({

        API_01: {

            testdata: {

                data: {

                    //Your API request body to be placed here

                }

            }

        }

    })

  ```  

 

Creating API tests

```js

const { customtest } = require('../APIdata');//pass the path of your APIdata fixture js

//import fixture

 

test("API_01: API test", async ({ request, API_01 }) => { //API_01 is the reference for fixture data

        const response = await request.post("/path", API_01.testdata); //API_01.testdata refers to the body key need to be passed for API request.

        const responseBody = await response.json();

        console.log(responseBody);

        expect(response.ok()).toBeTruthy();

        expect(response.status()).toBe(200);

    });

```

 

## Additional Documentation

 

[Playwright Documentation](https://playwright.dev/docs/intro)

 

***

## Version -v3.0.9

* Added new prompts for functions and test script generation for Page Object Model and Soap API Test.

* Added steps for Tag based execution.

* Added new reusable methods for API Token generation.

 

## Version -v3.0.8

* Added new prompts for functions and test script generation.

* Added .env example and updated azure-pipeline.yaml

 

## Version -v3.0.7

 

* update playwright to 1.42.0

* Added UI and API script using copilot Prompts

 

## Version -v3.0.6

 

* update playwright to 1.38.0

* API Testing sample file and usage

* Use of fixtures for data for tests.

 

## Version - v3.0.5 (Latest Jun 6th, 2023)

 

* E-mailable report enhancement

* Variables Group for storing secrets (Pipeline Execution)

* Encryption/Decryption for secrets and Decryption

* testConfig for Secrets

* Minor Fixes

 

## Version - v3.0.4 (May 18th, 2023)

 

* Minor Fixes

 

## Version #3.0.3 (May 2023)

 

* Environment Variables - Local, CI/CD

* Encryption/Decryption of Sensitive Information

 

## Version #3.0.2 (April 2023)

 

* Dependency Updates

* Removed HTML report publish from pipeline

* Publish XML and JSON report

 

## Version #3.0 (March 2023)

 

* Database Connectivity

* Project Configuration

* Email Template Updated

* GitHub Actions workflow

 

## Version #2.0 (February 2023)

 

* Emailer

* Metrics

* MFALogin

* Docker

 

## Version #1.0

 

* Login MFASuppressed

* Retries

* Traces

* CSV Parser

 

***
