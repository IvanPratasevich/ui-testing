import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';
import { AlertsPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

const fakerator = Fakerator('lt-LT');

test.describe('Alerts Page Tests', () => {
  let alertsPage;

  test.beforeEach(async ({ page }) => {
    await AdBlock.blockAds(page);
    alertsPage = new AlertsPage(page);
    await alertsPage.navigateTo('https://demoqa.com/alerts');
  });

  test('Test 1: all alert buttons are visible', async ({ page }) => {
    await test.step('Step 1: Verify alert button is visible', async () => {
      const isAlertButtonVisible = await alertsPage.isElementVisible(alertsPage.alertButton);
      expect(isAlertButtonVisible).toBe(true);
    });

    await test.step('Step 2: Verify timer alert button is visible', async () => {
      const isTimerAlertButtonVisible = await alertsPage.isElementVisible(alertsPage.timerAlertButton);
      expect(isTimerAlertButtonVisible).toBe(true);
    });

    await test.step('Step 3: Verify confirm button is visible', async () => {
      const isConfirmButtonVisible = await alertsPage.isElementVisible(alertsPage.confirmButton);
      expect(isConfirmButtonVisible).toBe(true);
    });

    await test.step('Step 4: Verify prompt button is visible', async () => {
      const isPromptButtonVisible = await alertsPage.isElementVisible(alertsPage.promptButton);
      expect(isPromptButtonVisible).toBe(true);
    });
  });

  test('Test 2: simple alert appears with correct message', async ({ page }) => {
    await test.step('Step 1: Set up alert dialog handler', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('You clicked a button');
        await dialog.accept();
      });
    });

    await test.step('Step 2: Click alert button', async () => {
      await alertsPage.clickAlertButton();
    });
  });

  test('Test 3: timer alert appears after 5 second delay', async ({ page }) => {
    let start;

    await test.step('Step 1: Record start time and set up dialog handler', async () => {
      start = Date.now();

      page.once('dialog', async dialog => {
        const end = Date.now() - start;
        expect(dialog.message()).toBe('This alert appeared after 5 seconds');
        expect(end).toBeLessThanOrEqual(9000);
        await dialog.accept();
      });
    });

    await test.step('Step 2: Click timer alert button', async () => {
      await alertsPage.clickTimerAlertButton();
    });

    await test.step('Step 3: Wait for dialog to appear', async () => {
      await page.waitForEvent('dialog', { timeout: 6000 });
    });
  });

  test('Test 4: confirm alert with accept action', async ({ page }) => {
    await test.step('Step 1: Set up confirm dialog handler to accept', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('Do you confirm action?');
        await dialog.accept();
      });
    });

    await test.step('Step 2: Click confirm button', async () => {
      await alertsPage.clickConfirmButton();
    });

    await test.step('Step 3: Verify confirm result shows Ok', async () => {
      const confirmAlertResultText = await alertsPage.getConfirmResult();
      expect(confirmAlertResultText).toContain('You selected Ok');
    });
  });

  test('Test 5: confirm alert with dismiss action', async ({ page }) => {
    await test.step('Step 1: Set up confirm dialog handler to dismiss', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('Do you confirm action?');
        await dialog.dismiss();
      });
    });

    await test.step('Step 2: Click confirm button', async () => {
      await alertsPage.clickConfirmButton();
    });

    await test.step('Step 3: Verify confirm result shows Cancel selection', async () => {
      const confirmAlertResultText = await alertsPage.getConfirmResult();
      expect(confirmAlertResultText).toContain('You selected Cancel');
    });
  });

  test('Test 6: accept prompt alert with user input', async ({ page }) => {
    let userName;

    await test.step('Step 1: Generate user name', async () => {
      userName = fakerator.names.name();
    });

    await test.step('Step 2: Set up prompt dialog handler with user input', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Please enter your name');
        await dialog.accept(userName);
      });
    });

    await test.step('Step 3: Click prompt button', async () => {
      await alertsPage.clickPromptButton();
    });

    await test.step('Step 4: Verify prompt result contains entered name', async () => {
      const promptResultText = await alertsPage.getPromptResult();
      expect(promptResultText).toContain(`You entered ${userName}`);
    });
  });

  test('Test 7: dismiss prompt alert', async ({ page }) => {
    await test.step('Step 1: Set up prompt dialog handler to dismiss', async () => {
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('Please enter your name');
        await dialog.dismiss();
      });
    });

    await test.step('Step 2: Click prompt button', async () => {
      await alertsPage.clickPromptButton();
    });

    await test.step('Step 3: Verify prompt result is not visible', async () => {
      expect(await alertsPage.isElementVisible(alertsPage.promptResult)).toBe(false);
    });
  });
});
