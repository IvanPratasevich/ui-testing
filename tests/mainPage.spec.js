import { test, expect } from '@playwright/test';
import { AdBlock } from '../src/utils';

test.beforeEach(async ({ page }) => {
  await AdBlock.blockAds(page);
  await page.goto('https://demoqa.com', { waitUntil: 'domcontentloaded' });
});
