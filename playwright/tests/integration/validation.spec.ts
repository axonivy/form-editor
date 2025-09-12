import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('canvas', async ({ page }) => {
  const { canvas } = await FormEditor.openMock(page);
  await expect(canvas.blockByText('Firstname').block).not.toHaveClass(/validation/);
  await expect(canvas.blockByText('Address').block).toHaveClass(/validation error/);
  await expect(canvas.blockByText('City').block).toHaveClass(/validation warning/);
});

test('inscription input', async ({ page }) => {
  const { canvas, inscription } = await FormEditor.openMock(page);
  await canvas.blockByText('Address').inscribe();
  const badge = inscription.section('Properties').collapsible('General').input({ label: 'Value' });
  await expect(badge.locator).toBeVisible();
  await expect(badge.outputLocator!).toHaveAccessibleDescription(/Value is required/);
});

test('global sidebar', async ({ page }) => {
  const { canvas, inscription } = await FormEditor.openMock(page);
  await canvas.blockByText('Address').inscribe();
  await expect(inscription.messages).toHaveCount(1);
  await expect(inscription.messages).toHaveText('Global warning');
});
