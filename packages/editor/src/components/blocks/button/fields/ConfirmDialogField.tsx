import { isButton } from '@axonivy/form-editor-protocol';
import { Checkbox, Field, Label } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useData } from '../../../../data/data';
import type { GenericFieldProps } from '../../../../types/config';

export const renderConfirmDialogField = (props: GenericFieldProps) => {
  return <ConfirmDialogField {...props} />;
};

export const ConfirmDialogField = ({ label, value, onChange }: GenericFieldProps) => {
  const { setElement } = useData();
  const { t } = useTranslation();

  const updateButtonFields = (change: boolean) => {
    onChange(change);
    setElement(element => {
      if (isButton(element)) {
        if (change) {
          element.config.confirmMessage = t('components.button.confirm.confirmDialogMessage');
          element.config.confirmHeader = t('components.button.confirm.confirmDialogHeader');
          element.config.confirmCancelValue = t('components.button.confirm.no');
          element.config.confirmOkValue = t('components.button.confirm.yes');
        } else {
          element.config.confirmMessage = '';
          element.config.confirmHeader = '';
          element.config.confirmCancelValue = '';
          element.config.confirmOkValue = '';
        }
      }
      return element;
    });
  };

  return (
    <Field direction='row' alignItems='center' gap={1}>
      <Checkbox
        checked={value as boolean}
        onCheckedChange={e => {
          updateButtonFields(Boolean(e));
        }}
      />
      <Label>{label}</Label>
    </Field>
  );
};
