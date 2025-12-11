import type { FormType } from '@axonivy/form-editor-protocol';
import {
  BasicInscriptionTabs,
  Collapsible,
  CollapsibleContent,
  CollapsibleState,
  CollapsibleTrigger,
  Flex,
  type InscriptionTabProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBase } from '../../components/blocks/base';
import { addDefaults } from '../../components/component-factory';
import { useAppContext } from '../../context/AppContext';
import { useComponents } from '../../context/ComponentsContext';
import { getTabState, validationsForPaths } from '../../context/useValidation';
import { useData } from '../../data/data';
import type { FieldOption } from '../../types/config';
import { InputFieldWithBrowser } from './fields/InputFieldWithBrowser';
import { SelectField } from './fields/SelectField';
import { groupFieldsBySubsection, visibleFields, visibleSections, type VisibleFields } from './property';
import { PropertyItem } from './PropertyItem';
import { usePropertySubSectionControl } from './PropertySubSectionControl';

export const Properties = () => {
  const { categoryTranslations: CategoryTranslations } = useBase();
  const { componentByElement } = useComponents();
  const { element, parent } = useData();
  const { validations } = useAppContext();
  const [value, setValue] = useState('Properties');
  if (element === undefined) {
    return <FormPropertySection />;
  }
  const propertyConfig = componentByElement(element);
  const elementConfig = addDefaults(element.type, element.config);
  const fields = visibleFields(propertyConfig?.fields ?? {}, { ...elementConfig });
  const sections = visibleSections(fields, parent);

  const tabs = [...sections].map<InscriptionTabProps>(([, { section, fields }]) => ({
    content: groupFieldsBySubsection(fields).map(({ title, fields }) => (
      <PropertySubSection key={title} title={CategoryTranslations[title] ?? ''} fields={fields} />
    )),
    icon: section.icon,
    id: section.name,
    name: CategoryTranslations[section.name] ?? '',
    state: getTabState(
      validationsForPaths(
        fields.map(field => `${element?.cid}.${field.key}`),
        validations
      )
    )
  }));
  return <BasicInscriptionTabs value={sections.has(value) ? value : 'Properties'} onChange={setValue} tabs={tabs} />;
};

const PropertySubSection = ({ title, fields }: { title: string; fields: VisibleFields }) => {
  const { element, setElement } = useData();
  const { validations } = useAppContext();
  const { PropertySubSectionControl } = usePropertySubSectionControl();
  if (element === undefined) {
    return null;
  }

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger
        control={props => <PropertySubSectionControl title={title} {...props} />}
        state={
          <CollapsibleState
            messages={validationsForPaths(
              fields.map(field => `${element?.cid}.${field.key}`),
              validations
            )}
          />
        }
      >
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={2}>
          {fields.map(({ key, field, value }) => (
            <PropertyItem
              key={`${element.cid}-${key}`}
              value={value ?? ''}
              onChange={change => {
                setElement(element => {
                  element.config = { ...element.config, [key]: change };
                  return element;
                });
              }}
              fieldKey={key}
              field={field}
            />
          ))}
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};

const FormPropertySection = () => {
  const { t } = useTranslation();

  const formTypeOptions: FieldOption<FormType>[] = [
    { label: t('label.component'), value: 'COMPONENT' },
    { label: t('label.form'), value: 'FORM' }
  ] as const;

  const { data, setData } = useData();
  const [value, setValue] = useState('Properties');
  const tabs: InscriptionTabProps[] = [
    {
      id: 'Properties',
      name: t('category.properties'),
      content: (
        <Collapsible defaultOpen={true}>
          <CollapsibleTrigger>{t('label.general')}</CollapsibleTrigger>
          <CollapsibleContent>
            <Flex direction='column' gap={2}>
              <InputFieldWithBrowser
                label={t('property.title')}
                value={data.config.title}
                onChange={value =>
                  setData(data => {
                    data.config.title = value;
                    return data;
                  })
                }
                browsers={[{ type: 'CMS' }]}
              />
              <SelectField
                label={t('label.formType')}
                options={formTypeOptions}
                value={data.config.type}
                onChange={value => {
                  setData(data => {
                    data.config.type = value as FormType;
                    return data;
                  });
                }}
              />
            </Flex>
          </CollapsibleContent>
        </Collapsible>
      ),
      icon: IvyIcons.List,
      state: { messages: [], size: 'normal' }
    }
  ];
  return <BasicInscriptionTabs value={value} onChange={setValue} tabs={tabs} />;
};
