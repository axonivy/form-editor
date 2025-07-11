import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, test } from 'vitest';
import useTextSelection, { type InputTextAreaRef } from './useTextSelection';

const mockRef = (value: string, selectionStart: number | null, selectionEnd: number | null) => {
  return {
    current: {
      value,
      selectionStart,
      selectionEnd
    }
  } as InputTextAreaRef;
};

describe('handleTextSelection', () => {
  test('save selection if start and end are different', () => {
    const ref = mockRef('sample text', 2, 6);

    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.selection).toEqual({ start: 2, end: 6 });
  });

  test('do nothing if ref is null', () => {
    const ref = { current: null } as InputTextAreaRef;
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.selection).toBeUndefined();
  });

  test('return selected text based on saved selection', () => {
    const ref = mockRef('sample text', 2, 6);
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.getSelectedText()).toBe('mple');
  });
});

describe('getSelectedText', () => {
  test('return empty string if no selection is saved', () => {
    const ref = mockRef('sample text', null, null);
    const { result } = renderHook(() => useTextSelection(ref));

    expect(result.current.getSelectedText()).toBe('');
  });

  test('return empty string if ref is null', () => {
    const ref = { current: null } as InputTextAreaRef;
    const { result } = renderHook(() => useTextSelection(ref));

    expect(result.current.getSelectedText()).toBe('');
  });
});

describe('showQuickFix', () => {
  test('return false if no selection is saved', () => {
    const ref = mockRef('sample text', null, null);
    const { result } = renderHook(() => useTextSelection(ref));

    expect(result.current.showQuickFix()).toBe(false);
  });

  test('return false if selected text contains only whitespace', () => {
    const ref = mockRef('     ', 0, 5);
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.showQuickFix()).toBe(false);
  });

  test('return false if selection contains "#{ }" brackets', () => {
    const ref = mockRef('some #{text} here', 5, 12);
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.getSelectedText()).toBe('#{text}');
    expect(result.current.showQuickFix()).toBe(false);
  });

  test('return false if selection is surrounded by "#{ }" brackets', () => {
    const ref = mockRef('some #{text} here', 7, 9);
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.getSelectedText()).toBe('te');
    expect(result.current.showQuickFix()).toBe(false);
  });

  test('return true if selection meets all criteria', () => {
    const ref = mockRef('some random text without brackets', 5, 11);
    const { result } = renderHook(() => useTextSelection(ref));
    act(() => result.current.handleTextSelection());

    expect(result.current.showQuickFix()).toBe(true);
  });
});
