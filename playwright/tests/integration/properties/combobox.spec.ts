import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Combobox' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Combobox');
  const properties = editor.inscription.section('Properties');
  const general = properties.collapsible('General');
  const label = general.input({ label: 'Label' });
  const value = general.input({ label: 'Value' });
  const options = properties.collapsible('Options');
  const complete = options.input({ label: 'Complete Method' });
  const itemLabel = options.input({ label: 'Item Label', type: 'text' });
  const itemValue = options.input({ label: 'Item Value', type: 'text' });
  const button = options.checkbox({ label: 'Add Dropdown-Button to Combobox' });
  const behaviour = properties.behaviour();

  await label.expectValue('Combobox');
  await value.expectValue('');
  await complete.expectValue('');
  await expect(itemLabel.locator).toBeHidden();
  await expect(itemValue.locator).toBeHidden();
  await button.expectValue(false);
  await label.fill('Hi');
  await value.fill('#{data.zag}');
  await complete.fill('#{data.complete}');
  await itemLabel.expectValue('#{item}');
  await itemValue.expectValue('#{item}');
  await itemLabel.fill('label');
  await itemValue.fill('value');
  await button.check();
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('Hi');
  await value.expectValue('zag');
  await complete.expectValue('complete');
  await itemLabel.expectValue('label');
  await itemValue.expectValue('value');
  await button.expectValue(true);
  await behaviour.expectRequired();
});
