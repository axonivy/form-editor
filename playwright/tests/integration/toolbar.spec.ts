import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('change device mode', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await toolbar.deviceModeButton.click();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'tablet');
  await toolbar.deviceModeButton.click();
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'mobile');
  await page.keyboard.press('s');
  await expect(editor.canvas.locator).toHaveAttribute('data-responsive-mode', 'desktop');
});

test('undo/redo', async ({ page, browserName }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeDisabled();

  await editor.canvas.locator.locator('.draggable').first().click();
  await page.keyboard.press('ArrowDown');
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();

  await toolbar.undoButton.click();
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeEnabled();

  await toolbar.redoButton.click();
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();

  await page.keyboard.press('ControlOrMeta+z');
  await expect(toolbar.undoButton).toBeDisabled();
  await expect(toolbar.redoButton).toBeEnabled();

  await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+z' : 'ControlOrMeta+Y');
  await expect(toolbar.undoButton).toBeEnabled();
  await expect(toolbar.redoButton).toBeDisabled();
});

test('palette', async ({ page }) => {
  const { toolbar } = await FormEditor.openMock(page);
  await expect(toolbar.palette.locator('.ui-palette-button')).toHaveCount(6);
});

test('help paddings', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await editor.canvas.expectHelpPaddings(true);
  await toolbar.helpPaddings.click();
  await editor.canvas.expectHelpPaddings(false);
  await page.keyboard.press('e');
  await editor.canvas.expectHelpPaddings(true);
});

test('properties', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const toolbar = editor.toolbar;
  await expect(editor.inscription.view).toBeHidden();
  await toolbar.toggleProperties();
  await expect(editor.inscription.view).toBeVisible();
  await editor.inscription.expectHeader('Form');
});

test('responsive', async ({ page }) => {
  const {
    toolbar: { palette, redoButton, undoButton }
  } = await FormEditor.openMock(page);
  const paletteBtn = palette.locator('.ui-palette-button-label:has-text("Structure")');
  await expect(paletteBtn).toBeVisible();
  await expect(undoButton).toBeVisible();
  await expect(redoButton).toBeVisible();

  await page.setViewportSize({ width: 600, height: 500 });
  await expect(paletteBtn).toBeHidden();
  await expect(undoButton).toBeVisible();
  await expect(redoButton).toBeVisible();

  await page.setViewportSize({ width: 400, height: 500 });
  await expect(paletteBtn).toBeHidden();
  await expect(undoButton).toBeHidden();
  await expect(redoButton).toBeHidden();
});

test('open preview', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = consoleLog(page);
  const openPreviewBtn = editor.toolbar.locator.getByRole('button', { name: 'Open Preview' });
  await openPreviewBtn.click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('s');
  expect(await msg2).toContain('openUrl');

  await editor.toolbar.toggleProperties();
  await editor.inscription.section('Properties').collapsible('General').select({ label: 'Form Type' }).choose('Component');
  await expect(openPreviewBtn).toBeHidden();
});

test('open process', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.toolbar.locator.getByRole('button', { name: 'Open Process' }).click();
  expect(await msg1).toContain('openProcess');

  const msg2 = consoleLog(page);
  await page.keyboard.press('p');
  expect(await msg2).toContain('openProcess');
});

test('open data class', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.toolbar.locator.getByRole('button', { name: 'Open Data Class' }).click();
  expect(await msg1).toContain('openDataClass');

  const msg2 = consoleLog(page);
  await page.keyboard.press('d');
  expect(await msg2).toContain('openDataClass');
});

test('help', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const msg1 = consoleLog(page);
  await editor.toolbar.toggleProperties();
  await editor.inscription.header.getByRole('button', { name: 'Open Help' }).click();
  expect(await msg1).toContain('openUrl');

  const msg2 = consoleLog(page);
  await page.keyboard.press('F1');
  expect(await msg2).toContain('openUrl');
  expect(await msg2).toContain('https://dev.axonivy.com');
});

test('focus jumps', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  await page.keyboard.press('1');
  await expect(editor.toolbar.deviceModeButton).toBeFocused();
  await page.keyboard.press('2');
  const firstElement = editor.canvas.blockByNth(0, { layout: true });
  await expect(firstElement.block).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor.inscription.view).toBeVisible();
  await expect(editor.inscription.section('Properties').tabButtonLocator).not.toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.inscription.section('Properties').tabButtonLocator).toBeFocused();
});

const consoleLog = async (page: Page) => {
  return new Promise(result => {
    page.on('console', msg => {
      if (msg.type() === 'log') {
        result(msg.text());
      }
    });
  });
};
