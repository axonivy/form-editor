import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const listOfObjects = section.input({ label: 'Data Source' });
  const editable = section.checkbox({ label: 'Editable' });
  const behaviour = properties.behaviour();

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.listItem({ label: 'header' });

  await listOfObjects.expectValue('');
  await editable.expectValue(false);
  await listOfObjects.fill('#{data.locations}');
  await columnHeader.expectButtonsCount(2);

  await behaviour.fillVisible();

  await page.reload();
  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await table.expectSelected();
  await listOfObjects.expectValue('locations');
  await behaviour.expectVisible();
});

test('dataTableColumn', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const header = section.input({ label: 'Header' });
  const content = properties.collapsible('Content');
  const value = content.input({ label: 'Value' });
  const behaviour = properties.behaviour();

  await header.expectValue('Header');
  await value.expectValue('');
  await header.fill('new header');
  await value.fill('title');

  await behaviour.fillVisible();

  await page.reload();
  await editor.canvas.blockByNth(1).inscribe();
  await header.expectValue('new header');
  await value.expectValue('title');
  await behaviour.expectVisible();
});

test('edit column and update table', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const columnProperties = editor.inscription.section('Properties');
  const columnSection = columnProperties.collapsible('General');
  const contentSection = columnProperties.collapsible('Content');
  const header = columnSection.input({ label: 'Header' });
  const value = contentSection.input({ label: 'Value' });

  await header.expectValue('Header');
  await value.expectValue('');
  await header.fill('new header');
  await value.fill('title');

  const table = editor.canvas.blockByNth(0, { datatable: true });

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');
  const properties = editor.inscription.section('Properties');

  const columnsSection = properties.collapsible('Columns');
  const columnHeader = columnsSection.listItem({ label: 'new header' });

  await columnHeader.pressButton(1);
  await editor.inscription.expectHeader('DataTableColumn');
  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');

  await columnsSection.expectListItems(1);
  await columnHeader.pressButton(0);
  await columnsSection.expectListItems(0);
});

test('columns from attribute', async ({ page }) => {
  const editor = await FormEditor.openMock(page, true);
  const table = editor.canvas.blockByNth(0, { datatable: true });
  await table.block.getByRole('button').click();

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTable');

  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const listOfObjects = section.input({ label: 'Data Source' });

  const columnsSection = properties.collapsible('Columns');
  await columnsSection.expectListItems(3);
  await listOfObjects.expectValue('data.persons');

  const columnBirthdayNew = columnsSection.listItem({ label: 'birthday' });
  const columnAddressNew = columnsSection.listItem({ label: 'address' });
  const columnFirstNameNew = columnsSection.listItem({ label: 'firstname' });

  await columnBirthdayNew.expectBound(true);
  await columnAddressNew.expectBound(true);
  await columnFirstNameNew.expectBound(true);

  await listOfObjects.fill('#{data.data.strings}');
  await columnsSection.toggleControl();
  await columnsSection.expectListItems(4);
  const columnString = columnsSection.listItem({ label: 'currentRow' });

  await columnString.expectBound(true);
  await columnAddressNew.expectBound(false);
  await columnBirthdayNew.expectBound(false);
  await columnFirstNameNew.expectBound(false);
});

test('dataTableAction', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'DataTable' });
  await editor.canvas.blockByNth(0).quickAction('Create Action Column');
  await editor.canvas.blockByNth(1).inscribe();
  await editor.inscription.expectHeader('DataTableColumn');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const header = section.input({ label: 'Header' });
  await header.expectValue('Action');
  const asActionColumn = section.checkbox({ label: 'Action Column' });
  await asActionColumn.expectValue(true);

  const contentSection = properties.collapsible('Content');
  await contentSection.expectListItems(0);
  await contentSection.toggleControl();
  await contentSection.expectListItems(1);

  await editor.canvas.blockByNth(2).inscribe();
  await editor.inscription.expectHeader('Button');

  const buttonProperties = editor.inscription.section('Properties');
  const buttonSection = buttonProperties.collapsible('General');
  const name = buttonSection.input({ label: 'Display Text' });
  await name.expectValue('Action');
  await name.fill('Delete');

  await editor.canvas.blockByNth(1).block.dblclick({ position: { x: 10, y: 10 } });

  const deletButton = contentSection.listItem({ label: 'Delete' });
  await deletButton.expectLabel('Delete');

  await contentSection.toggleControl();
  await contentSection.expectListItems(2);

  const buttonAction = contentSection.listItem({ label: 'Action' });
  await buttonAction.expectLabel('Action');
});

test('editable datatable', async ({ page }) => {
  const editor = await FormEditor.openMock(page, true);
  const table = editor.canvas.blockByNth(0, { datatable: true });
  await table.block.getByRole('button').click();

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const editable = section.checkbox({ label: 'Editable' });

  await editable.expectValue(false);
  const columnsSection = properties.collapsible('Columns');
  await columnsSection.expectListItems(3);
  await editable.check();

  const addButton = section.checkbox({ label: 'Add Button' });
  await addButton.expectValue(true);
  await columnsSection.expectListItems(4);
  const actionColumn = editor.canvas.blockByNth(3, { datatableNth: 0, column: true });
  await actionColumn.select({ position: { x: 10, y: 10 } });
  await editor.inscription.expectHeader('DataTableColumn');

  const contentSection = properties.collapsible('Content');
  await contentSection.expectListItems(2);
  const editButton = editor.canvas.blockByNth(0, { datatableNth: 0, columnNth: 3, actionButton: true });
  const deleteButton = editor.canvas.blockByNth(1, { datatableNth: 0, columnNth: 3, actionButton: true });
  await editButton.select({ force: true });
  const buttonType = section.select({ label: 'type' });
  await buttonType.expectValue('Edit');

  await deleteButton.select({ force: true });
  await buttonType.expectValue('Delete');

  const dialog = editor.canvas.blockByNth(0, { datatableNth: 0, dialog: true });
  await dialog.select();
  await dialog.block.getByRole('button').first().click();

  const createDialog = page.getByRole('dialog');
  await createDialog.getByRole('row', { name: 'row' }).first().click();
  await createDialog.getByRole('button', { name: 'Create' }).click();

  await expect(dialog.block.locator('.draggable:has(>.block-input)')).toHaveCount(3);
  const addressInput = editor.canvas.blockByNth(0, { datatableNth: 0, dialogContent: true });
  await addressInput.block.dblclick();
  const inputValue = section.input({ label: 'Value' });
  await inputValue.expectValue('address.address');

  const birthdayInput = editor.canvas.blockByNth(1, { datatableNth: 0, dialogContent: true });
  await birthdayInput.block.dblclick({ position: { x: 20, y: 10 } });
  await inputValue.expectValue('birthday');

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  await editable.uncheck();

  await actionColumn.select();
  await columnsSection.expectListItems(0);
  await expect(table.block.locator('block-table__dialog')).toBeHidden();
});

test('editable datatable buttons', async ({ page }) => {
  const editor = await FormEditor.openMock(page, true);
  const table = editor.canvas.blockByNth(0, { datatable: true });
  await table.block.getByRole('button').click();

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const editable = section.checkbox({ label: 'Editable' });
  const columnsSection = properties.collapsible('Columns');

  await editable.check();
  await columnsSection.expectListItems(4);
  const deleteButton = editor.canvas.blockByNth(1, { datatableNth: 0, columnNth: 3, actionButton: true });
  await deleteButton.quickAction('Delete', true);

  const actionColumn = editor.canvas.blockByNth(3, { datatableNth: 0, column: true });
  await actionColumn.select({ position: { x: 10, y: 10 } });

  const contentSection = properties.collapsible('Content');
  await contentSection.expectListItems(1);

  const editButton = editor.canvas.blockByNth(0, { datatableNth: 0, columnNth: 3, actionButton: true });
  await editButton.select({ force: true });

  const buttonType = section.select({ label: 'type' });
  await buttonType.expectValue('Edit');

  await buttonType.choose('Delete');
  await buttonType.expectValue('Delete');

  await table.quickAction('Create Action Column');
  const newActionColumn = editor.canvas.blockByNth(4, { datatableNth: 0, column: true });
  await newActionColumn.quickAction('Create Action Column Button');
  const newActionColumnButton = editor.canvas.blockByNth(0, { datatableNth: 0, columnNth: 4, actionButton: true });
  await newActionColumnButton.block.dblclick();

  await buttonType.expectValue('Generic');
  await buttonType.choose('Edit');
  await buttonType.expectValue('Edit');
});
