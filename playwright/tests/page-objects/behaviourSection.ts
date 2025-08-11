import type { Checkbox, Collapsible, Input } from './inscription';

export class VisibleInput {
  visibleField: Input;

  constructor(behaviourSection: Collapsible) {
    this.visibleField = behaviourSection.input({ label: 'Visible' });
  }

  async fillVisible() {
    await this.visibleField.fill('true');
  }

  async expectVisible() {
    await this.visibleField.expectValue('true');
  }

  async expectVisibleAfterBuilder() {
    await this.visibleField.expectInputValue("#{(data.value1 eq '10' and data.value2 gt '5') or (data.value3 lt '6')}");
  }

  async openConditionBuilder() {
    await this.visibleField.openBrowser();
  }
}

export class DisableInput extends VisibleInput {
  private disabledField: Input;

  constructor(behaviourSection: Collapsible) {
    super(behaviourSection);
    this.disabledField = behaviourSection.input({ label: 'Disable' });
  }

  async fillDisable() {
    await this.fillVisible();
    await this.disabledField.fill('false');
  }

  async excpectDisabled() {
    await this.expectVisible();
    await this.disabledField.expectValue('false');
  }
}

export class RequiredInput extends DisableInput {
  private requiredField: Input;
  private requiredMessageField: Input;
  private updateFormOnChange: Checkbox;
  private listener: Input;

  constructor(behaviourSection: Collapsible) {
    super(behaviourSection);
    this.requiredField = behaviourSection.input({ label: 'Required' });
    this.requiredMessageField = behaviourSection.input({ label: 'Required Message' });
    this.updateFormOnChange = behaviourSection.checkbox({ label: 'Update Form on Change' });
    this.listener = behaviourSection.input({ label: 'Listener' });
  }

  async fillRequired() {
    await this.fillDisable();
    await this.updateFormOnChange.check();
    await this.listener.fill('logic.method');
    await this.requiredField.fill('true');
    await this.requiredMessageField.fill('Field is required');
  }

  async expectRequired() {
    await this.excpectDisabled();
    await this.updateFormOnChange.expectValue(true);
    await this.listener.expectValue('logic.method');
    await this.requiredField.expectValue('true');
    await this.requiredMessageField.expectValue('Field is required');
  }
}
