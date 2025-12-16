import BasePage from './BasePage.js';

export default class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.alertButton = page.locator('#alertButton');
    this.timerAlertButton = page.locator('#timerAlertButton');
    this.confirmButton = page.locator('#confirmButton');
    this.promptButton = page.locator('#promtButton');
    this.promptResult = page.locator('#promptResult');
    this.confirmResult = page.locator('#confirmResult');
  }

  async clickAlertButton() {
    await this.clickOnElementByLocator(this.alertButton);
  }

  async clickTimerAlertButton() {
    await this.clickOnElementByLocator(this.timerAlertButton);
  }

  async clickConfirmButton() {
    await this.clickOnElementByLocator(this.confirmButton);
  }

  async clickPromptButton() {
    await this.clickOnElementByLocator(this.promptButton);
  }

  async getConfirmResult() {
    await this.waitForElementVisible(this.confirmResult);
    return await this.getElementText(this.confirmResult);
  }

  async getPromptResult() {
    await this.waitForElementVisible(this.promptResult);
    return await this.getElementText(this.promptResult);
  }
}
