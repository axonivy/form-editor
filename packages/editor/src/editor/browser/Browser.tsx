import { BrowsersView, useConditionBuilder, type BrowserResult } from '@axonivy/ui-components';
import { InputFieldWithBrowser } from '../sidebar/fields/InputFieldWithBrowser';
import { useCmsBrowser } from './cms/useCmsBrowser';
import type { Selection } from './cms/useTextSelection';
import { generateConditionString, logicOperators, operators } from './condition-builder/condition-builder-data';
import { useAttributeBrowser } from './data-class/useAttributeBrowser';
import { useLogicBrowser } from './logic/useLogicBrowser';

type OnlyAttributeSelection = 'DYNAMICLIST' | 'COLUMN';

export type BrowserType = 'ATTRIBUTE' | 'LOGIC' | 'CMS' | 'CONDITION';

export type BrowserOptions = {
  withoutEl?: boolean;
  overrideSelection?: boolean;
  attribute?: AttributeBrowserOptions;
};

type AttributeBrowserOptions = {
  typeHint?: string;
  onlyAttributes?: OnlyAttributeSelection;
  onlyObjects?: boolean;
};

export type FormBrowser = { type: BrowserType; options?: BrowserOptions };

type BrowserProps = {
  value: string;
  onChange: (value: string) => void;
  activeBrowsers: Array<FormBrowser>;
  close: () => void;
  selection?: Selection;
};

export const Browser = ({ value, onChange, activeBrowsers, close, selection }: BrowserProps) => {
  const attrBrowser = useAttributeBrowser(activeBrowsers.find(browser => browser.type === 'ATTRIBUTE')?.options);
  const logicBrowser = useLogicBrowser();
  const cmsBrowser = useCmsBrowser();
  const conditionBuilder = useConditionBuilder({
    generateConditionString,
    operators,
    logicOperators,
    argumentInput: (value, onChange) => (
      <InputFieldWithBrowser value={value} onChange={onChange} browsers={[{ type: 'ATTRIBUTE', options: { withoutEl: true } }]} />
    )
  });
  const browsers = activeBrowsers
    .map(browser => {
      switch (browser.type) {
        case 'LOGIC':
          return logicBrowser;
        case 'ATTRIBUTE':
          return attrBrowser;
        case 'CMS':
          return cmsBrowser;
        case 'CONDITION':
          return conditionBuilder;
        default:
          return null;
      }
    })
    .filter(browser => browser !== null);

  return (
    <BrowsersView
      browsers={browsers}
      apply={(browserName, result) => {
        const newValue = getApplyLogicValue(value, result, browserName, activeBrowsers, selection);
        if (newValue !== null) {
          onChange(newValue);
        }
        close();
      }}
    />
  );
};

export const getApplyLogicValue = (
  value: string,
  result: BrowserResult<unknown> | undefined,
  browserName: string,
  activeBrowsers: Array<FormBrowser>,
  selection?: Selection
): string | null => {
  if (!result) return null;
  const options = activeBrowsers.find(browser => browser.type.toLocaleLowerCase() === browserName.toLocaleLowerCase())?.options;
  const newResult = options?.withoutEl ? result.value : `#{${result.value}}`;

  if (options?.overrideSelection) {
    const newValue = selection ? value.substring(0, selection.start) + newResult + value.substring(selection.end) : value + newResult;
    return newValue;
  }
  return newResult;
};
