import { expect, type Locator, type Page } from '@playwright/test';

export class Browser {
  protected readonly page: Page;
  public readonly view: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByRole('dialog');
  }

  async close() {
    await this.view.getByRole('button', { name: 'Cancel' }).click();
  }

  async expectEntries(values: Array<string | RegExp>) {
    await expect(this.view.getByRole('row')).toHaveCount(values.length);
    for (let i = 0; i < values.length; i++) {
      await expect(this.view.getByRole('row').nth(i)).toContainText(values[i]!);
    }
  }
}
