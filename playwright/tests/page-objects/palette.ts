import { expect, type Locator, type Page } from '@playwright/test';

export class Palette {
  protected readonly page: Page;
  protected readonly palette: Locator;

  constructor(page: Page) {
    this.page = page;
    this.palette = page.locator('.ui-palette');
  }

  paletteItem(name: string) {
    return this.palette.locator(`.ui-palette-item >> text="${name}"`).first();
  }

  async dndTo(name: string, target: Locator) {
    const item = this.paletteItem(name);
    await item.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(10, 10);
    await expect(this.palette).toBeHidden();
    // eslint-disable-next-line playwright/no-force-option
    await target.hover({ force: true });
    await this.page.mouse.up();
  }

  async filter(search: string) {
    await this.palette.getByRole('textbox').fill(search);
  }

  async expectSections(sections: Array<string>) {
    await expect(this.palette.locator('.ui-palette-section-title')).toHaveCount(sections.length);
    for (let i = 0; i < sections.length; i++) {
      await expect(this.palette.locator('.ui-palette-section-title').nth(i)).toHaveText(sections[i]!);
    }
  }
}
