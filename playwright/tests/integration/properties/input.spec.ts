import { expect, test } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Input' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const value = section.input({ label: 'Value' });
  const type = section.select({ label: 'Type' });
  const formattingSection = properties.collapsible('Formatting');
  const decimalPlaces = formattingSection.input({ label: 'Decimal Places', type: 'number' });
  const symbol = formattingSection.input({ label: 'Symbol', type: 'text' });
  const symbolPosition = formattingSection.select({ label: 'Symbol Position' });
  const behaviour = properties.behaviour();

  await label.expectValue('Input');
  await value.expectValue('');
  await type.expectValue('Text');
  await label.fill('New Label');
  await value.fill('New Value');
  await type.choose('Number');
  await decimalPlaces.expectValue('0');
  await symbol.expectValue('');
  await decimalPlaces.fill('2');
  await symbol.fill('CHF ');
  await symbolPosition.choose('Prefix');
  await behaviour.fillRequired();

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await label.expectValue('New Label');
  await value.expectValue('New Value');
  await type.expectValue('Number');
  await decimalPlaces.expectValue('2');
  await symbol.expectValue('CHF ');
  await symbolPosition.expectValue('Prefix');
  await behaviour.expectRequired();
});

test('email', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Input' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const type = section.select({ label: 'Type' });
  const validation = section.input({ label: 'Validation Message' });

  await type.expectValue('Text');
  await type.choose('E-Mail');
  await validation.expectValue('Invalid E-Mail');
  await validation.fill('Please enter a valid email address');

  await page.reload();
  await editor.canvas.blockByNth(0).inscribe();
  await validation.expectValue('Please enter a valid email address');
});

test('id', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  await editor.canvas.blockByNth(0).inscribe();
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const id = section.input({ label: 'Id', type: 'text' });
  await expect(id.inputLocator).toHaveAttribute('placeholder', 'Input1');
  await id.expectEmpty();
});

test('cmsQuickfix', async ({ page }) => {
  const editor = await FormEditor.openMock(page);
  const block = editor.canvas.blockByNth(0);
  await block.inscribe();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });

  await label.expectValue('Firstname');
  await label.selectText();
  await label.openQuickfix();
  await block.inscribe();
  await label.expectValue('Firstname');
  await label.expectInputValue("#{ivy.cms.co('/Labels/Firstname')}");
});

test('cmsToolTip', async ({ page }) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Input' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.expectHeader('Input');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const label = section.input({ label: 'Label' });
  const badge = label.outputLocator!.locator('.ui-input-badge-item').first();

  await label.fill("#{ivy.cms.co('/greetings')}");
  await label.blur();
  await expect(badge).toContainText('greetings');

  await badge.hover();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible({ timeout: 1500 });
  await expect(tooltip).toContainText('/greetingsen: Hello World');
});
