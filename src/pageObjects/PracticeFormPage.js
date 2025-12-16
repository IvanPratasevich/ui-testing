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
  }

  getStateOption(state) {
    return this.page.locator(`div[id^="react-select-3-option"]:has-text("${state}")`);
  }

  getCityOption(city) {
    return this.page.locator(`div[id^="react-select-4-option"]:has-text("${city}")`);
  }

  async fillFirstName(firstName) {
    await this.waitForElementVisible(this.firstNameInput);
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
    await this.clickOnElementByLocator(genderMap[gender]);
  }

  async fillMobile(mobile) {
    await this.mobileInput.fill(mobile);
  }

  async fillSubjects(subjects) {
    for (const subject of subjects) {
      try {
        await this.subjectsInput.click();
        await this.subjectsInput.type(subject, { delay: 50 });
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(200);
      } catch (error) {
        console.log(`Failed to add subject: ${subject}`, error.message);
      }
    }
  }

  async selectHobbies(hobbies) {
    const hobbyMap = {
      Sports: this.hobbySportsLabel,
      Reading: this.hobbyReadingLabel,
      Music: this.hobbyMusicLabel,
    };
    for (const hobby of hobbies) {
      await this.clickOnElementByLocator(hobbyMap[hobby]);
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
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);

    await this.submitButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);

    await this.clickOnElementByLocator(this.submitButton);
  }

  async isModalVisible() {
    return await this.isElementVisible(this.modalContent);
  }

  async getModalTitle() {
    return await this.getElementText(this.modalTitle);
  }

  async getResultValue(label) {
    const row = this.page.locator(`tr:has(td:text-is("${label}"))`);
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
