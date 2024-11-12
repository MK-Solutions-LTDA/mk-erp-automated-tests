import { defineConfig, devices } from "@playwright/test";
require("dotenv").config();

export default defineConfig({
  timeout: 90 * 1000,
  testDir: "testes/",
  fullyParallel: true,
  workers: 5,
  reporter: [['html', { printSteps: true }]],
  retries: 2,
  use: {
    launchOptions: {
      args: ["--start-maximized"],
    },
  //   video: {
  //     mode: "on",
  //     size: { width: 1920, height: 1080 }
  //   },  
  //   screenshot: "on",
  },

  projects: [
    {
      name: "chromium",
      use: {
        // ...devices["Desktop Chrome"],
        // channel: 'chrome',

        viewport: null,
      },
    },
  ],
});
