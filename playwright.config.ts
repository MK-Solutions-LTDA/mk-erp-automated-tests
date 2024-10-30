import { defineConfig, devices } from "@playwright/test";
require("dotenv").config();

export default defineConfig({
  timeout: 90 * 1000,
  testDir: "tests/",
  fullyParallel: true,
  workers: 5,
  reporter: [['html', { printSteps: true }]],

  // use: {
  //   video: {
  //     mode: "on",
  //     size: { width: 1920, height: 1080 }
  //   },
  //   launchOptions: {
  //     args: ["--start-maximized"],
      
  //   },
    
  //   screenshot: "on",
  // },

  projects: [
    {
      name: "chromium",
      use: {
        // ...devices["Desktop Chrome"],
        // channel: 'chrome',
        // viewport: { width: 1920, height: 1080 },
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
});
