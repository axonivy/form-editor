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
  const reference = badge.locator.getByRole('button', { name: 'form.input.value.required', exact: true });
  await expect(reference).toBeVisible();

  const actionLog = page.waitForEvent('console', message => message.type() === 'log' && message.text().includes('"actionId":"openUrl"'));
  await reference.click();
  const action = (await actionLog).text();
  expect(action).toContain('"actionId":"openUrl"');
  expect(action).toContain('https://developer.axonivy.com/doc/14.0/en/reference/validation/codes/form.input.value.required.html');
});

test('global sidebar', async ({ page }) => {
  const { canvas, inscription } = await FormEditor.openMock(page);
  await canvas.blockByText('Address').inscribe();
  await expect(inscription.messages).toHaveCount(1);
  await expect(inscription.messages).toHaveText('Global warning');
  await expect(inscription.messages.getByRole('button', { name: 'form.global.warning', exact: true })).toBeVisible();
});
