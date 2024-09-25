import test from '../lambdatest-setup';
import { expect } from "@playwright/test";

test.describe.parallel('Test on multiple devices', () => {

  /* Parameterization of the tests */
  /* Devices across which the tests have to be run */
  ['Galaxy S21'].forEach(device => {
    
    test(`${device} testing`, async ({ page }) => {
      await page.goto('https://duckduckgo.com')
      let element = await page.locator("[name=\"q\"]");
      await element.click();
      await element.type("LambdaTest");
      await element.press("Enter");
      const title = await page.title()

      console.log("Page title:: ", title);
      /* Use the expect API for assertions provided by playwright */
      expect(title).toEqual(expect.stringContaining("LambdaTest"));
    });
  });
});