import { type DatePicker, type Prettify } from '@axonivy/form-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './DatePicker.css';
import IconSvg from './DatePicker.svg?react';

type DatePickerProps = Prettify<DatePicker>;

export const useDatePickerComponent = () => {
  const { baseComponentFields, behaviourComponentFields } = useBase();
  const { t } = useTranslation();

  const DatePickerComponent = useMemo(() => {
    const DatePickerComponent: ComponentConfig<DatePickerProps> = {
      name: 'DatePicker',
      displayName: t('components.datePicker.name'),
      category: 'Elements',
      subcategory: 'Input',
      icon: <IconSvg />,
      description: t('components.datePicker.description'),
      render: props => <UiBlock {...props} />,
      outlineInfo: component => component.label,
      fields: {
        ...baseComponentFields,
        label: {
          subsection: 'General',
          label: t('property.label'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        value: {
          subsection: 'General',
          label: t('property.value'),
          type: 'textBrowser',
          browsers: [{ type: 'ATTRIBUTE', options: { attribute: { typeHint: 'Date' } } }]
        },
        datePattern: {
          subsection: 'General',
          label: t('components.datePicker.property.datePattern'),
          type: 'text',
          options: { placeholder: t('components.datePicker.datePlaceholder') }
        },
        showTime: { subsection: 'General', label: 'Show Time', type: 'checkbox' },
        timePattern: {
          subsection: 'General',
          label: t('components.datePicker.property.timePattern'),
          type: 'text',
          options: { placeholder: t('components.datePicker.timePlaceholder') },
          hide: data => !data.showTime
        },
        ...behaviourComponentFields
      }
    };

    return DatePickerComponent;
  }, [baseComponentFields, behaviourComponentFields, t]);

  return {
    DatePickerComponent
  };
};

const UiBlock = ({
  label,
  value,
  datePattern,
  timePattern,
  showTime,
  visible,
  required,
  disabled,
  updateOnChange
}: UiComponentProps<DatePickerProps>) => (
  <div className='block-datepicker'>
    <UiBlockHeader visible={visible} label={label} required={required} disabled={disabled} updateOnChange={updateOnChange} />
    <span className='block-datepicker__datepicker'>
      {value === '' ? showTime ? datePattern + ' ' + timePattern : datePattern : <UiBadge value={value} />}
      <svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g clipPath='url(#clip0_35_14)'>
          <path
            d='M2.83331 4.95835C2.83331 4.58263 2.98257 4.2223 3.24825 3.95662C3.51392 3.69094 3.87426 3.54169 4.24998 3.54169H12.75C13.1257 3.54169 13.486 3.69094 13.7517 3.95662C14.0174 4.2223 14.1666 4.58263 14.1666 4.95835V13.4584C14.1666 13.8341 14.0174 14.1944 13.7517 14.4601C13.486 14.7258 13.1257 14.875 12.75 14.875H4.24998C3.87426 14.875 3.51392 14.7258 3.24825 14.4601C2.98257 14.1944 2.83331 13.8341 2.83331 13.4584V4.95835Z'
            stroke='#A3A3A3'
            strokeWidth='0.888776'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path d='M11.3333 2.125V4.95833' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M5.66669 2.125V4.95833' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M2.83331 7.79169H14.1666' stroke='#A3A3A3' strokeWidth='0.888776' strokeLinecap='round' strokeLinejoin='round' />
          <path
            d='M5.66669 10.625H7.08335V12.0417H5.66669V10.625Z'
            fill='#A3A3A3'
            stroke='#A3A3A3'
            strokeWidth='0.888776'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_35_14'>
            <rect width='17' height='17' fill='white' />
          </clipPath>
        </defs>
      </svg>
    </span>
  </div>
);
