import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';
import { AlertsPage } from '../src/pageObjects';
import data from '../config/Constants.js';
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
    const isAlertButtonVisible = await alertsPage.isElementVisible(alertsPage.alertButton);
    expect(isAlertButtonVisible).toBe(true);

    const isTimerAlertButtonVisible = await alertsPage.isElementVisible(alertsPage.timerAlertButton);
    expect(isTimerAlertButtonVisible).toBe(true);

    const isConfirmButtonVisible = await alertsPage.isElementVisible(alertsPage.confirmButton);
    expect(isConfirmButtonVisible).toBe(true);

    const isPromptButtonVisible = await alertsPage.isElementVisible(alertsPage.promptButton);
    expect(isPromptButtonVisible).toBe(true);
  });

  test('Test 2: simple alert appears with correct message', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
    });

    await alertsPage.clickAlertButton();
  });

  test('Test 3: timer alert appears after 5 second delay', async ({ page }) => {
    const start = Date.now();

    page.once('dialog', async dialog => {
      const end = Date.now() - start;
      expect(dialog.message()).toBe('This alert appeared after 5 seconds');
      expect(end).toBeLessThanOrEqual(9000);
      await dialog.accept();
    });

    await alertsPage.clickTimerAlertButton();
    await page.waitForEvent('dialog', { timeout: 6000 });
  });

  test('Test 4: confirm alert with accept action', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you confirm action?');
      await dialog.accept();
    });

    await alertsPage.clickConfirmButton();
    const confirmAlertResultText = await alertsPage.getConfirmResult();
    expect(confirmAlertResultText).toContain('You selected Ok');
  });

  test('Test 5: confirm alert with dismiss action', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toBe('Do you confirm action?');
      await dialog.dismiss();
    });

    await alertsPage.clickConfirmButton();
    const confirmAlertResultText = await alertsPage.getConfirmResult();
    expect(confirmAlertResultText).toContain('You selected Cancel');
  });

  test('Test 6: accept prompt alert with user input', async ({ page }) => {
    const userName = fakerator.names.name();

    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name');
      await dialog.accept(userName);
    });

    await alertsPage.clickPromptButton();
    const promptResultText = await alertsPage.getPromptResult();
    expect(promptResultText).toContain(`You entered ${userName}`);
  });

  test('Test 7: dismiss prompt alert', async ({ page }) => {
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toBe('Please enter your name');
      await dialog.dismiss();
    });

    await alertsPage.clickPromptButton();
    expect(await alertsPage.isElementVisible(alertsPage.promptResult)).toBe(false);
  });
});
