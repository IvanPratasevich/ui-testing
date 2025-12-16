import BasePage from './BasePage.js';

export default class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);

    // elememts for hover
    this.hoverButton = page.locator('#toolTipButton');
    this.hoverTextField = page.locator('#toolTipTextField');
    this.contraryLink = page.locator('a:has-text("Contrary")').first();
    this.sectionLink = page.locator('xpath=//a[contains(text(), "1.10.32")]');

    // locators toooltips
    this.tooltip = page.locator('#buttonToolTip');
    this.tooltipText = page.locator('#textFieldToolTip');
    this.tooltipContrary = page.locator('#contraryTexToolTip');
    this.tooltipSection = page.locator('#sectionToolTip');
  }

  async hoverOnButton() {
    await this.hoverOnElement(this.hoverButton);
  }

  async hoverOnTextField() {
    await this.hoverOnElement(this.hoverTextField);
  }

  async hoverOnContraryLink() {
    await this.hoverOnElement(this.contraryLink);
  }

  async hoverOnSectionLink() {
    await this.hoverOnElement(this.sectionLink);
  }

  async getTooltipText(tooltip) {
    await this.waitForElementVisible(tooltip);
    return await this.getElementText(tooltip);
  }

  async isTooltipVisible(tooltip) {
    await this.waitForElementVisible(tooltip);
    return await this.isElementVisible(tooltip);
  }
}
