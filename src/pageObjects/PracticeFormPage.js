import BasePage from './BasePage.js';

export default class PracticeFormPage extends BasePage {
  constructor(page) {
    super(page);

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');

    this.emailInput = page.locator('//label[text()="Email"]/ancestor::div[contains(@id,"userEmail-wrapper")]//input');
    this.genderMaleLabel = page.locator('//label[text()="Male"]');
    this.genderFemaleLabel = page.locator('//label[text()="Female"]');
    this.genderOtherLabel = page.locator('//label[text()="Other"]');

    this.subjectOption = subject => page.locator(`div[id^="react-select"][id*="option"]:text-is("${subject}")`);

    this.mobileInput = page.locator('//input[@id="userNumber"]');

    this.subjectsInput = page.locator(
      '//label[text()="Subjects"]/ancestor::div[contains(@id,"subjectsWrapper")]//input',
    );

    this.hobbySportsLabel = page.locator('//label[text()="Sports"]');
    this.hobbyReadingLabel = page.locator('//label[text()="Reading"]');
    this.hobbyMusicLabel = page.locator('//label[text()="Music"]');

    this.uploadPictureInput = page.locator('#uploadPicture');

    this.currentAddressTextarea = page.locator('#currentAddress');

    this.stateDropdown = page.locator('#state');
    this.cityDropdown = page.locator('#city');

    this.submitButton = page.locator('button:has-text("Submit")');

    this.modalContent = page.locator('.modal-content');
    this.modalTitle = page.locator('#example-modal-sizes-title-lg');

    this.stateOptions = page.locator('div[id^="react-select-3-option"]');
    this.cityOptions = page.locator('div[id^="react-select-4-option"]');

    this.resultTableRows = page.locator('tr');
  }

  getStateOption(state) {
    return this.stateOptions.filter({ hasText: state });
  }

  getCityOption(city) {
    return this.cityOptions.filter({ hasText: city });
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.waitFor({ state: 'visible' });
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName) {
    await this.waitForElementVisible(this.lastNameInput);
    await this.lastNameInput.fill(lastName);
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async selectGender(gender) {
    const genderMap = {
      Male: this.genderMaleLabel,
      Female: this.genderFemaleLabel,
      Other: this.genderOtherLabel,
    };

    const label = genderMap[gender];

    await label.click();
  }

  async fillMobile(mobile) {
    await this.mobileInput.fill(mobile);
  }

  async fillSubjects(subjects) {
    for (const subject of subjects) {
      await this.subjectsInput.fill(subject);
      const option = this.subjectOption(subject);
      await option.waitFor({ state: 'visible' });
      await option.click();
    }
  }

  async selectHobbies(hobbies) {
    const hobbyMap = {
      Sports: this.hobbySportsLabel,
      Reading: this.hobbyReadingLabel,
      Music: this.hobbyMusicLabel,
    };

    await this.page.keyboard.press('Escape');

    for (const hobby of hobbies) {
      const hobbyLocator = hobbyMap[hobby];
      await hobbyLocator.waitFor({ state: 'visible' });
      await hobbyLocator.click();
    }
  }

  async uploadPicture(filePath) {
    await this.uploadPictureInput.setInputFiles(filePath);
  }

  async fillCurrentAddress(address) {
    await this.currentAddressTextarea.scrollIntoViewIfNeeded();
    await this.currentAddressTextarea.fill(address);
  }

  async selectState(state) {
    await this.stateDropdown.click();
    await this.getStateOption(state).click();
  }

  async selectCity(city) {
    await this.cityDropdown.click();
    await this.getCityOption(city).click();
  }

  async selectStateAndCity(state, city) {
    await this.selectState(state);

    await this.cityDropdown.click();

    const cityOption = this.getCityOption(city);
    await cityOption.waitFor({ state: 'visible' });
    await cityOption.click();
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: 'visible' });
    const isEnabled = this.submitButton.isEnabled();
    if (!isEnabled) {
      throw new Error('Submit button is not enabled');
    }
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  async isModalVisible() {
    return await this.isElementVisible(this.modalContent);
  }

  async getModalTitle() {
    return await this.getElementText(this.modalTitle);
  }

  async getResultValue(label) {
    const row = this.resultTableRows.filter({ hasText: label });
    const valueCell = row.locator('td').nth(1);
    return await valueCell.textContent();
  }

  async fillMandatoryFields(data) {
    await this.fillFirstName(data.firstName);
    await this.fillLastName(data.lastName);
    await this.selectGender(data.gender);
    await this.fillMobile(data.mobile);
  }

  async fillCompleteForm(data) {
    await this.fillMandatoryFields(data);

    if (data.email) await this.fillEmail(data.email);
    if (data.subjects) await this.fillSubjects(data.subjects);
    if (data.hobbies) await this.selectHobbies(data.hobbies);
    if (data.picture) await this.uploadPicture(data.picture);
    if (data.address) await this.fillCurrentAddress(data.address);

    if (data.state && data.city) {
      await this.selectStateAndCity(data.state, data.city);
    } else if (data.state) {
      await this.selectState(data.state);
    }
  }
}
