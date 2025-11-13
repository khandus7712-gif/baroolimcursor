import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  /* 테스트 타임아웃 */
  timeout: 30 * 1000,
  expect: {
    /* assertion 타임아웃 */
    timeout: 5000,
  },
  /* 테스트 실행 방식 */
  fullyParallel: true,
  /* CI에서 실패하면 모든 테스트 중단 */
  forbidOnly: !!process.env.CI,
  /* CI에서만 재시도 */
  retries: process.env.CI ? 2 : 0,
  /* CI에서 워커 수 제한 */
  workers: process.env.CI ? 1 : undefined,
  /* 리포트 설정 */
  reporter: 'html',
  /* 공유 설정 */
  use: {
    /* 기본 타임아웃 */
    actionTimeout: 0,
    /* 실패 시 스크린샷 */
    trace: 'on-first-retry',
    /* 스크린샷 */
    screenshot: 'only-on-failure',
    /* 비디오 */
    video: 'retain-on-failure',
  },

  /* 프로젝트 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* 개발 서버 설정 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

