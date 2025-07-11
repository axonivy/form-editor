import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { screenshotElement } from './screenshot-util';

test('create from data', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/test/test');
  await editor.toolbar.dataButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('row', { name: 'address' })).toBeVisible();
  await screenshotElement(dialog, 'dialog-create-from-data');
});

test('cms browser', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/free/free');
  await editor.canvas.blockByText('Address').inscribe();
  const browser = await editor.inscription.section('Properties').collapsible('General').input({ label: 'Label' }).openBrowser();
  await browser.expectEntries(['form-test-project', 'greetings']);
  await screenshotElement(browser.view, 'dialog-cms-browser');
});

test('logic browser', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/free/free');
  await editor.canvas.blockByText('Proceed').inscribe();
  const browser = await editor.inscription.section('Properties').collapsible('General').input({ label: 'Action' }).openBrowser();
  await browser.expectEntries(['Events', 'close', 'Methods']);
  await screenshotElement(browser.view, 'dialog-logic-browser');
});

test('data browser', async ({ page }) => {
  const editor = await FormEditor.openForm(page, 'src_hd/form/test/project/test/test');
  await editor.canvas.blockByText('City').inscribe();
  const browser = await editor.inscription.section('Properties').collapsible('General').input({ label: 'Value' }).openBrowser();
  await browser.expectEntries(['data', 'address', 'age', 'name', 'person']);
  await screenshotElement(browser.view, 'dialog-data-browser');
});
