import type { Locator, Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { Canvas } from './canvas';
import { Inscription } from './inscription';
import { Toolbar } from './toolbar';

export const server = process.env.BASE_URL ?? 'http://localhost:8080/~Developer-form-test-project';
export const user = 'Developer';
const ws = process.env.TEST_WS ?? '';
const app = process.env.TEST_APP ?? 'Developer-form-test-project';
const pmv = 'form-test-project';

export class FormEditor {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private static async open(page: Page, url = '') {
    await page.goto(url);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new FormEditor(page);
  }

  static async openForm(page: Page, options?: { file?: string; readonly?: boolean; theme?: string }) {
    const serverUrl = server.replace(/^https?:\/\//, '');
    let url = `?server=${serverUrl}${ws}&app=${app}&pmv=${pmv}`;
    if (options?.file === undefined) {
      url += '&file=src_hd/form/test/project/test/test.f.json';
    }
    if (options) {
      url += Object.entries(options)
        .map(([key, value]) => `&${key}=${value}`)
        .join('');
    }
    return await this.open(page, url);
  }

  static async openNewForm(page: Page, options?: { block?: string }) {
    const name = `tmp${randomUUID().replaceAll('-', '')}`;
    const namespace = 'temp';
    const result = await fetch(`${server}${ws}/api/web-ide/hd`, {
      method: 'POST',
      headers: {
        'X-Requested-By': 'form-editor-tests',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(user + ':' + user).toString('base64')
      },
      body: JSON.stringify({ namespace, name, type: 'Form', project: { app, pmv } })
    });
    if (!result.ok) {
      console.log(`Failed to create form: ${result.status}`);
    }
    const editor = await this.openForm(page, { file: `src_hd/${namespace}/${name}/${name}.f.json` });
    if (options?.block) {
      await editor.createBlock(options.block);
    }
    return editor;
  }

  static async openMock(page: Page, datatable: boolean = false) {
    const url = `mock.html?datatable=${datatable}`;
    return await this.open(page, url);
  }

  get toolbar() {
    return new Toolbar(this.page);
  }

  get canvas() {
    return new Canvas(this.page);
  }

  get inscription() {
    return new Inscription(this.page);
  }

  async createBlock(block: string, target?: Locator) {
    const palette = await this.toolbar.openPalette('All Components');
    await palette.dndTo(block, target ?? this.canvas.dropZone);
  }
}
