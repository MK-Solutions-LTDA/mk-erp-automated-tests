import { defineConfig, devices } from "@playwright/test";
require("dotenv").config();

export default defineConfig({
  timeout: 90 * 1000,
  testDir: "testes/",
  fullyParallel: true,
  workers: 2,
  reporter: [['html', { printSteps: true }]],
  retries: 2,
  use: {
    launchOptions: {
      args: ["--start-maximized", 
      "--use-fake-ui-for-media-stream", 
      "--use-fake-device-for-media-stream"
      ],
    },
  //   video: {
  //     mode: "on",
  //     size: { width: 1920, height: 1080 }
  //   },  
  //   screenshot: "on",
    permissions: ['microphone', 'camera', 'geolocation'],
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
})