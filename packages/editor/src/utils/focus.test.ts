import { beforeEach, describe, expect, vi } from 'vitest';
import { focusBracketContent } from './focus';

describe('focusBracketContent', () => {
  let inputElement: HTMLInputElement;
  let mockEvent: Event;

  beforeEach(() => {
    inputElement = {
      focus: vi.fn(),
      setSelectionRange: vi.fn()
    } as unknown as HTMLInputElement;

    mockEvent = {
      preventDefault: vi.fn()
    } as unknown as Event;
  });

  test('focus and select text inside parentheses in input', () => {
    const value = 'Some text (selected text) more text';
    focusBracketContent(mockEvent, value, inputElement);

    const textToSelect = 'selected text';
    const startIndex = value.indexOf(textToSelect);
    const endIndex = startIndex + textToSelect.length;

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(inputElement.focus).toHaveBeenCalled();
    expect(inputElement.setSelectionRange).toHaveBeenCalledWith(startIndex, endIndex);
  });

  test('not call focus or setSelectionRange if value does not contain parentheses', () => {
    const value = 'No parentheses here';
    focusBracketContent(mockEvent, value, inputElement);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(inputElement.focus).not.toHaveBeenCalled();
    expect(inputElement.setSelectionRange).not.toHaveBeenCalled();
  });

  test('not attempt to focus or select text if inputElement is null', () => {
    const value = 'Some text (selected text) more text';
    focusBracketContent(mockEvent, value, null);

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(inputElement.focus).not.toHaveBeenCalled();
    expect(inputElement.setSelectionRange).not.toHaveBeenCalled();
  });
});
