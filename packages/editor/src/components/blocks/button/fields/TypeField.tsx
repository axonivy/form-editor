import { isButton, type ButtonType } from '@axonivy/form-editor-protocol';
import { useTranslation } from 'react-i18next';
import { useValidation } from '../../../../context/useValidation';
import { isEditableTable, useData } from '../../../../data/data';
import { SelectField } from '../../../../editor/sidebar/fields/SelectField';
import type { FieldOption, GenericFieldProps } from '../../../../types/config';

export const renderTypeField = (props: GenericFieldProps) => {
  return <TypeField {...props} />;
};

const TypeField = ({ label, value, onChange, validationPath }: GenericFieldProps) => {
  const { t } = useTranslation();
  const { setElement, element, data } = useData();
  const message = useValidation(validationPath);
  if (!isEditableTable(data.components, element)) {
    return null;
  }

  const typeOptions: FieldOption<ButtonType>[] = [
    { label: t('components.button.fieldType.edit'), value: 'EDIT' },
    { label: t('components.button.fieldType.delete'), value: 'DELETE' },
    { label: t('components.button.fieldType.generic'), value: 'BUTTON' }
  ];

  const updateValueAndAction = (change: string) => {
    onChange(change);
    setElement(element => {
      if (isButton(element)) {
        if (change === 'EDIT') {
          element.config.action = 'editRow'; //just placeholder, will be set from backend
          element.config.variant = 'PRIMARY';
          element.config.name = '';
          element.config.icon = 'pi pi-pencil';
          element.config.confirmDialog = false;
          element.config.confirmMessage = '';
          element.config.confirmHeader = '';
          element.config.confirmCancelValue = '';
          element.config.confirmOkValue = '';
          element.config.confirmSeverity = 'WARN';
        } else if (change === 'DELETE') {
          element.config.action = 'deleteRow'; //just placeholder, will be set from backend
          element.config.variant = 'DANGER';
          element.config.name = '';
          element.config.icon = 'pi pi-trash';
          element.config.confirmDialog = true;
          element.config.confirmMessage = t('components.button.confirm.confirmDialogMessage');
          element.config.confirmHeader = t('components.button.confirm.confirmDialogHeader');
          element.config.confirmCancelValue = t('components.button.confirm.no');
          element.config.confirmOkValue = t('components.button.confirm.yes');
          element.config.confirmSeverity = 'WARN';
        }
      }
      return element;
    });
  };

  return <SelectField label={label} options={typeOptions} value={value as string} onChange={updateValueAndAction} message={message} />;
};
