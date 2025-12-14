import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';
import { SelectMenuPage } from '../src/pageObjects';
import data from '../config/constants';

test.describe('Select Menu Page Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    await AdBlock.blockAds(page);
    selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.navigateTo('https://demoqa.com/select-menu');
  });

  test('Test 1: select value dropdown with group 2 option 1', async ({ page }) => {
    await selectMenuPage.selectValueOption('Group 2, option 1');

    const selectedText = await selectMenuPage.getSelectedValue(selectMenuPage.selectValueDropdown);
    expect(selectedText).toContain('Group 2, option 1');
  });

  test('Test 2: select one dropdown with other option', async ({ page }) => {
    await selectMenuPage.selectOneOption('Other');

    const selectedText = await selectMenuPage.getSelectedValue(selectMenuPage.selectOneDropdown);
    expect(selectedText).toContain('Other');
  });

  test('Test 3: old style select menu with green color', async ({ page }) => {
    await selectMenuPage.selectOldStyleOption('Green');

    const selectedText = await selectMenuPage.getOldStyleSelectedText();
    expect(selectedText).toBe('Green');
  });

  test('Test 4: standard multiselect with multiple options', async ({ page }) => {
    await selectMenuPage.selectStandardMultiSelectOptionsByText(['Volvo', 'Audi']);

    const selectedOptions = await selectMenuPage.standardMultiSelectChecked.allInnerTexts();
    expect(selectedOptions).toEqual(expect.arrayContaining(['Volvo', 'Audi']));
    expect(selectedOptions).toHaveLength(2);
  });

  test('Test 5: react multiselect with two colors', async ({ page }) => {
    await selectMenuPage.selectReactMultiSelectOptionsByText(['Black', 'Blue']);

    await expect(selectMenuPage.newMultiSelectTagLabels).toHaveCount(2);

    const labels = await selectMenuPage.newMultiSelectTagLabels.allInnerTexts();
    expect(labels).toEqual(expect.arrayContaining(['Black', 'Blue']));
  });

  test('Test 6: react multiselect with three colors', async ({ page }) => {
    await selectMenuPage.selectReactMultiSelectOptionsByText(['Green', 'Blue', 'Black']);

    await expect(selectMenuPage.newMultiSelectTagLabels).toHaveCount(3);

    const labels = await selectMenuPage.newMultiSelectTagLabels.allInnerTexts();
    expect(labels).toEqual(expect.arrayContaining(['Green', 'Blue', 'Black']));
  });

  test('Test 7: all dropdown menus are visible', async ({ page }) => {
    await selectMenuPage.selectValueDropdown.waitFor({ state: 'visible' });

    expect(await selectMenuPage.isElementVisible(selectMenuPage.selectValueDropdown)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.selectOneDropdown)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.oldStyleSelect)).toBe(true);
    expect(await selectMenuPage.isElementVisible(selectMenuPage.newMultiSelectControl)).toBe(true);
  });

  for (const color of data.colors) {
    test(`Test 8: old style select with ${color.toLowerCase()} color`, async ({ page }) => {
      await selectMenuPage.selectOldStyleOption(color);

      const selectedText = await selectMenuPage.getOldStyleSelectedText();
      expect(selectedText).toBe(color);
    });
  }

  test('Test 9: react multiselect clear all selected tags', async ({ page }) => {
    await selectMenuPage.selectReactMultiSelectOptionsByText(['Black', 'Blue']);

    // 2 tags
    await expect(selectMenuPage.newMultiSelectTags).toHaveCount(2);

    // delete tag
    const removeButtons = selectMenuPage.newMultiSelectRemoveButtons;
    const count = await removeButtons.count();

    for (let i = count - 1; i >= 0; i--) {
      await selectMenuPage.clickOnElementByLocator(removeButtons.nth(i));
    }

    await expect(selectMenuPage.newMultiSelectTags).toHaveCount(0);
  });
});
