import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('elements', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const inscription = editor.inscription;
  await expect(inscription.view).toBeHidden();
  await editor.canvas.blockByNth(0).inscribe();
  await expect(inscription.view).toBeVisible();
  await inscription.expectHeader('Input');

  await editor.canvas.locator.click({ position: { x: 10, y: 10 } });
  await expect(inscription.view).toBeHidden();

  await editor.toolbar.toggleProperties();
  await expect(inscription.view).toBeVisible();
  await inscription.expectHeader('Form');
  await inscription.section('Properties').collapsible('General').input({ label: 'Title' }).expectValue('Mock Form');
});
