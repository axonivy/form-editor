import { expect, test, type Page } from '@playwright/test';
import { FormEditor } from '../../page-objects/form-editor';

test('default', async ({ page }) => {
  const { editor, type, columns, justify, behaviour } = await layout(page);
  await type.expectValue('Grid');
  await columns.expectValue('2 Columns');
  await expect(justify.locator).toBeHidden();
  await type.choose('Flex');
  await expect(columns.locator).toBeHidden();
  await expect(justify.locator).toBeVisible();
  await justify.choose('Right');
  await behaviour.fillVisible();

  await reload(editor);
  await type.expectValue('Flex');
  await expect(columns.locator).toBeHidden();
  await justify.expectSelected('Right');
  await type.choose('Grid');
  await columns.choose('Free');

  await reload(editor);
  await type.expectValue('Grid');
  await columns.expectValue('Free');
  await expect(justify.locator).toBeHidden();
  await behaviour.expectVisible();
});

test('children in free layout', async ({ page }) => {
  const { editor, layoutBlock, properties, columns } = await layout(page);
  await editor.createBlock('Input', layoutBlock.block);
  const inputBlock = editor.canvas.blockByNth(0);
  const layoutTab = editor.inscription.section('Layout');
  const alignSelf = layoutTab.collapsible('General').toggleGroup({ label: 'Vertical Alignement' });
  const largeSpan = layoutTab.collapsible('General').select({ label: 'Large Span' });
  const mediumSpan = layoutTab.collapsible('General').select({ label: 'Medium Span' });

  await inputBlock.select();
  await expect(layoutTab.tabButtonLocator).toBeVisible();

  await layoutBlock.select();
  await columns.choose('Free');
  await inputBlock.select();
  await expect(layoutTab.tabButtonLocator).toBeVisible();
  await layoutTab.toggle();
  await alignSelf.expectSelected('Top');
  await largeSpan.expectValue('3');
  await mediumSpan.expectValue('6');
  await alignSelf.choose('Center');
  await largeSpan.choose('1');
  await mediumSpan.choose('2');

  await reload(editor);
  await properties.expectOpen();
  await inputBlock.select();
  await layoutTab.toggle();
  await alignSelf.expectSelected('Center');
  await largeSpan.expectValue('1');
  await mediumSpan.expectValue('2');

  await layoutBlock.select();

  await properties.toggle();
  await columns.choose('4 Columns');
  await inputBlock.select();
  await expect(layoutTab.tabButtonLocator).toBeVisible();
  await layoutTab.toggle();
  await expect(alignSelf.locator).toBeVisible();
  await expect(largeSpan.locator).toBeHidden();
  await expect(mediumSpan.locator).toBeHidden();

  await layoutBlock.select();
  await properties.toggle();
  await columns.choose('1 Column');
  await expect(layoutTab.tabButtonLocator).toBeHidden();
});

test('1 col grid', async ({ page }) => {
  const { type, columns } = await layout(page);
  await type.expectValue('Grid');
  await columns.expectValue('2 Columns');
  await columns.choose('1 Column');
});

test('extract Dialog', async ({ page }) => {
  const { editor, layoutBlock } = await layout(page);
  await editor.createBlock('Input', layoutBlock.block);
  await layoutBlock.quickAction('Extract into own Ivy Component (E)');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue('layout1');
  await expect(dialog.getByRole('textbox', { name: 'Namespace' })).toHaveValue('temp');
  await expect(dialog.getByRole('combobox', { name: 'Data Class' })).toHaveText(/data/);

  await editor.page.keyboard.press('a');
  await expect(page.getByRole('dialog').getByText('Extract layout1 into own Ivy Component')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Create from data')).toBeHidden();
});

const layout = async (page: Page) => {
  const editor = await FormEditor.openNewForm(page, { block: 'Layout' });
  const layoutBlock = editor.canvas.blockByNth(0, { layout: true });
  await layoutBlock.inscribe();
  await editor.inscription.expectHeader('Layout');
  const properties = editor.inscription.section('Properties');
  const section = properties.collapsible('General');
  const type = section.select({ label: 'Type' });
  const columns = section.select({ label: 'Columns' });
  const justify = section.toggleGroup({ label: 'Horizontal Alignment' });
  const behaviour = properties.behaviour();
  return { editor, layoutBlock, properties, type, columns, justify, behaviour };
};

const reload = async (editor: FormEditor) => {
  await editor.page.reload();
  await editor.canvas.blockByNth(0, { layout: true }).inscribe();
};
