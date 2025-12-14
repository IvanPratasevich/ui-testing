import BasePage from './BasePage.js';

export default class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);

    // Input fields
    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressTextarea = page.locator('#currentAddress');
    this.permanentAddressTextarea = page.locator('#permanentAddress');

    // Error state
    this.emailInputWithError = page.locator('#userEmail.field-error');

    // Submit button
    this.submitButton = page.locator('#submit');

    // Output section
    this.outputSection = page.locator('#output');
    this.outputName = page.locator('#output #name');
    this.outputEmail = page.locator('#output #email');
    this.outputCurrentAddress = page.locator('#output #currentAddress');
    this.outputPermanentAddress = page.locator('#output #permanentAddress');
  }

  async fillFullName(name) {
    await this.waitForElementVisible(this.fullNameInput);
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email) {
    await this.waitForElementVisible(this.emailInput);
    await this.emailInput.fill(email);
  }

  async fillCurrentAddress(address) {
    await this.waitForElementVisible(this.currentAddressTextarea);
    await this.currentAddressTextarea.fill(address);
  }

  async fillPermanentAddress(address) {
    await this.waitForElementVisible(this.permanentAddressTextarea);
    await this.permanentAddressTextarea.fill(address);
  }

  async clickSubmit() {
    await this.clickOnElementByLocator(this.submitButton);
  }

  async fillForm(fullName, email, currentAddress, permanentAddress) {
    await this.fillFullName(fullName);
    await this.fillEmail(email);
    await this.fillCurrentAddress(currentAddress);
    await this.fillPermanentAddress(permanentAddress);
    await this.clickSubmit();
  }

  async getOutputName() {
    return await this.getElementText(this.outputName);
  }

  async getOutputEmail() {
    return await this.getElementText(this.outputEmail);
  }

  async getOutputCurrentAddress() {
    return await this.getElementText(this.outputCurrentAddress);
  }

  async getOutputPermanentAddress() {
    return await this.getElementText(this.outputPermanentAddress);
  }

  async isOutputVisible() {
    return await this.isElementVisible(this.outputSection);
  }

  async hasEmailErrorClass() {
    return await this.emailInput.evaluate(el => el.classList.contains('field-error'));
  }
}
