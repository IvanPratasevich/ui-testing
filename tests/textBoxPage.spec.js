import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';
import { TextBoxPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

const fakerator = Fakerator('lt-LT');

test.describe('Text Box Page Tests', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    await AdBlock.blockAds(page);
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.navigateTo('https://demoqa.com/text-box');
  });

  test('Test 1: all form fields are visible', async () => {
    expect(await textBoxPage.isElementVisible(textBoxPage.fullNameInput)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.emailInput)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.currentAddressTextarea)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.permanentAddressTextarea)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.submitButton)).toBe(true);
  });

  test('Test 2: fill form with random data and verify output', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const currentAddress = fakerator.address.street();
    const permanentAddress = fakerator.address.street();

    await textBoxPage.fillForm(fullName, email, currentAddress, permanentAddress);

    await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
    expect(await textBoxPage.isOutputVisible()).toBe(true);

    const outputName = await textBoxPage.getOutputName();
    const outputEmail = await textBoxPage.getOutputEmail();
    const outputCurrentAddr = await textBoxPage.getOutputCurrentAddress();
    const outputPermanentAddr = await textBoxPage.getOutputPermanentAddress();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
    expect(outputCurrentAddr).toContain(currentAddress);
    expect(outputPermanentAddr).toContain(permanentAddress);
  });

  test('Test 3: fill only required fields', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();

    await textBoxPage.fillFullName(fullName);
    await textBoxPage.fillEmail(email);
    await textBoxPage.clickSubmit();

    await textBoxPage.waitForElementVisible(textBoxPage.outputSection);

    const outputName = await textBoxPage.getOutputName();
    const outputEmail = await textBoxPage.getOutputEmail();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
  });

  test('Test 4: submit button is clickable', async () => {
    const fullName = fakerator.names.name();

    await textBoxPage.fillFullName(fullName);
    await textBoxPage.clickSubmit();

    expect(await textBoxPage.isOutputVisible()).toBe(true);
  });

  test('Test 5: form handles special characters in address', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const specialAddress = '123 LONG St., SRWQG #456, NEW-YORK, State 123456789';

    await textBoxPage.fillForm(fullName, email, specialAddress, specialAddress);

    await textBoxPage.waitForElementVisible(textBoxPage.outputSection);

    const outputCurrentAddr = await textBoxPage.getOutputCurrentAddress();
    expect(outputCurrentAddr).toContain(specialAddress);
  });

  test('Test 6: email field validation with invalid email', async ({ page }) => {
    const invalidEmail = 's@';

    await textBoxPage.fillEmail(invalidEmail);
    await textBoxPage.clickSubmit();

    const hasErrorClass = await textBoxPage.hasEmailErrorClass();
    expect(hasErrorClass).toBe(true);

    await expect(textBoxPage.emailInputWithError).toBeVisible();

    await expect(textBoxPage.emailInputWithError).toHaveCSS('border-color', 'rgb(255, 0, 0)');
  });

  test('Test 7: email field validation with incomplete email missing domain', async ({ page }) => {
    const invalidEmails = ['s@', 'test@', 'user@', '@'];

    for (const invalidEmail of invalidEmails) {
      await textBoxPage.emailInput.clear();
      await textBoxPage.fillEmail(invalidEmail);
      await textBoxPage.clickSubmit();

      const hasErrorClass = await textBoxPage.hasEmailErrorClass();
      expect(hasErrorClass).toBe(true);
    }
  });

  test('Test 8: email field validation with valid email removes error', async ({ page }) => {
    const invalidEmail = 's@';
    const validEmail = 's@gmail.com';

    await textBoxPage.fillEmail(invalidEmail);
    await textBoxPage.clickSubmit();

    let hasErrorClass = await textBoxPage.hasEmailErrorClass();
    expect(hasErrorClass).toBe(true);

    await textBoxPage.fillEmail(validEmail);
    await textBoxPage.clickSubmit();

    hasErrorClass = await textBoxPage.hasEmailErrorClass();
    expect(hasErrorClass).toBe(false);

    await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
    const outputEmail = await textBoxPage.getOutputEmail();
    expect(outputEmail).toContain(validEmail);
  });

  test('Test 9: email field accepts valid email formats without error', async ({ page }) => {
    const validEmails = ['test@example.com', 'user.name@domain.co.lt', 'test12345@test-domain.com', 's@mail.co'];

    for (const validEmail of validEmails) {
      await textBoxPage.emailInput.clear();
      await textBoxPage.fillEmail(validEmail);
      await textBoxPage.clickSubmit();

      const hasErrorClass = await textBoxPage.hasEmailErrorClass();
      expect(hasErrorClass).toBe(false);
    }
  });

  test('Test 10: submit empty form without filling any fields', async () => {
    await textBoxPage.clickSubmit();

    const isOutputVisible = await textBoxPage.isOutputVisible();
    expect(isOutputVisible).toBe(false);
  });

  test('Test 11: submit form with only full name filled', async () => {
    const fullName = fakerator.names.name();

    await textBoxPage.fillFullName(fullName);
    await textBoxPage.clickSubmit();

    await textBoxPage.waitForElementVisible(textBoxPage.outputSection);

    const outputName = await textBoxPage.getOutputName();
    expect(outputName).toContain(fullName);

    expect(await textBoxPage.isElementVisible(textBoxPage.outputEmail)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.outputCurrentAddress)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.outputPermanentAddress)).toBe(false);
  });
});
