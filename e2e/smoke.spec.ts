import { test, expect } from '@playwright/test';

test('homepage renders and shows master–detail UI', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Master–Detail|Container–Presenter/i })).toBeVisible();
});
