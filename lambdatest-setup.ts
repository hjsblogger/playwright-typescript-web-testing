/**
 * Add the file in your test suite to run tests on LambdaTest.
 * Import `test` object from this file in the tests.
 */

import * as base from "@playwright/test";
const { _android } = require("playwright");
import dotenv from 'dotenv';
dotenv.config();

/* Capabilities for S21 */
const CapsGalaxyS21 = {
  "LT:Options": {
    platformName: "Android",
    deviceName: "Galaxy S21",
    platformVersion: "12",
    isRealMobile: true,
    browserName: "Chrome",
    browserVersion: "latest",
    build: "[Build] Web Testing with Playwright on Galaxy S21",
    name: "[Name] Web Testing with Playwright on Galaxy S21",
    projectName: "[Project] Web Testing with Playwright on Galaxy S21",
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
    
  },
};

/* Capabilities for S23 Ultra */
const CapsGalaxyS23Ultra = {
  "LT:Options": {
    platformName: "Android",
    deviceName: "Galaxy S23 Ultra",
    platformVersion: "13",
    isRealMobile: true,
    browserName: "Chrome",
    browserVersion: "latest",
    build: "[Build] Web Testing with Playwright on Galaxy S23 Ultra",
    name: "[Name] Web Testing with Playwright on Galaxy S23 Ultra",
    projectName: "[Project] Web Testing with Playwright on Galaxy S23 Ultra",
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
  },
};

/* Modification of capabilities for dynamic updation of test names */
const modifyCapabilities = (capabilities, testName) => {
  capabilities["LT:Options"]["name"] = testName;
  return capabilities;
};

/* Heart of parallel testing - Parameterized test fixture */
const test = base.test.extend({
  page: async ({ playwright }, use, testInfo) => {
    const deviceCapabilities = testInfo.title.includes('Galaxy S21') 
      ? modifyCapabilities(CapsGalaxyS21, `${testInfo.title} - Galaxy S21`)
      : modifyCapabilities(CapsGalaxyS23Ultra, `${testInfo.title} - Galaxy S23 Ultra`);

    const deviceConnection = await _android.connect(
      `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(deviceCapabilities)
      )}`,
    );

    console.log(`Running tests on device: ${deviceCapabilities["LT:Options"].deviceName}`);

    await deviceConnection.shell("am force-stop com.android.chrome");

    let context = await deviceConnection.launchBrowser();
    let ltPage = await context.newPage();

    /* Use ltPage in the test */
    await use(ltPage);

    /* Capture test status and close connections */
    const testStatus = {
      action: "setTestStatus",
      arguments: {
        status: testInfo.status,
        remark: testInfo.error?.stack || testInfo.error?.message,
      },
    };

    await ltPage.evaluate(() => {},
      `lambdatest_action: ${JSON.stringify(testStatus)}`);
    
    /* Release resources */
    await ltPage.close();
    await context.close();
    await deviceConnection.close();
  },
});

export default test;