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
    await test.step('Step 1: Select Group 2, option 1 from dropdown', async () => {
      await selectMenuPage.selectValueOption('Group 2, option 1');
    });

    await test.step('Step 2: Verify Group 2, option 1 is selected', async () => {
      const selectedText = await selectMenuPage.getSelectedValue(selectMenuPage.selectValueDropdown);
      expect(selectedText).toContain('Group 2, option 1');
    });
  });

  test('Test 2: select one dropdown with other option', async ({ page }) => {
    await test.step('Step 1: Select Other from dropdown', async () => {
      await selectMenuPage.selectOneOption('Other');
    });

    await test.step('Step 2: Verify Other is selected', async () => {
      const selectedText = await selectMenuPage.getSelectedValue(selectMenuPage.selectOneDropdown);
      expect(selectedText).toContain('Other');
    });
  });

  test('Test 3: old style select menu with green color', async ({ page }) => {
    await test.step('Step 1: Select Green from old style menu', async () => {
      await selectMenuPage.selectOldStyleOption('Green');
    });

    await test.step('Step 2: Verify Green is selected', async () => {
      const selectedText = await selectMenuPage.getOldStyleSelectedText();
      expect(selectedText).toBe('Green');
    });
  });

  test('Test 4: standard multiselect with multiple options', async ({ page }) => {
    await test.step('Step 1: Select Volvo and Audi from multiselect', async () => {
      await selectMenuPage.selectStandardMultiSelectOptionsByText(['Volvo', 'Audi']);
    });

    await test.step('Step 2: Verify Volvo and Audi are selected', async () => {
      const selectedOptions = await selectMenuPage.standardMultiSelectChecked.allInnerTexts();
      expect(selectedOptions).toEqual(expect.arrayContaining(['Volvo', 'Audi']));
      expect(selectedOptions).toHaveLength(2);
    });
  });

  test('Test 5: react multiselect with two colors', async ({ page }) => {
    await test.step('Step 1: Select Black and Blue from react multiselect', async () => {
      await selectMenuPage.selectReactMultiSelectOptionsByText(['Black', 'Blue']);
    });

    await test.step('Step 2: Verify 2 color tags are displayed', async () => {
      await expect(selectMenuPage.newMultiSelectTagLabels).toHaveCount(2);
    });

    await test.step('Step 3: Verify Black and Blue tags are present', async () => {
      const labels = await selectMenuPage.newMultiSelectTagLabels.allInnerTexts();
      expect(labels).toEqual(expect.arrayContaining(['Black', 'Blue']));
    });
  });

  test('Test 6: react multiselect with three colors', async ({ page }) => {
    await test.step('Step 1: Select Green, Blue and Black from react multiselect', async () => {
      await selectMenuPage.selectReactMultiSelectOptionsByText(['Green', 'Blue', 'Black']);
    });

    await test.step('Step 2: Verify 3 color tags are displayed', async () => {
      await expect(selectMenuPage.newMultiSelectTagLabels).toHaveCount(3);
    });

    await test.step('Step 3: Verify Green, Blue and Black tags are present', async () => {
      const labels = await selectMenuPage.newMultiSelectTagLabels.allInnerTexts();
      expect(labels).toEqual(expect.arrayContaining(['Green', 'Blue', 'Black']));
    });
  });

  test('Test 7: all dropdown menus are visible', async ({ page }) => {
    await test.step('Step 1: Wait for page to load completely', async () => {
      await selectMenuPage.selectValueDropdown.waitFor({ state: 'visible' });
    });

    await test.step('Step 2: Verify all dropdown menus are visible on page', async () => {
      expect(await selectMenuPage.isElementVisible(selectMenuPage.selectValueDropdown)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.selectOneDropdown)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.oldStyleSelect)).toBe(true);
      expect(await selectMenuPage.isElementVisible(selectMenuPage.newMultiSelectControl)).toBe(true);
    });
  });

  for (const color of data.colors) {
    test(`Test 8: old style select with ${color.toLowerCase()} color`, async ({ page }) => {
      await test.step(`Step 1: Select ${color} from old style menu`, async () => {
        await selectMenuPage.selectOldStyleOption(color);
      });

      await test.step(`Step 2: Verify ${color} is selected`, async () => {
        const selectedText = await selectMenuPage.getOldStyleSelectedText();
        expect(selectedText).toBe(color);
      });
    });
  }

  test('Test 9: react multiselect clear all selected tags', async ({ page }) => {
    await test.step('Step 1: Select Black and Blue colors', async () => {
      await selectMenuPage.selectReactMultiSelectOptionsByText(['Black', 'Blue']);
    });

    await test.step('Step 2: Verify 2 color tags are displayed', async () => {
      await expect(selectMenuPage.newMultiSelectTags).toHaveCount(2);
    });

    await test.step('Step 3: Click remove button on each tag', async () => {
      const removeButtons = selectMenuPage.newMultiSelectRemoveButtons;
      const count = await removeButtons.count();

      for (let i = count - 1; i >= 0; i--) {
        await selectMenuPage.clickOnElementByLocator(removeButtons.nth(i));
      }
    });

    await test.step('Step 4: Verify no tags remain in multiselect', async () => {
      await expect(selectMenuPage.newMultiSelectTags).toHaveCount(0);
    });
  });
});
