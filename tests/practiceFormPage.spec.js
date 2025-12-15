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
      const formData = dataGenerator.generateCompleteFormData();

      await practiceFormPage.fillCompleteForm(formData);
      await practiceFormPage.clickSubmit();

      await practiceFormPage.waitForElementVisible(practiceFormPage.modalContent);
      expect(await practiceFormPage.isModalVisible()).toBe(true);

      const modalTitle = await practiceFormPage.getModalTitle();
      expect(modalTitle).toContain('Thanks for submitting the form');

      const studentName = await practiceFormPage.getResultValue('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      const email = await practiceFormPage.getResultValue('Student Email');
      expect(email).toBe(formData.email);

      const gender = await practiceFormPage.getResultValue('Gender');
      expect(gender).toBe(formData.gender);

      const mobile = await practiceFormPage.getResultValue('Mobile');
      expect(mobile).toBe(formData.mobile);

      const subjects = await practiceFormPage.getResultValue('Subjects');
      formData.subjects.forEach(subject => {
        expect(subjects).toContain(subject);
      });

      const hobbies = await practiceFormPage.getResultValue('Hobbies');
      formData.hobbies.forEach(hobby => {
        expect(hobbies).toContain(hobby);
      });

      const pictureName = await practiceFormPage.getResultValue('Picture');
      expect(pictureName).toContain('example.jpeg');

      const address = await practiceFormPage.getResultValue('Address');
      expect(address).toBe(formData.address);

      const stateCity = await practiceFormPage.getResultValue('State and City');
      expect(stateCity).toContain(formData.state);
      expect(stateCity).toContain(formData.city);
    });

    test('Test 2: submit with only mandatory fields', async () => {
      const formData = dataGenerator.generateMandatoryFormData();

      await practiceFormPage.fillMandatoryFields(formData);
      await practiceFormPage.clickSubmit();

      await practiceFormPage.waitForElementVisible(practiceFormPage.modalContent);
      expect(await practiceFormPage.isModalVisible()).toBe(true);

      const modalTitle = await practiceFormPage.getModalTitle();
      expect(modalTitle).toContain('Thanks for submitting the form');

      const studentName = await practiceFormPage.getResultValue('Student Name');
      expect(studentName).toContain(formData.firstName);
      expect(studentName).toContain(formData.lastName);

      const gender = await practiceFormPage.getResultValue('Gender');
      expect(gender).toBe(formData.gender);

      const mobile = await practiceFormPage.getResultValue('Mobile');
      expect(mobile).toBe(formData.mobile);
    });
  });

  test.describe('Negative', () => {
    test('Test 3: submit empty form shows validation errors', async () => {
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);

      const isFormValid = await practiceFormPage.page.locator('#userForm').evaluate(form => form.checkValidity());
      expect(isFormValid).toBe(false);
    });

    test('Test 4: email validation with invalid format', async () => {
      const formData = dataGenerator.generateFormDataWithInvalidEmail();
      const validMobile = dataGenerator.generateMobile();

      await practiceFormPage.fillFirstName(formData.firstName);
      await practiceFormPage.fillLastName(formData.lastName);
      await practiceFormPage.fillEmail(formData.email);
      await practiceFormPage.selectGender(formData.gender);
      await practiceFormPage.fillMobile(validMobile);
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });

    test('Test 5: mobile number validation with invalid length', async () => {
      const formData = dataGenerator.generateFormDataWithInvalidMobile();

      await practiceFormPage.fillFirstName(formData.firstName);
      await practiceFormPage.fillLastName(formData.lastName);
      await practiceFormPage.selectGender(formData.gender);
      await practiceFormPage.fillMobile(formData.mobile);
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });
  });

  test.describe('fields validation', () => {
    test('Test 6: verify all mandatory fields are validated when empty', async () => {
      await practiceFormPage.clickSubmit();

      const isFirstNameInvalid = await practiceFormPage.firstNameInput.evaluate(el => el.matches(':invalid'));
      const isLastNameInvalid = await practiceFormPage.lastNameInput.evaluate(el => el.matches(':invalid'));
      const isMobileInvalid = await practiceFormPage.mobileInput.evaluate(el => el.matches(':invalid'));

      expect(isFirstNameInvalid).toBe(true);
      expect(isLastNameInvalid).toBe(true);
      expect(isMobileInvalid).toBe(true);
    });

    test('Test 7: form with missing first name shows error', async () => {
      await practiceFormPage.fillLastName(dataGenerator.generateLastName());
      await practiceFormPage.selectGender(dataGenerator.generateGender());
      await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });

    test('Test 8: form with missing last name shows error', async () => {
      await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
      await practiceFormPage.selectGender(dataGenerator.generateGender());
      await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });

    test('Test 9: form with missing gender shows error', async () => {
      await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
      await practiceFormPage.fillLastName(dataGenerator.generateLastName());
      await practiceFormPage.fillMobile(dataGenerator.generateMobile());
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });

    test('Test 10: form with missing mobile shows error', async () => {
      await practiceFormPage.fillFirstName(dataGenerator.generateFirstName());
      await practiceFormPage.fillLastName(dataGenerator.generateLastName());
      await practiceFormPage.selectGender(dataGenerator.generateGender());
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(false);
    });
  });

  const genders = new DataGenerator().genders;

  for (const gender of genders) {
    test(`Test 11: submit form with gender ${gender}`, async () => {
      const formData = {
        firstName: dataGenerator.generateFirstName(),
        lastName: dataGenerator.generateLastName(),
        gender: gender,
        mobile: dataGenerator.generateMobile(),
      };

      await practiceFormPage.fillMandatoryFields(formData);
      await practiceFormPage.clickSubmit();

      expect(await practiceFormPage.isModalVisible()).toBe(true);
    });
  }
});
