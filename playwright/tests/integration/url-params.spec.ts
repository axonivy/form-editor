import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('theme light', async ({ page }) => {
  await FormEditor.openForm(page, { theme: 'light' });
  await expect(page.locator('html')).toHaveClass('light');
});

test('theme dark', async ({ page }) => {
  await FormEditor.openForm(page, { theme: 'dark' });
  await expect(page.locator('html')).toHaveClass('dark');
});

test('readonly false', async ({ page }) => {
  const editor = await FormEditor.openForm(page, { readonly: false });
  await editor.canvas.expectHelpPaddings(true);
  await expect(editor.toolbar.redoButton).toBeVisible();
  await expect(editor.toolbar.undoButton).toBeVisible();
  await expect(editor.toolbar.helpPaddings).toBeVisible();
  await expect(editor.toolbar.palette).toBeVisible();
});

test('readonly true', async ({ page }) => {
  const editor = await FormEditor.openForm(page, { readonly: true });
  await editor.canvas.expectHelpPaddings(false);
  await expect(editor.toolbar.redoButton).toBeHidden();
  await expect(editor.toolbar.undoButton).toBeHidden();
  await expect(editor.toolbar.helpPaddings).toBeHidden();
  await expect(editor.toolbar.palette).toBeHidden();

  await page.keyboard.press('e');
  await editor.canvas.expectHelpPaddings(false);
  await page.keyboard.press('a');
  await expect(page.getByRole('dialog')).toBeHidden();

  const allBlocks = editor.canvas.locator.locator('.draggable');
  await expect(allBlocks).toHaveCount(12);
  // eslint-disable-next-line playwright/no-force-option
  await allBlocks.first().click({ force: true });
  await expect(allBlocks.first()).toHaveClass(/selected/);
  await expect(page.locator('.quickbar')).toBeHidden();
  await page.keyboard.press('m');
  await expect(allBlocks).toHaveCount(12);
  await page.keyboard.press('ControlOrMeta+c');
  await page.keyboard.press('ControlOrMeta+v');
  await expect(allBlocks).toHaveCount(12);
});
