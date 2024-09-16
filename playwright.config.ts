import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

// Playwright config to run tests on LambdaTest platform and local
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 300000,
  use: {},
  projects: [
    // -- LambdaTest Config --
    // name in the format: browserName:browserVersion:platform@lambdatest
    // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    // Use additional configuration options provided by Playwright if required: https://playwright.dev/docs/api/class-testconfig
    {
      name: "Galaxy S21 5G:12:android@lambdatest",
      use: {
        viewport: { width: 360, height: 800 },
      },
    },
  ],
};

export default config;