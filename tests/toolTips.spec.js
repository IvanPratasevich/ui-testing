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
    await toolTipsPage.hoverOnButton();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltip);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltip);
    expect(tooltipText).toContain('You hovered over the Button');
  });

  test('Test 2: tooltip appears on text field hover', async ({ page }) => {
    await toolTipsPage.hoverOnTextField();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipText);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipText);
    expect(tooltipText).toContain('You hovered over the text field');
  });

  test('Test 3: tooltip appears on Contrary link hover', async ({ page }) => {
    await toolTipsPage.hoverOnContraryLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipContrary);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipContrary);
    expect(tooltipText).toContain('You hovered over the Contrary');
  });

  test('Test 4: tooltip appears on section link hover', async ({ page }) => {
    await toolTipsPage.hoverOnSectionLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipSection);
    expect(isVisible).toBe(true);

    const tooltipText = await toolTipsPage.getTooltipText(toolTipsPage.tooltipSection);
    expect(tooltipText).toContain('You hovered over the 1.10.32');
  });

  test('Test 5: all tooltips are different', async ({ page }) => {
    const tooltips = [];

    await toolTipsPage.hoverOnButton();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
    tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltip));

    await toolTipsPage.hoverOnTextField();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
    tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipText));

    await toolTipsPage.hoverOnContraryLink();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
    tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipContrary));

    await toolTipsPage.hoverOnSectionLink();
    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
    tooltips.push(await toolTipsPage.getTooltipText(toolTipsPage.tooltipSection));

    const uniqueTooltips = new Set(tooltips);
    expect(uniqueTooltips.size).toBe(4);
    expect(tooltips.length).toBe(4);
  });

  test('Test 6: aria-describedby appears on button hover', async ({ page }) => {
    await toolTipsPage.hoverOnButton();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltip);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltip);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.hoverButton.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('buttonToolTip');
  });

  test('Test 7: aria-describedby appears on text field hover', async ({ page }) => {
    await toolTipsPage.hoverOnTextField();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipText);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipText);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.hoverTextField.getAttribute('aria-describedby'); // ЛОКАТОР
    expect(ariaDescribedBy).toBe('textFieldToolTip');
    console.log('TextField aria-describedby:', ariaDescribedBy);
  });

  test('Test 8: aria-describedby appears on Contrary link hover', async ({ page }) => {
    await toolTipsPage.hoverOnContraryLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipContrary);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipContrary);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.contraryLink.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('contraryTexToolTip');
  });

  test('Test 9: aria-describedby appears on section link hover', async ({ page }) => {
    await toolTipsPage.hoverOnSectionLink();

    await toolTipsPage.waitForElementVisible(toolTipsPage.tooltipSection);
    const isVisible = await toolTipsPage.isTooltipVisible(toolTipsPage.tooltipSection);
    expect(isVisible).toBe(true);

    const ariaDescribedBy = await toolTipsPage.sectionLink.getAttribute('aria-describedby');
    expect(ariaDescribedBy).toBe('sectionToolTip');
  });
});
