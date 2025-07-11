/* eslint-disable testing-library/no-node-access */
import { InputBadge } from '@axonivy/ui-components';
import { render, screen } from '@testing-library/react';
import { describe } from 'vitest';
import { badgeProps } from './badge-properties';

describe('createBadges', () => {
  const inputValues =
    "#{data.testData} #{logic.testLogic} #{ivy.cms.co('/Categories/agile/cssIcon')} #{el.expression} #{currentRow.age} #{currentRow} #{item.country} #{item}";

  test('test all badgeProperties', async () => {
    render(<InputBadge badgeProps={badgeProps} value={inputValues} className='badge-output' />);
    const testDataBadge = screen.getByText('testData');
    const logicBadge = screen.getByText('testLogic');
    const cmsBadge = screen.getByText('cssIcon');
    const expBadge = screen.getByText('el.expression');

    expect(testDataBadge).toBeVisible();
    expect(logicBadge).toBeVisible();
    expect(cmsBadge).toBeVisible();
    expect(expBadge).toBeVisible();

    expect(testDataBadge).toHaveTextContent('testData');
    expect(logicBadge).toHaveTextContent('testLogic');
    expect(cmsBadge).toHaveTextContent('cssIcon');
    expect(expBadge).toHaveTextContent('el.expression');

    expect(testDataBadge.querySelector('i.ivy-attribute')).toBeVisible();
    expect(logicBadge.querySelector('i.ivy-process')).toBeVisible();
    expect(cmsBadge.querySelector('i.ivy-cms')).toBeVisible();
    expect(expBadge.querySelector('i.ivy-start-program')).toBeVisible();
  });

  test('test currentRow badgeProperties', async () => {
    render(<InputBadge badgeProps={badgeProps} value={inputValues} className='badge-output' />);
    const ivyFormBadgeAge = screen.getByText('age');
    const ivyFormBadgeCurrentRow = screen.getByText('currentRow');

    expect(ivyFormBadgeAge).toBeVisible();
    expect(ivyFormBadgeCurrentRow).toBeVisible();

    expect(ivyFormBadgeAge).toHaveTextContent('age');
    expect(ivyFormBadgeCurrentRow).toHaveTextContent('currentRow');

    expect(ivyFormBadgeAge.querySelector('i.ivy-attribute')).toBeVisible();
    expect(ivyFormBadgeCurrentRow.querySelector('i.ivy-start-program')).toBeVisible();
  });

  test('test item badgeProperties', async () => {
    render(<InputBadge badgeProps={badgeProps} value={inputValues} className='badge-output' />);
    const ivyFormBadgeCountry = screen.getByText('country');
    const ivyFormBadgeItem = screen.getByText('item');

    expect(ivyFormBadgeCountry).toBeVisible();
    expect(ivyFormBadgeItem).toBeVisible();

    expect(ivyFormBadgeCountry).toHaveTextContent('country');
    expect(ivyFormBadgeItem).toHaveTextContent('item');

    expect(ivyFormBadgeCountry.querySelector('i.ivy-attribute')).toBeVisible();
    expect(ivyFormBadgeItem.querySelector('i.ivy-start-program')).toBeVisible();
  });
});
