import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test.describe('empty', () => {
  test('create init', async ({ page }) => {
    const { canvas } = await FormEditor.openNewForm(page);
    const dialog = await canvas.openInitCreateDialog();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();

    await canvas.openInitCreateDialog();
    await dialog.getByRole('button', { name: 'Create' }).click();
    await expect(dialog).toBeHidden();
    await expect(canvas.blockByText('Cancel').block).toBeVisible();
    await expect(canvas.blockByText('Proceed').block).toBeVisible();
  });

  test('init data', async ({ page }) => {
    const { canvas } = await FormEditor.openForm(page, 'src_hd/form/test/project/empty/empty');
    const dialog = await canvas.openInitCreateDialog();
    await expect(dialog.getByRole('row')).toHaveCount(5);
  });

  test('keyboard', async ({ page }) => {
    await FormEditor.openMock(page);
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeHidden();
    await page.keyboard.press('a');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('row')).toHaveCount(2);
  });
});

test.describe('dnd', () => {
  test('move', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').dndTo(canvas.blockByText('Address'));
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);
  });

  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    const dropZone = canvas.locator.locator('.delete-drop-zone');
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').block.hover();
    await page.mouse.down();
    await expect(dropZone).toBeHidden();
    await page.mouse.move(10, 10);
    await expect(dropZone).toBeVisible();
    await dropZone.hover();
    await page.mouse.up();
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });
});

test.describe('keyboard', () => {
  test('move', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('ArrowDown');
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);
    await page.keyboard.press('ArrowDown');
    await canvas.expectFormOrder(['Lastname', 'Address', 'Firstname']);
  });

  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('Delete');
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });

  test('enter', async ({ page }) => {
    const { canvas, inscription } = await FormEditor.openMock(page);
    await expect(inscription.view).toBeHidden();
    const block = canvas.blockByText('Firstname');
    await block.select();
    await page.keyboard.press('Enter');
    await block.expectSelected();
    await expect(inscription.view).toBeVisible();
    await inscription.expectHeader('Input');
  });

  test('undo/redo', async ({ page, browserName }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('ArrowDown');
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);

    await page.keyboard.press('ControlOrMeta+z');
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await page.keyboard.press(browserName === 'webkit' ? 'ControlOrMeta+Shift+z' : 'ControlOrMeta+y');
    await canvas.expectFormOrder(['Lastname', 'Firstname', 'Address']);
  });

  test('copy paste', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Was not able to make it work on webkit');
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname']);
    await canvas.blockByText('Firstname').select();
    await page.keyboard.press('ControlOrMeta+c');
    await canvas.blockByText('Address').select();
    await page.keyboard.press('ControlOrMeta+v');
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Firstname']);
  });

  test('cut paste', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Was not able to make it work on webkit');
    const editor = await FormEditor.openNewForm(page);
    const canvas = editor.canvas;
    await editor.createBlock('Input');
    await canvas.expectFormOrder(['Input']);
    await canvas.blockByNth(0).select();
    await page.keyboard.press('ControlOrMeta+x');
    await canvas.expectEmpty();
    await canvas.locator.click();
    await page.keyboard.press('ControlOrMeta+v');
    await canvas.expectFormOrder(['Input']);
  });
});

test.describe('quickbar', () => {
  test('delete', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').quickAction('Delete');
    await canvas.expectFormOrder(['Lastname', 'Address']);
  });

  test('duplicate', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname']);
    await canvas.blockByText('Firstname').quickAction('Duplicate');
    await canvas.expectFormOrder(['Firstname', 'Firstname', 'Lastname']);
  });

  test('change', async ({ page }) => {
    const editor = await FormEditor.openMock(page);
    await editor.canvas.blockByText('Firstname').inscribe();
    await editor.inscription.expectHeader('Input');
    const properties = editor.inscription.section('Properties');
    const section = properties.collapsible('General');
    const label = section.input({ label: 'Label' });
    const value = section.input({ label: 'Value' });
    const type = section.select({ label: 'Type' });
    await label.expectValue('Firstname');
    await value.expectValue('data.value');
    await type.expectValue('Text');
    await type.choose('Number');

    await editor.canvas.blockByText('Firstname').quickAction('Change Type');
    await expect(page.getByRole('dialog').last().getByRole('button')).toHaveCount(8);
    await page.getByRole('button', { name: 'Textarea' }).click();

    await editor.inscription.expectHeader('Textarea');
    await label.expectValue('Firstname');
    await value.expectValue('data.value');
    const rows = section.input({ label: 'Visible Rows', type: 'number' });
    await rows.expectValue('5');

    await editor.canvas.blockByText('Firstname').quickAction('Change Type');
    await page.getByRole('button', { name: 'Input' }).click();
    await editor.inscription.expectHeader('Input');
    await label.expectValue('Firstname');
    await value.expectValue('data.value');
    await type.expectValue('Text');

    await editor.canvas.blockByText('Proceed').quickAction('Change Type');
    await expect(page.getByRole('dialog').last().getByRole('button')).toHaveCount(1);
  });

  test('add', async ({ page }) => {
    const { canvas } = await FormEditor.openMock(page);
    await canvas.expectFormOrder(['Firstname', 'Lastname', 'Address']);
    await canvas.blockByText('Firstname').quickAction('Add new Component');
    await page.getByRole('button', { name: 'Input' }).click();
    await canvas.expectFormOrder(['Input', 'Firstname', 'Lastname', 'Address']);
  });
});

test('icon fonts', async ({ page }) => {
  const { canvas } = await FormEditor.openForm(page);
  await expect(canvas.locator.locator('.si.si-check-1').first()).toBeVisible();
  await expect(canvas.locator.locator('.pi.pi-times').first()).toBeVisible();
});
