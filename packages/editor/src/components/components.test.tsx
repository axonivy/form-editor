import { renderHook } from '@testing-library/react';
import { useComponentsInit } from './components';
describe('Component hooks', () => {
  const { result: componentsResult } = renderHook(() => useComponentsInit());
  const { componentByName, componentsByCategory, allComponentsByCategory, config } = componentsResult.current;

  test('componentByName', () => {
    expect(componentByName('unknown')).toEqual(undefined);
    expect(componentByName('Button')).toEqual(config.components.Button);
    expect(componentByName('Input')).toEqual(config.components.Input);
  });

  test('componentByCategory', () => {
    const result = componentsByCategory('Elements');
    expect(result.General).toEqual(undefined);
    expect(result.Input).toHaveLength(5);
    expect(result.Selection).toHaveLength(3);
    expect(result.Text).toHaveLength(1);
    const resultHidden = componentsByCategory('Hidden');
    expect(resultHidden.Input).toHaveLength(1);
  });

  test('allComponentsByCategory', () => {
    const result = allComponentsByCategory();
    expect(result.Actions).toHaveLength(2);
    expect(result.Elements).toHaveLength(9);
    expect(result.Structures).toHaveLength(3);
  });
});
