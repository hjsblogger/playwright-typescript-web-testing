/**
 * Add the file in your test suite to run tests on LambdaTest.
 * Import `test` object from this file in the tests.
 */

import * as base from "@playwright/test";
import path from "path";
const {_android} = require("playwright");
import dotenv from 'dotenv';
dotenv.config();

// LambdaTest capabilities
const capabilities = {
  // browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
  // browserVersion: "latest",
  "LT:Options": {
    platformName: "android",
    deviceName: "Galaxy S21 5G",
    platformVersion: "12",
    isRealMobile: true,
    browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    browserVersion: "latest",
    build: "Playwright Android Build",
    name: "Playwright android test",
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
    projectName: "New UI",
  },
};

// Patching the capabilities dynamically according to the project name.
const modifyCapabilities = (configName, testName) => {
  let config = configName.split("@lambdatest")[0];
  let [browserName, browserVersion, platform] = config.split(":");
  // capabilities.browserName = browserName
  //   ? browserName
  //   : capabilities.browserName;
  // capabilities.browserVersion = browserVersion
  //   ? browserVersion
  //   : capabilities.browserVersion;
  capabilities["LT:Options"]["platform"] = platform
    ? platform
    : capabilities["LT:Options"]["platform"];
  capabilities["LT:Options"]["name"] = testName;
  capabilities["LT:Options"]["build"] = "Demo: Playwright TypeScript on Real Android Device";
};

const test = base.test.extend({
  page: async ({ page, playwright }, use, testInfo) => {
    // Configure LambdaTest platform for cross-browser testing
    let fileName = testInfo.file.split(path.sep).pop();
    if (testInfo.project.name.match(/lambdatest/)) {
      modifyCapabilities(
        testInfo.project.name,
        `${testInfo.title} - ${fileName}`
      );

      let device = await _android.connect(
        `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
            JSON.stringify(capabilities))}`,
      );
  
      console.log(`Model:: ${device.model()}, serial:: ${device.serial()}`);
    
      await device.shell("am force-stop com.android.chrome");
    
      let context = await device.launchBrowser();
      let ltPage = await context.newPage();

      // const ltPage = await context.newPage(testInfo.project.use);
      await use(ltPage);

      const testStatus = {
        action: "setTestStatus",
        arguments: {
          status: testInfo.status,
          remark: testInfo.error?.stack || testInfo.error?.message,
        },
      };
      await ltPage.evaluate(() => {},
      `lambdatest_action: ${JSON.stringify(testStatus)}`);
      await ltPage.close();
      await context.close();
    } else {
      // Run tests in local in case of local config provided
      await use(page);
    }
  },
});

export default test;
