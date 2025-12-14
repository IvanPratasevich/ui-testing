import BasePage from './BasePage.js';

export default class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);
    // Select Value dropdown
    this.selectValueDropdown = page.locator('#withOptGroup');
    this.selectValueOptions = page.locator('div[id*="react-select-2-option"]');

    // Select One dropdown
    this.selectOneDropdown = page.locator('#selectOne');
    this.selectOneOptions = page.locator('div[id*="react-select-3-option"]');

    // Old Style Select Menu
    this.oldStyleSelect = page.locator('#oldSelectMenu');
    this.oldStyleSelectedOption = this.oldStyleSelect.locator('option:checked');

    // Standard Multiselect
    this.standardMultiSelect = page.locator('#cars');
    this.standardMultiSelectOptions = this.standardMultiSelect.locator('option');
    this.standardMultiSelectChecked = this.standardMultiSelect.locator('option:checked');

    // React Multiselect drop down
    this.newMultiSelectContainer = page.locator('p:has(b:has-text("Multiselect drop down")) + div');
    this.newMultiSelectControl = this.newMultiSelectContainer.locator('.css-1hwfws3').first();
    this.newMultiSelectOptions = page.locator('div[id*="react-select-4-option"]');
    this.newMultiSelectTags = page.locator('.css-1rhbuit-multiValue');
    this.newMultiSelectTagLabels = page.locator('.css-1rhbuit-multiValue .css-12jo7m5');
    this.newMultiSelectRemoveButtons = page.locator('.css-xb97g8');
  }

  getSelectValueOptionByText(text) {
    return this.selectValueOptions.filter({ hasText: text }).first();
  }

  getSelectOneOptionByText(text) {
    return this.selectOneOptions.filter({ hasText: text }).first();
  }

  getReactMultiSelectOptionByText(text) {
    return this.newMultiSelectOptions.filter({ hasText: text.trim() }).first();
  }

  getReactMultiSelectTagByText(text) {
    return this.newMultiSelectTagLabels.filter({ hasText: text.trim() });
  }

  async selectValueOption(optionText) {
    await this.clickOnElementByLocator(this.selectValueDropdown);
    const option = this.getSelectValueOptionByText(optionText);
    await this.waitForElementVisible(option);
    await this.clickOnElementByLocator(option);
  }

  async selectOneOption(optionText) {
    await this.clickOnElementByLocator(this.selectOneDropdown);
    const option = this.getSelectOneOptionByText(optionText);
    await this.waitForElementVisible(option);
    await this.clickOnElementByLocator(option);
  }

  async selectOldStyleOption(labelText) {
    await this.waitForElementVisible(this.oldStyleSelect);
    await this.oldStyleSelect.selectOption({ label: labelText });
  }

  async selectStandardMultiSelectOptionsByText(optionTexts) {
    const values = [];
    const options = await this.standardMultiSelectOptions.all();

    for (const opt of options) {
      const text = await opt.textContent();
      const value = await opt.getAttribute('value');
      if (optionTexts.includes(text)) {
        values.push(value);
      }
    }

    await this.standardMultiSelect.selectOption(values);
  }

  async selectReactMultiSelectOptionsByText(optionTexts) {
    await this.clickOnElementByLocator(this.newMultiSelectControl);

    await this.waitForElementVisible(this.newMultiSelectOptions.first());

    for (const text of optionTexts) {
      const option = this.getReactMultiSelectOptionByText(text);
      await this.waitForElementVisible(option);
      await this.clickOnElementByLocator(option);

      const tag = this.getReactMultiSelectTagByText(text);
      await this.waitForElementVisible(tag);
    }
  }

  async getSelectedValue(dropdown) {
    return await this.getElementText(dropdown);
  }

  async getOldStyleSelectedText() {
    return await this.oldStyleSelectedOption.textContent();
  }
}
