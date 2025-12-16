import { test, expect } from '@playwright/test';
import { AdBlock, DataGenerator } from '../src/utils';
import { PracticeFormPage } from '../src/pageObjects';

test.describe('Practice Form Page Tests', () => {
  let practiceFormPage;
  let dataGenerator;

  test.beforeEach(async ({ page }) => {
    await AdBlock.blockAds(page);
    practiceFormPage = new PracticeFormPage(page);
    dataGenerator = new DataGenerator('en-US');
    await page.goto('https://demoqa.com/automation-practice-form', {
      waitUntil: 'networkidle',
    });
  });

  test.describe('Positive', () => {
    test('Test 1: fill complete form with all fields and verify submission', async () => {
      let formData;
      await test.step('Step 1: Generate complete form data', async () => {
        formData = dataGenerator.generateCompleteFormData();
      });

      await test.step('Step 2: Fill all form fields', async () => {
        await practiceFormPage.fillCompleteForm(formData);
      });

      await test.step('Step 3: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 4: Verify modal', async () => {
        await practiceFormPage.waitForElementVisible(practiceFormPage.modalContent);
        expect(await practiceFormPage.isModalVisible()).toBe(true);
        const modalTitle = await practiceFormPage.getModalTitle();
        expect(modalTitle).toContain('Thanks for submitting the form');
      });

      await test.step('Step 6: Verify student name in results', async () => {
        const studentName = await practiceFormPage.getResultValue('Student Name');
        expect(studentName).toContain(formData.firstName);
        expect(studentName).toContain(formData.lastName);
      });

      await test.step('Step 7: Verify email in results', async () => {
        const email = await practiceFormPage.getResultValue('Student Email');
        expect(email).toBe(formData.email);
      });

      await test.step('Step 8: Verify gender in results', async () => {
        const gender = await practiceFormPage.getResultValue('Gender');
        expect(gender).toBe(formData.gender);
      });

      await test.step('Step 9: Verify mobile in results', async () => {
        const mobile = await practiceFormPage.getResultValue('Mobile');
        expect(mobile).toBe(formData.mobile);
      });

      await test.step('Step 10: Verify subjects in results', async () => {
        const subjects = await practiceFormPage.getResultValue('Subjects');
        formData.subjects.forEach(subject => {
          expect(subjects).toContain(subject);
        });
      });

      await test.step('Step 11: Verify hobbies in results', async () => {
        const hobbies = await practiceFormPage.getResultValue('Hobbies');
        formData.hobbies.forEach(hobby => {
          expect(hobbies).toContain(hobby);
        });
      });

      await test.step('Step 12: Verify picture in results', async () => {
        const pictureName = await practiceFormPage.getResultValue('Picture');
        expect(pictureName).toContain('example.jpeg');
      });

      await test.step('Step 13: Verify address in results', async () => {
        const address = await practiceFormPage.getResultValue('Address');
        expect(address).toBe(formData.address);
      });

      await test.step('Step 14: Verify state and city in results', async () => {
        const stateCity = await practiceFormPage.getResultValue('State and City');
        expect(stateCity).toContain(formData.state);
        expect(stateCity).toContain(formData.city);
      });
    });

    test('Test 2: submit with only mandatory fields', async () => {
      let formData;

      await test.step('Step 1: Generate mandatory form data', async () => {
        formData = dataGenerator.generateMandatoryFormData();
      });

      await test.step('Step 2: Fill mandatory fields', async () => {
        await practiceFormPage.fillMandatoryFields(formData);
      });

      await test.step('Step 3: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 4: Verify modal is displayed', async () => {
        await practiceFormPage.waitForElementVisible(practiceFormPage.modalContent);
        expect(await practiceFormPage.isModalVisible()).toBe(true);
      });

      await test.step('Step 5: Verify modal title', async () => {
        const modalTitle = await practiceFormPage.getModalTitle();
        expect(modalTitle).toContain('Thanks for submitting the form');
      });

      await test.step('Step 6: Verify student name in results', async () => {
        const studentName = await practiceFormPage.getResultValue('Student Name');
        expect(studentName).toContain(formData.firstName);
        expect(studentName).toContain(formData.lastName);
      });

      await test.step('Step 7: Verify gender in results', async () => {
        const gender = await practiceFormPage.getResultValue('Gender');
        expect(gender).toBe(formData.gender);
      });

      await test.step('Step 8: Verify mobile in results', async () => {
        const mobile = await practiceFormPage.getResultValue('Mobile');
        expect(mobile).toBe(formData.mobile);
      });
    });
  });

  test.describe('Negative', () => {
    test('Test 3: submit empty form shows validation errors', async () => {
      await test.step('Step 1: Submit empty form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 2: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });

      await test.step('Step 3: Verify form is invalid', async () => {
        const isFormValid = await practiceFormPage.page.locator('#userForm').evaluate(form => form.checkValidity());
        expect(isFormValid).toBe(false);
      });
    });

    test('Test 4: email validation with invalid format', async () => {
      let formData;
      let validMobile;

      await test.step('Step 1: Generate form data with invalid email', async () => {
        formData = dataGenerator.generateFormDataWithInvalidEmail();
        validMobile = dataGenerator.generateMobile();
      });

      await test.step('Step 2: Fill form with invalid email', async () => {
        await practiceFormPage.fillFirstName(formData.firstName);
        await practiceFormPage.fillLastName(formData.lastName);
        await practiceFormPage.fillEmail(formData.email);
        await practiceFormPage.selectGender(formData.gender);
        await practiceFormPage.fillMobile(validMobile);
      });

      await test.step('Step 3: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 4: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });

    test('Test 5: mobile number validation with invalid length', async () => {
      let formData;

      await test.step('Step 1: Generate form data with invalid mobile', async () => {
        formData = dataGenerator.generateFormDataWithInvalidMobile();
      });

      await test.step('Step 2: Fill form with invalid mobile', async () => {
        await practiceFormPage.fillFirstName(formData.firstName);
        await practiceFormPage.fillLastName(formData.lastName);
        await practiceFormPage.selectGender(formData.gender);
        await practiceFormPage.fillMobile(formData.mobile);
      });

      await test.step('Step 3: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 4: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });
  });

  test.describe('fields validation', () => {
    test('Test 6: verify all mandatory fields are validated when empty', async () => {
      await test.step('Step 1: Submit empty form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 2: Verify all mandatory fields show validation errors', async () => {
        const isFirstNameInvalid = await practiceFormPage.firstNameInput.evaluate(el => el.matches(':invalid'));
        const isLastNameInvalid = await practiceFormPage.lastNameInput.evaluate(el => el.matches(':invalid'));
        const isMobileInvalid = await practiceFormPage.mobileInput.evaluate(el => el.matches(':invalid'));

        expect(isFirstNameInvalid).toBe(true);
        expect(isLastNameInvalid).toBe(true);
        expect(isMobileInvalid).toBe(true);
      });
    });

    test('Test 7: form with missing first name shows error', async () => {
      await test.step('Step 1: Fill form without first name', async () => {
        await practiceFormPage.fillLastName(dataGenerator.generateLastName());
        await practiceFormPage.selectGender(dataGenerator.generateGender());
        await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      });

      await test.step('Step 2: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 3: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });

    test('Test 8: form with missing last name shows error', async () => {
      await test.step('Step 1: Fill form without last name', async () => {
        await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
        await practiceFormPage.selectGender(dataGenerator.generateGender());
        await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      });

      await test.step('Step 2: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 3: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });

    test('Test 9: form with missing gender shows error', async () => {
      await test.step('Step 1: Fill form without gender', async () => {
        await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
        await practiceFormPage.fillLastName(dataGenerator.generateLastName());
        await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      });

      await test.step('Step 2: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 3: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });

    test('Test 10: form with missing mobile shows error', async () => {
      await test.step('Step 1: Fill form without mobile', async () => {
        await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
        await practiceFormPage.fillLastName(dataGenerator.generateLastName());
        await practiceFormPage.selectGender(dataGenerator.generateGender());
      });

      await test.step('Step 2: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 3: Verify modal is not displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(false);
      });
    });
  });

  const genders = new DataGenerator().genders;

  for (const gender of genders) {
    test(`Test 11: submit form with gender ${gender}`, async () => {
      let formData;

      await test.step(`Step 1: Generate form data with gender ${gender}`, async () => {
        formData = {
          firstName: dataGenerator.generateFirstName(),
          lastName: dataGenerator.generateLastName(),
          gender: gender,
          mobile: dataGenerator.generateMobile(),
        };
      });

      await test.step('Step 2: Fill mandatory fields', async () => {
        await practiceFormPage.fillMandatoryFields(formData);
      });

      await test.step('Step 3: Submit the form', async () => {
        await practiceFormPage.clickSubmit();
      });

      await test.step('Step 4: Verify modal is displayed', async () => {
        expect(await practiceFormPage.isModalVisible()).toBe(true);
      });
    });
  }
});
