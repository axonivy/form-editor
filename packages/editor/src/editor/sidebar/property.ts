import { isAlignSelfLayout, isFreeLayout, type ComponentData } from '@axonivy/form-editor-protocol';
import { sections, type DefaultComponentProps, type Field, type Fields, type HiddenField, type Section } from '../../types/config';
import { IvyIcons } from '@axonivy/ui-icons';
import { groupBy } from '@axonivy/ui-components';

export type VisibleFields = ReturnType<typeof visibleFields>;

export const visibleFields = (fields: Fields, elementConfig: DefaultComponentProps) => {
  return Object.entries(fields)
    .filter(([, field]) => isNotHiddenField(field))
    .filter(([, field]) => field.hide === undefined || !field.hide(elementConfig))
    .map(([key, field]) => ({ key, field, value: elementConfig[key] }));
};

const isNotHiddenField = (field: Field): field is Exclude<Field, HiddenField> => {
  return field.type !== 'hidden';
};

export const visibleSections = (fields: VisibleFields, parent?: ComponentData) => {
  const filteredFields = fields.filter(
    field =>
      !((field.key === 'lgSpan' || field.key === 'mdSpan') && !isFreeLayout(parent)) &&
      !(field.key === 'alignSelf' && !isAlignSelfLayout(parent))
  );
  const grouped = groupBy(filteredFields, field => field.field.section ?? 'Properties');

  const sectionMap = new Map<string, { section: Section; fields: VisibleFields }>();

  for (const [sectionName, fields] of Object.entries(grouped)) {
    const section = sections.find(s => s.name === sectionName) ?? {
      name: sectionName,
      icon: IvyIcons.List
    };

    sectionMap.set(sectionName, {
      section,
      fields
    });
  }

  return sectionMap;
};

export const groupFieldsBySubsection = (fields: VisibleFields) => {
  const subsections = new Map<string, { title: string; fields: VisibleFields }>();
  fields.forEach(visibleField => {
    const title = visibleField.field.subsection;
    let subsection = subsections.get(title);
    if (subsection === undefined) {
      subsection = { title, fields: [] };
      subsections.set(title, subsection);
    }
    subsection.fields.push(visibleField);
  });
  return Array.from(subsections.values());
};
