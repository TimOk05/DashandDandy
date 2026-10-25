const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 }
];

for (const viewport of viewports) {
  test(`${viewport.name} layout has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toContainText('proper pamper');
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    }));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
  });
}

test('mobile navigation opens, follows a link and closes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('[data-menu] a[href="#services"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#services$/);
});

test('enquiry builder validates and prepares an Instagram message', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-open-enquiry]').first().click();
  await expect(page.locator('[data-enquiry-dialog]')).toBeVisible();
  await page.locator('input[name="owner"]').fill('Alex');
  await page.locator('input[name="dog"]').fill('Milo');
  await page.locator('input[name="breed"]').fill('Cockapoo');
  await page.locator('select[name="service"]').selectOption({ label: 'Professional grooming' });
  await page.locator('[data-enquiry-form] button[type="submit"]').click();
  await expect(page.locator('[data-form-status]')).not.toBeEmpty();
  await expect(page.locator('[data-instagram-ready]')).toBeVisible();
});
