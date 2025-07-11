/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen } from '@testing-library/react';
import { describe, expect } from 'vitest';
import { UiBlockHeader, UiBlockHeaderDisablePart, UiBlockHeaderUpdateOnChangePart, UiBlockHeaderVisiblePart } from './UiBlockHeader';

describe('UiBlockHeader', () => {
  test('render label and required symbol', () => {
    render(<UiBlockHeader visible='true' label='Test Label' required='true' />);

    const label = screen.getByText('Test Label');
    const required = screen.getByText('*');
    expect(label).toBeInTheDocument();
    expect(required).toBeInTheDocument();
  });

  test('not render required symbol', () => {
    render(<UiBlockHeader visible='true' label='Test Label' required='false' />);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).not.toHaveTextContent('*');
  });

  test('render additional info', () => {
    render(<UiBlockHeader visible='true' additionalInfo='Additional Info' />);

    const additionalInfo = screen.getByText('Additional Info');
    expect(additionalInfo).toBeInTheDocument();
  });
});

describe('UiBlockHeaderVisiblePart', () => {
  test('render visible icon if false', () => {
    const { container } = render(<UiBlockHeaderVisiblePart visible='false' />);

    const visibleIcon = container.querySelector('.header-block__visible');
    expect(visibleIcon).toBeInTheDocument();
  });

  test('not render visible if true', () => {
    const { container } = render(<UiBlockHeaderVisiblePart visible='true' />);

    const visibleIcon = container.querySelector('.header-block__visible');
    expect(visibleIcon).not.toBeInTheDocument();
  });
});

describe('UiBlockHeaderDisablePart', () => {
  test('render disabled icon when true', () => {
    const { container } = render(<UiBlockHeaderDisablePart disabled='true' />);

    const visibleIcon = container.querySelector('.header-block__disabled');
    expect(visibleIcon).toBeInTheDocument();
  });

  test('not render disabled icon when false', () => {
    const { container } = render(<UiBlockHeaderDisablePart disabled='false' />);

    const visibleIcon = container.querySelector('.header-block__disabled');
    expect(visibleIcon).not.toBeInTheDocument();
  });

  test('not render disabled icon when empty or undefined', () => {
    const { container } = render(<UiBlockHeaderDisablePart disabled='' />);

    const visibleIcon = container.querySelector('.header-block__disabled');
    expect(visibleIcon).not.toBeInTheDocument();
  });
});

describe('UiBlockHeaderUpdateOnChangePart', () => {
  test('render update when true', () => {
    const { container } = render(<UiBlockHeaderUpdateOnChangePart updateOnChange={true} />);

    const visibleIcon = container.querySelector('.header-block__update');
    expect(visibleIcon).toBeInTheDocument();
  });

  test('not render update when false', () => {
    const { container } = render(<UiBlockHeaderUpdateOnChangePart updateOnChange={false} />);

    const visibleIcon = container.querySelector('.header-block__update');
    expect(visibleIcon).not.toBeInTheDocument();
  });
});
