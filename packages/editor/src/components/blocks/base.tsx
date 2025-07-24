import type {
  BaseProps,
  DisableProps,
  LayoutAlignItems,
  RequireProps,
  SelectItemsProps,
  UpdateProps,
  VisibleProps
} from '@axonivy/form-editor-protocol';
import { BasicField, Input } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useValidation } from '../../context/useValidation';
import type { FieldOption, Fields, GenericFieldProps, ItemCategory, ItemSubcategory, Subsection } from '../../types/config';
import { hideButtonField } from './button/Button';

export const useBase = () => {
  const { t } = useTranslation();

  const categoryTranslations: Record<ItemCategory | ItemSubcategory | Subsection | string, string> = useMemo(
    () => ({
      Elements: t('category.elements'),
      Structures: t('category.structures'),
      Actions: t('category.actions'),
      Hidden: t('category.hidden'),
      General: t('category.general'),
      Input: t('category.input'),
      Selection: t('category.selection'),
      Text: t('category.text'),
      Styling: t('category.styling'),
      Behaviour: t('category.behaviour'),
      Options: t('category.options'),
      'Static Options': t('category.staticOptions'),
      'Dynamic Options': t('category.dynamicOptions'),
      Columns: t('category.columns'),
      Parameters: t('category.parameters'),
      Paginator: t('category.paginator'),
      Content: t('category.content'),
      Formatting: t('category.formatting'),
      Layout: t('category.layout'),
      Properties: t('category.properties'),
      Confirm: t('category.confirm')
    }),
    [t]
  );

  const baseComponentFields: Fields<BaseProps> = useMemo(() => {
    const alignItemsOptions: FieldOption<LayoutAlignItems>[] = [
      { label: t('align.top'), value: 'START', icon: { icon: IvyIcons.AlignRight, rotate: 270 } },
      { label: t('align.center'), value: 'CENTER', icon: { icon: IvyIcons.AlignHorizontal, rotate: 180 } },
      { label: t('align.bottom'), value: 'END', icon: { icon: IvyIcons.AlignLeft, rotate: 270 } }
    ] as const;

    const spanOptions: FieldOption<string>[] = [
      { label: '1', value: '2' },
      { label: '2', value: '4' },
      { label: '3', value: '6' },
      { label: '4', value: '8' },
      { label: '5', value: '10' },
      { label: '6', value: '12' }
    ] as const;

    return {
      id: { subsection: 'General', type: 'generic', label: t('label.id'), render: props => <IdInput {...props} /> },
      alignSelf: {
        section: 'Layout',
        subsection: 'General',
        type: 'toggleGroup',
        label: t('label.verticalAlign'),
        options: alignItemsOptions
      },
      lgSpan: {
        section: 'Layout',
        subsection: 'General',
        type: 'select',
        label: t('label.largeSpan'),
        options: spanOptions
      },
      mdSpan: {
        section: 'Layout',
        subsection: 'General',
        type: 'select',
        label: t('label.mediumSpan'),
        options: spanOptions
      }
    };
  }, [t]);

  const visibleComponentField: Fields<VisibleProps> = useMemo(() => {
    return {
      visible: {
        subsection: 'Behaviour',
        label: t('label.visible'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }],
        hide: data => hideButtonField(data)
      }
    };
  }, [t]);

  const disabledComponentFields: Fields<DisableProps> = useMemo(() => {
    return {
      ...visibleComponentField,
      disabled: {
        subsection: 'Behaviour',
        label: t('label.disable'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }],
        hide: data => hideButtonField(data)
      }
    };
  }, [t, visibleComponentField]);

  const updateOnChangeComponentFields: Fields<UpdateProps> = useMemo(() => {
    return {
      ...disabledComponentFields,
      updateOnChange: {
        subsection: 'Behaviour',
        label: t('label.updateFormChange'),
        type: 'checkbox'
      }
    };
  }, [disabledComponentFields, t]);

  const behaviourComponentFields: Fields<RequireProps> = useMemo(() => {
    return {
      ...updateOnChangeComponentFields,
      required: {
        subsection: 'Behaviour',
        label: t('label.required'),
        type: 'textBrowser',
        browsers: [{ type: 'CONDITION' }]
      },
      requiredMessage: {
        subsection: 'Behaviour',
        label: t('label.requiredMessage'),
        type: 'textBrowser',
        browsers: [{ type: 'CMS', options: { overrideSelection: true } }],
        hide: data => data.required.length === 0
      }
    };
  }, [t, updateOnChangeComponentFields]);

  const selectItemsComponentFields: Fields<SelectItemsProps> = useMemo(() => {
    return {
      label: {
        subsection: 'General',
        label: t('property.label'),
        type: 'textBrowser',
        browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
      },
      value: { subsection: 'General', label: t('property.value'), type: 'textBrowser', browsers: [{ type: 'ATTRIBUTE' }] },
      staticItems: { subsection: 'Static Options', label: t('label.options'), type: 'selectTable' },
      dynamicItemsList: {
        subsection: 'Dynamic Options',
        label: t('label.listOfObjects'),
        type: 'textBrowser',
        browsers: [{ type: 'ATTRIBUTE', options: { attribute: { typeHint: 'List' } } }],
        options: { placeholder: t('placeholder.dynamicList') }
      },
      dynamicItemsLabel: {
        subsection: 'Dynamic Options',
        label: t('label.objectLabel'),
        type: 'textBrowser',
        browsers: [
          { type: 'ATTRIBUTE', options: { attribute: { onlyAttributes: { root: 'item', type: 'DYNAMICLIST' } }, overrideSelection: true } }
        ],
        options: {
          placeholder: t('placeholder.attributeOrBlank')
        },
        hide: data => data.dynamicItemsList.length == 0
      },
      dynamicItemsValue: {
        subsection: 'Dynamic Options',
        label: t('label.objectValue'),
        type: 'textBrowser',
        browsers: [
          { type: 'ATTRIBUTE', options: { attribute: { onlyAttributes: { root: 'item', type: 'DYNAMICLIST' } }, overrideSelection: true } }
        ],
        options: {
          placeholder: t('placeholder.attributeOrBlank')
        },
        hide: data => data.dynamicItemsList.length == 0
      }
    };
  }, [t]);

  const IdInput = ({ label, onChange, value, validationPath }: GenericFieldProps) => {
    const { selectedElement } = useAppContext();
    const message = useValidation(validationPath);
    return (
      <BasicField label={label} message={message}>
        <Input value={value as string} onChange={e => onChange(e.target.value)} placeholder={selectedElement} />
      </BasicField>
    );
  };

  return {
    categoryTranslations,
    baseComponentFields,
    visibleComponentField,
    disabledComponentFields,
    updateOnChangeComponentFields,
    behaviourComponentFields,
    selectItemsComponentFields
  };
};
