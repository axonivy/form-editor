import type { Button, ButtonStyle, ButtonVariant, ConfirmDialogSeverity, Prettify } from '@axonivy/form-editor-protocol';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type FieldOption, type UiComponentProps } from '../../../types/config';
import { UiBadge, UiBlockHeader } from '../../UiBlockHeader';
import { useBase } from '../base';
import './Button.css';
import IconSvg from './Button.svg?react';
import { renderConfirmDialogField } from './fields/ConfirmDialogField';
import { renderIconField } from './fields/IconField';
import { renderTypeField } from './fields/TypeField';

type ButtonProps = Prettify<Button>;

const isButtonProps = (obj: unknown): obj is ButtonProps => {
  return typeof obj === 'object' && obj !== null && 'type' in obj && typeof (obj as ButtonProps).type === 'string';
};
export const hideButtonField = <T,>(obj: T): boolean => {
  if (isButtonProps(obj)) {
    if (obj.type === 'DELETE' || obj.type === 'EDIT' || obj.type === 'DIALOGSAVE' || obj.type === 'DIALOGCANCEL') {
      return true;
    }
  }
  return false;
};

export const useButtonComponent = () => {
  const { baseComponentFields, disabledComponentFields } = useBase();
  const { t } = useTranslation();

  const ButtonComponent: ComponentConfig<ButtonProps> = useMemo(() => {
    const variantOptions: FieldOption<ButtonVariant>[] = [
      { label: t('components.button.severity.primary'), value: 'PRIMARY' },
      { label: t('components.button.severity.secondary'), value: 'SECONDARY' },
      { label: t('components.button.severity.danger'), value: 'DANGER' },
      { label: t('components.button.severity.success'), value: 'SUCCESS' },
      { label: t('components.button.severity.info'), value: 'INFO' },
      { label: t('components.button.severity.warn'), value: 'WARNING' },
      { label: t('components.button.severity.help'), value: 'HELP' }
    ] as const;

    const styleOptions: FieldOption<ButtonStyle>[] = [
      { label: t('components.button.type.solid'), value: 'SOLID' },
      { label: t('components.button.type.flat'), value: 'FLAT' },
      { label: t('components.button.type.outline'), value: 'OUTLINED' }
    ] as const;

    const confirmDialogSeverity: FieldOption<ConfirmDialogSeverity>[] = [
      { label: t('components.button.severity.info'), value: 'INFO' },
      { label: t('components.button.severity.success'), value: 'SUCCESS' },
      { label: t('components.button.severity.warn'), value: 'WARN' },
      { label: t('components.button.severity.error'), value: 'ERROR' }
    ] as const;

    const component: ComponentConfig<ButtonProps> = {
      name: 'Button',
      displayName: t('components.button.name'),
      category: 'Actions',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.button.description'),
      render: props => <UiButtonBlock {...props} />,
      outlineInfo: component => component.name,
      fields: {
        ...baseComponentFields,
        type: {
          subsection: 'General',
          label: t('property.type'),
          type: 'generic',
          render: renderTypeField
        },
        name: {
          subsection: 'General',
          label: t('property.name'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        action: {
          subsection: 'General',
          label: t('property.actionListener'),
          type: 'textBrowser',
          browsers: [{ type: 'LOGIC' }, { type: 'ATTRIBUTE', options: { withoutEl: true, overrideSelection: true } }],
          hide: data => hideButtonField(data)
        },
        processOnlySelf: {
          subsection: 'General',
          label: t('label.bypassValidation'),
          type: 'checkbox',
          hide: data => hideButtonField(data)
        },
        icon: {
          subsection: 'General',
          label: t('property.icon'),
          type: 'generic',
          render: renderIconField
        },
        variant: {
          subsection: 'Styling',
          label: t('property.variant'),
          type: 'select',
          options: variantOptions
        },
        style: {
          subsection: 'Styling',
          label: t('components.button.property.style'),
          type: 'select',
          options: styleOptions
        },
        rounded: {
          subsection: 'Styling',
          label: t('components.button.property.rounded'),
          type: 'checkbox'
        },
        confirmDialog: {
          section: 'Confirm',
          subsection: 'General',
          label: t('components.button.property.confirmDialog'),
          type: 'generic',
          render: renderConfirmDialogField,
          hide: data => data.type !== 'DELETE'
        },
        confirmSeverity: {
          section: 'Confirm',
          subsection: 'General',
          label: t('components.button.property.severity'),
          type: 'select',
          options: confirmDialogSeverity,
          hide: data => !data.confirmDialog || data.type !== 'DELETE'
        },
        confirmHeader: {
          section: 'Confirm',
          subsection: 'General',
          label: t('property.header'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
          hide: data => !data.confirmDialog || data.type !== 'DELETE'
        },
        confirmMessage: {
          section: 'Confirm',
          subsection: 'General',
          label: t('components.button.property.message'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
          hide: data => !data.confirmDialog || data.type !== 'DELETE'
        },
        confirmOkValue: {
          section: 'Confirm',
          subsection: 'General',
          label: t('components.button.property.confirmButton'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
          hide: data => !data.confirmDialog || data.type !== 'DELETE'
        },
        confirmCancelValue: {
          section: 'Confirm',
          subsection: 'General',
          label: t('components.button.property.cancelButton'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
          hide: data => !data.confirmDialog || data.type !== 'DELETE'
        },
        ...disabledComponentFields
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return component;
  }, [baseComponentFields, disabledComponentFields, t]);

  return {
    ButtonComponent
  };
};

export const UiButtonBlock = ({ name, icon, variant, visible, style, rounded, disabled }: UiComponentProps<ButtonProps>) => (
  <>
    <UiBlockHeader visible={visible} disabled={disabled} />
    <div
      className={`block-button`}
      data-variant={variant.toLocaleLowerCase()}
      data-style={style.toLocaleLowerCase()}
      data-rounded={rounded}
      data-icon={icon.length > 0 && name.length === 0}
    >
      {icon && <i className={icon} />}
      {(name.length > 0 || icon.length === 0) && <UiBadge value={name} />}
    </div>
  </>
);
