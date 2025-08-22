import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';

test('outline', async ({ page }) => {
  const { outline } = await openOutline(page);
  await outline.view.getByRole('row').all();
  const rows = await outline.view.getByRole('row').all();
  await expect(rows[0]!).toHaveText('LayoutGRID');
  await expect(rows[1]!).toHaveText('InputFirstname');
  await expect(rows[2]!).toHaveText('InputLastname');
  await expect(rows[3]!).toHaveText('InputAddress');
  await expect(rows[4]!).toHaveText('SelectCity');
  await expect(rows[5]!).toHaveText('InputState');
  await expect(rows[6]!).toHaveText('InputZip');
  await expect(rows[7]!).toHaveText('LayoutFLEX');
  await expect(rows[8]!).toHaveText('ButtonCancel');
  await expect(rows[9]!).toHaveText('ButtonProceed');
  await expect(rows[10]!).toHaveText('FieldsetLegend');
  await expect(rows[11]!).toHaveText('InputTitle');
});

test('select element', async ({ page }) => {
  const { editor, outline } = await openOutline(page);
  await editor.canvas.blockByText('Firstname').select();
  await outline.expectSelected('Firstname');

  await editor.canvas.blockByText('Zip').select();
  await outline.expectSelected('Zip');
});

test('select node', async ({ page }) => {
  const { editor, outline } = await openOutline(page);
  await outline.select('Input Address');
  await editor.canvas.blockByText('Address').expectSelected();

  await outline.select('Cancel');
  await editor.canvas.blockByText('Cancel').expectSelected();

  await outline.select('City');
  await outline.doubleClick('City');
  await editor.canvas.blockByText('City').expectSelected();
  await outline.expectClosed();
});

const openOutline = async (page: Page) => {
  const editor = await FormEditor.openMock(page);
  await editor.toolbar.toggleProperties();
  const outline = await editor.inscription.toggleOutline();
  return { editor, outline };
};
