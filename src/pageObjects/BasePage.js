export default class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  // async clickOnButton(name) {
  //   await this.page.getByRole('button', { name }).click();
  // }

  async clickOnElementByLocator(locator) {
    await locator.waitFor({ state: 'visible' });
    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      throw new Error('Element is not enabled for clicking');
    }
    await locator.click();
  }

  async hoverOnElement(element) {
    await element.hover();
  }

  async getElementText(locator) {
    return await locator.textContent();
  }

  async waitForElementVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async isElementVisible(locator, timeout = 7000) {
    try {
      return await locator.isVisible({ timeout });
    } catch {
      return false;
    }
  }
}
