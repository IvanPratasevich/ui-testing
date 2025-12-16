import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';
import { ToolTipsPage } from '../src/pageObjects';

test.describe('ToolTips Page Tests', () => {
  let toolTipsPage;

  test.beforeEach(async ({ page }) => {
    await AdBlock.blockAds(page);
    toolTipsPage = new ToolTipsPage(page);
    await toolTipsPage.navigateTo('https://demoqa.com/tool-tips');
  });

  test('Test 1: tooltip appears on button hover', async ({ page }) => {
    await test.step('Step 1: Hover over the button', async () => {
      await toolTipsPage.hoverOnButton();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltip);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify tooltip text', async () => {
      const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltip);
      expect(tooltipText).toContain('You hovered over the Button');
    });
  });

  test('Test 2: tooltip appears on text field hover', async ({ page }) => {
    await test.step('Step 1: Hover over the text field', async () => {
      await toolTipsPage.hoverOnTextField();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipText);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify tooltip text', async () => {
      const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipText);
      expect(tooltipText).toContain('You hovered over the text field');
    });
  });

  test('Test 3: tooltip appears on Contrary link hover', async ({ page }) => {
    await test.step('Step 1: Hover over the Contrary link', async () => {
      await toolTipsPage.hoverOnContraryLink();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipContrary);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify tooltip text', async () => {
      const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipContrary);
      expect(tooltipText).toContain('You hovered over the Contrary');
    });
  });

  test('Test 4: tooltip appears on section link hover', async ({ page }) => {
    await test.step('Step 1: Hover over the section link', async () => {
      await toolTipsPage.hoverOnSectionLink();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipSection);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify tooltip text', async () => {
      const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipSection);
      expect(tooltipText).toContain('You hovered over the 1.10.32');
    });
  });

  test('Test 5: all tooltips are different', async ({ page }) => {
    const tooltips = [];

    await test.step('Step 1: Collect button tooltip', async () => {
      await toolTipsPage.hoverOnButton();
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
      tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltip));
    });

    await test.step('Step 2: Collect text field tooltip', async () => {
      await toolTipsPage.hoverOnTextField();
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
      tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipText));
    });

    await test.step('Step 3: Collect Contrary link tooltip', async () => {
      await toolTipsPage.hoverOnContraryLink();
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
      tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipContrary));
    });

    await test.step('Step 4: Collect section link tooltip', async () => {
      await toolTipsPage.hoverOnSectionLink();
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
      tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipSection));
    });

    await test.step('Step 5: Verify all tooltips are unique', async () => {
      const uniqueTooltips = new Set(tooltips);
      expect(uniqueTooltips.size).toBe(4);
      expect(tooltips.length).toBe(4);
    });
  });

  test('Test 6: aria-describedby appears on button hover', async ({ page }) => {
    await test.step('Step 1: Hover over the button', async () => {
      await toolTipsPage.hoverOnButton();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltip);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify aria-describedby attribute', async () => {
      const ariaDescribedBy = await toolTipsPage.hoverButton.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBe('buttonToolTip');
    });
  });

  test('Test 7: aria-describedby appears on text field hover', async ({ page }) => {
    await test.step('Step 1: Hover over the text field', async () => {
      await toolTipsPage.hoverOnTextField();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipText);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify aria-describedby attribute', async () => {
      const ariaDescribedBy = await toolTipsPage.hoverTextField.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBe('textFieldToolTip');
    });
  });

  test('Test 8: aria-describedby appears on Contrary link hover', async ({ page }) => {
    await test.step('Step 1: Hover over the Contrary link', async () => {
      await toolTipsPage.hoverOnContraryLink();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipContrary);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify aria-describedby attribute', async () => {
      const ariaDescribedBy = await toolTipsPage.contraryLink.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBe('contraryTexToolTip');
    });
  });

  test('Test 9: aria-describedby appears on section link hover', async ({ page }) => {
    await test.step('Step 1: Hover over the section link', async () => {
      await toolTipsPage.hoverOnSectionLink();
    });

    await test.step('Step 2: Wait for tooltip to appear', async () => {
      await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
    });

    await test.step('Step 3: Verify tooltip is visible', async () => {
      const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipSection);
      expect(isVisible).toBe(true);
    });

    await test.step('Step 4: Verify aria-describedby attribute', async () => {
      const ariaDescribedBy = await toolTipsPage.sectionLink.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBe('sectionToolTip');
    });
  });
});
