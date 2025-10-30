import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Button' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Button');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const name = section.input({ label: 'Display Text' });
  const action = section.input({ label: 'Action' });
  const bypassValidation = section.checkbox({ label: 'Run action without validation' });
  const styleSection = properties.collapsible('Styling');
  const variant = styleSection.select({ label: 'Variant' });
  const style = styleSection.select({ label: 'Style' });
  const rounded = styleSection.checkbox({ label: 'Rounded Corners' });
  const behaviour = properties.behaviour();

  await name.expectValue('Action');
  await action.expectValue('');
  await bypassValidation.expectValue(false);
  await variant.expectValue('Primary');
  await name.fill('Cancel');
  await action.fill('#{logic.close}');
  await bypassValidation.check();
  await variant.choose('Secondary');
  await style.choose('Outline');
  await rounded.check();
  await behaviour.fillDisable();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await name.expectValue('Cancel');
  await action.expectValue('close');
  await bypassValidation.expectValue(true);
  await variant.expectValue('Secondary');
  await style.expectValue('Outline');
  await rounded.expectValue(true);
  await behaviour.excpectDisabled();
});

test('confirm dialog section', async ({ page }) => {
  const editor = await FormEditor.openMock(page, true);
  const table = editor.canvas.blockByNth(0, { datatable: true });
  await table.block.getByRole('button').click();

  await table.block.dblclick({ position: { x: 10, y: 10 } });
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const editable = section.checkbox({ label: 'Editable' });

  await editable.check();
  const deleteButton = editor.canvas.blockByNth(1, { datatableNth: 0, columnNth: 3, actionButton: true });
  await deleteButton.select({ force: true });

  const confirm = editor.inscription.section('Confirm');
  await confirm.toggle();
  const confirmGeneral = confirm.collapsible('General');
  const confirmDialog = confirmGeneral.checkbox({ label: 'Confirm Dialog' });
  const severity = confirmGeneral.select({ label: 'Severity' });
  const header = confirmGeneral.input({ label: 'Header' });
  const dialogMessage = confirmGeneral.input({ label: 'Dialog Message' });
  const confirmButton = confirmGeneral.input({ label: 'Confirm-Button Value' });
  const cancelButton = confirmGeneral.input({ label: 'Cancel-Button Value' });

  await confirmDialog.expectValue(true);
  await severity.expectValue('Warning');
  await header.expectValue('Delete Confirmation');
  await dialogMessage.expectValue(/Are you sure you want to delete row:\s*row\s*\?/);
  await header.expectValue('Delete Confirmation');
  await confirmButton.expectValue('Yes');
  await cancelButton.expectValue('No');
  await header.fill('Cancel');
  await dialogMessage.fill('Really?');
  await severity.choose('Info');
  await confirmButton.fill('Ok');
  await cancelButton.fill('Nop');

  await deleteButton.select({ force: true });
  await header.expectValue('Cancel');
  await dialogMessage.expectValue('Really?');
  await severity.expectValue('Info');
  await confirmButton.expectValue('Ok');
  await cancelButton.fill('Nop');

  await confirmDialog.uncheck();
  await expect(header.locator).toBeHidden();
  await expect(dialogMessage.locator).toBeHidden();
  await expect(severity.locator).toBeHidden();
  await expect(confirmButton.locator).toBeHidden();
  await expect(cancelButton.locator).toBeHidden();
});

test('tab state', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Button' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Button');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const action = section.input({ label: 'Action' });

  await action.expectValue('');
  await properties.expectState('error');
  await section.expectState('error');
  await action.fill('#{logic.close}');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await action.expectValue('close');
  await section.expectState(undefined);
  await properties.expectState(undefined);

  await action.fill('#{logic.clse}');
  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await action.expectValue('clse');
  await section.expectState('warning');
  await properties.expectState('warning');
});
