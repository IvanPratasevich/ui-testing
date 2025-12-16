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
    await test.step('Step 1: Verify all form fields and submit button are visible', async () => {
      expect(await textBoxPage.isElementVisible(textBoxPage.fullNameInput)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.emailInput)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.currentAddressTextarea)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.permanentAddressTextarea)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.submitButton)).toBe(true);
    });
  });

  test('Test 2: fill form with random data and verify output', async () => {
    let fullName, email, currentAddress, permanentAddress;

    await test.step('Step 1: Generate random test data', async () => {
      fullName = fakerator.names.name();
      email = fakerator.internet.email();
      currentAddress = fakerator.address.street();
      permanentAddress = fakerator.address.street();
    });

    await test.step('Step 2: Fill all form fields with generated data', async () => {
      await textBoxPage.fillForm(fullName, email, currentAddress, permanentAddress);
    });

    await test.step('Step 3: Submit the form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 4: Verify output section is visible', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
      expect(await textBoxPage.isOutputVisible()).toBe(true);
    });

    await test.step('Step 5: Verify output contains correct data', async () => {
      const outputName = await textBoxPage.getOutputName();
      const outputEmail = await textBoxPage.getOutputEmail();
      const outputCurrentAddr = await textBoxPage.getOutputCurrentAddress();
      const outputPermanentAddr = await textBoxPage.getOutputPermanentAddress();

      expect(outputName).toContain(fullName);
      expect(outputEmail).toContain(email);
      expect(outputCurrentAddr).toContain(currentAddress);
      expect(outputPermanentAddr).toContain(permanentAddress);
    });
  });

  test('Test 3: fill only required fields', async () => {
    let fullName, email;

    await test.step('Step 1: Generate required test data', async () => {
      fullName = fakerator.names.name();
      email = fakerator.internet.email();
    });

    await test.step('Step 2: Fill only full name and email', async () => {
      await textBoxPage.fillFullName(fullName);
      await textBoxPage.fillEmail(email);
    });

    await test.step('Step 3: Submit the form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 4: Verify output section is visible', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
    });

    await test.step('Step 5: Verify output contains name and email', async () => {
      const outputName = await textBoxPage.getOutputName();
      const outputEmail = await textBoxPage.getOutputEmail();

      expect(outputName).toContain(fullName);
      expect(outputEmail).toContain(email);
    });
  });

  test('Test 4: submit button is clickable', async () => {
    let fullName;

    await test.step('Step 1: Generate full name', async () => {
      fullName = fakerator.names.name();
    });

    await test.step('Step 2: Fill full name field', async () => {
      await textBoxPage.fillFullName(fullName);
    });

    await test.step('Step 3: Click submit button', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 4: Verify output is displayed', async () => {
      expect(await textBoxPage.isOutputVisible()).toBe(true);
    });
  });

  test('Test 5: form handles special characters in address', async () => {
    let fullName, email, specialAddress;

    await test.step('Step 1: Generate test data with special characters', async () => {
      fullName = fakerator.names.name();
      email = fakerator.internet.email();
      specialAddress = '123 LONG St., SRWQG #456, NEW-YORK, State 123456789';
    });

    await test.step('Step 2: Fill form with special address', async () => {
      await textBoxPage.fillForm(fullName, email, specialAddress, specialAddress);
    });

    await test.step('Step 3: Submit the form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 4: Verify output section is visible', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
    });

    await test.step('Step 5: Verify special characters are preserved in output', async () => {
      const outputCurrentAddr = await textBoxPage.getOutputCurrentAddress();
      expect(outputCurrentAddr).toContain(specialAddress);
    });
  });

  test('Test 6: email field validation with invalid email', async ({ page }) => {
    await test.step('Step 1: Fill email with invalid format', async () => {
      const invalidEmail = 's@';
      await textBoxPage.fillEmail(invalidEmail);
    });

    await test.step('Step 2: Submit the form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 3: Verify error class is applied', async () => {
      const hasErrorClass = await textBoxPage.hasEmailErrorClass();
      expect(hasErrorClass).toBe(true);
    });

    await test.step('Step 4: Verify email field shows visual error', async () => {
      await expect(textBoxPage.emailInputWithError).toBeVisible();
      await expect(textBoxPage.emailInputWithError).toHaveCSS('border-color', 'rgb(255, 0, 0)');
    });
  });

  test('Test 7: email field validation with incomplete email missing domain', async ({ page }) => {
    const invalidEmails = ['s@', 'test@', 'user@', '@'];

    await test.step('Step 1: Test multiple invalid email formats', async () => {
      for (const invalidEmail of invalidEmails) {
        await textBoxPage.emailInput.clear();
        await textBoxPage.fillEmail(invalidEmail);
        await textBoxPage.clickSubmit();

        const hasErrorClass = await textBoxPage.hasEmailErrorClass();
        expect(hasErrorClass).toBe(true);
      }
    });
  });

  test('Test 8: email field validation with valid email removes error', async ({ page }) => {
    let hasErrorClass;

    await test.step('Step 1: Fill and submit invalid email', async () => {
      const invalidEmail = 's@';
      await textBoxPage.fillEmail(invalidEmail);
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 2: Verify error is displayed', async () => {
      hasErrorClass = await textBoxPage.hasEmailErrorClass();
      expect(hasErrorClass).toBe(true);
    });

    await test.step('Step 3: Fill and submit valid email', async () => {
      const validEmail = 's@gmail.com';
      await textBoxPage.fillEmail(validEmail);
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 4: Verify error is removed', async () => {
      hasErrorClass = await textBoxPage.hasEmailErrorClass();
      expect(hasErrorClass).toBe(false);
    });

    await test.step('Step 5: Verify valid email appears in output', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
      const outputEmail = await textBoxPage.getOutputEmail();
      expect(outputEmail).toContain('s@gmail.com');
    });
  });

  test('Test 9: email field accepts valid email formats without error', async ({ page }) => {
    const validEmails = ['test@example.com', 'user.name@domain.co.lt', 'test12345@test-domain.com', 's@mail.co'];

    await test.step('Step 1: Test multiple valid email formats', async () => {
      for (const validEmail of validEmails) {
        await textBoxPage.emailInput.clear();
        await textBoxPage.fillEmail(validEmail);
        await textBoxPage.clickSubmit();

        const hasErrorClass = await textBoxPage.hasEmailErrorClass();
        expect(hasErrorClass).toBe(false);
      }
    });
  });

  test('Test 10: submit empty form without filling any fields', async () => {
    await test.step('Step 1: Submit empty form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 2: Verify output is not displayed', async () => {
      const isOutputVisible = await textBoxPage.isOutputVisible();
      expect(isOutputVisible).toBe(false);
    });
  });

  test('Test 11: submit form with only full name filled', async () => {
    let fullName;

    await test.step('Step 1: Generate and fill only full name', async () => {
      fullName = fakerator.names.name();
      await textBoxPage.fillFullName(fullName);
    });

    await test.step('Step 2: Submit the form', async () => {
      await textBoxPage.clickSubmit();
    });

    await test.step('Step 3: Verify output section is visible', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.outputSection);
    });

    await test.step('Step 4: Verify only name is displayed in output', async () => {
      const outputName = await textBoxPage.getOutputName();
      expect(outputName).toContain(fullName);
    });

    await test.step('Step 5: Verify other fields are not displayed', async () => {
      expect(await textBoxPage.isElementVisible(textBoxPage.outputEmail)).toBe(false);
      expect(await textBoxPage.isElementVisible(textBoxPage.outputCurrentAddress)).toBe(false);
      expect(await textBoxPage.isElementVisible(textBoxPage.outputPermanentAddress)).toBe(false);
    });
  });
});
