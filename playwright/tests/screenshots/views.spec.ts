import { test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { screenshot } from './screenshot-util';

test('properties', async ({ page }) => {
  const editor = await FormEditor.openForm(page, { file: 'src_hd/form/test/project/free/free.f.json' });
  await editor.canvas.blockByNth(0).inscribe();
  await screenshot(page, 'view-properties', { height: 550, width: 1000 });
});

test('outline', async ({ page }) => {
  const editor = await FormEditor.openForm(page, { file: 'src_hd/form/test/project/free/free.f.json' });
  await editor.canvas.blockByNth(0).inscribe();
  await editor.inscription.toggleOutline();
  await screenshot(page, 'view-outline', { height: 550, width: 1000 });
});
