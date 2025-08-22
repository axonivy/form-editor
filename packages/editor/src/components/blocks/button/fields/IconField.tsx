import { BasicField, Combobox, Flex, type ComboboxOption } from '@axonivy/ui-components';
import type { GenericFieldProps } from '../../../../types/config';

export const renderIconField = (props: GenericFieldProps) => {
  return <IconField {...props} />;
};

export const IconField = ({ value, onChange, label }: GenericFieldProps) => {
  const icons = extractStreamlineIcons();
  const ExtendedComboboxItem = ({ value }: ComboboxOption) => (
    <Flex direction='row' alignItems='center' gap={2}>
      <i className={value} />
      <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{formatIconString(value)}</div>
    </Flex>
  );

  return (
    <BasicField label={label}>
      <Combobox
        value={value as string}
        onChange={onChange}
        options={icons.map(icon => {
          return { value: icon };
        })}
        itemRender={option => <ExtendedComboboxItem {...option} />}
      />
    </BasicField>
  );
};

const extractStreamlineIcons = (): string[] => {
  const iconDetails: string[] = [];

  const linkTag = Array.from(document.getElementsByTagName('link')).find(
    link => link.rel === 'stylesheet' && link.href.includes('/StreamlineIcons.css')
  );
  if (!linkTag) {
    console.warn(`Stylesheet not found`);
    return [];
  }

  for (let i = 0; i < document.styleSheets.length; i++) {
    const stylesheet = document.styleSheets[i];
    if (stylesheet?.href && stylesheet.href === linkTag.href) {
      try {
        const rules = stylesheet.cssRules || stylesheet.rules;
        if (rules) {
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText && rule.style.content) {
              const selector = rule.selectorText;
              if (selector.startsWith(`.si-`)) {
                const cleanSelector = selector.split('::')[0];
                if (cleanSelector) {
                  iconDetails.push('si ' + cleanSelector.slice(1));
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn(`Error accessing stylesheet "/StreamlineIcons.css":`, e);
      }
    }
  }

  return iconDetails.sort();
};

const formatIconString = (icon: string) => {
  let formatted = icon.replace(/^(si[- ]?)+/, '');
  formatted = formatted.replace(/-/g, ' ');

  return formatted;
};
