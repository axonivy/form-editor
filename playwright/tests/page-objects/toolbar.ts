import { expect, type Locator, type Page } from '@playwright/test';
import { Palette } from './palette';

export class Toolbar {
  protected readonly page: Page;
  readonly locator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator('.toolbar');
  }

  get undoButton() {
    return this.locator.getByRole('button', { name: 'Undo' });
  }

  get redoButton() {
    return this.locator.getByRole('button', { name: 'Redo' });
  }

  get helpPaddings() {
    return this.locator.getByRole('button', { name: 'View Mode' });
  }

  get palette() {
    return this.locator.locator('.palette-section');
  }

  get dataButton() {
    return this.locator.getByRole('button', { name: 'Create from data' });
  }

  get deviceModeButton() {
    return this.locator.getByRole('button', { name: 'Device mode' });
  }

  async openPalette(name: 'All Components' | 'Structures' | 'Elements' | 'Actions' | 'Composites') {
    await expect(async () => {
      const paletteBtn = this.palette.getByRole('button', { name });
      await expect(paletteBtn).toHaveAttribute('data-state', 'closed');
      await paletteBtn.click();
      await expect(paletteBtn).toHaveAttribute('data-state', 'open');
    }).toPass({ intervals: [100, 100, 100] });
    return new Palette(this.page);
  }

  async toggleProperties() {
    await this.locator.getByRole('button', { name: 'Toggle Property View' }).click();
  }

  private async openOptionsMenu() {
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeHidden();
    await this.locator.getByRole('button', { name: 'Options' }).click();
    await expect(dialog).toBeVisible();
    return dialog;
  }
}
