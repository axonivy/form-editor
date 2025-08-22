import { expect, type Locator, type Page } from '@playwright/test';
import { Block } from './block';

export class Canvas {
  protected readonly page: Page;
  public readonly locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.canvas');
  }

  blockByText(text: string) {
    return new Block(this.page, this.locator, { text });
  }

  blockByNth(
    nth: number,
    options?: {
      layout?: boolean;
      datatable?: boolean;
      column?: boolean;
      actionButton?: boolean;
      dialog?: boolean;
      dialogContent?: boolean;
      datatableNth?: number;
      columnNth?: number;
    }
  ) {
    return new Block(this.page, this.locator, { nth, ...options });
  }

  get dropZone() {
    return this.locator.locator('.drop-zone').last();
  }

  async openInitCreateDialog() {
    await this.expectEmpty();
    await this.locator.getByRole('button', { name: 'Create from data' }).click();
    return this.page.getByRole('dialog');
  }

  async expectEmpty() {
    await expect(this.locator.locator('.drag-hint')).toHaveCount(1);
  }

  async expectHelpPaddings(paddings: boolean) {
    const draggable = this.locator.locator('.draggable').first();
    const emptyBlock = this.locator.locator('.empty-block').first();
    if (paddings) {
      await expect(draggable).toHaveCSS('padding', '8px 16px');
      await expect(draggable).toHaveCSS('margin', '8px');
      await expect(emptyBlock).toBeVisible();
    } else {
      await expect(draggable).toHaveCSS('padding', '0px');
      await expect(draggable).toHaveCSS('margin', '0px');
      await expect(emptyBlock).toBeHidden();
    }
  }

  async expectFormOrder(expected: Array<string>) {
    for (let i = 0; i < expected.length; i++) {
      await expect(this.blockByNth(i).block).toContainText(expected[i]!);
    }
  }
}
