import type { ComponentData, ComponentType, FormData, PrimitiveValue } from '@axonivy/form-editor-protocol';
import type { CollapsibleControlProps, IvyIconProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type React from 'react';
import type { ReactNode } from 'react';
import type { FormBrowser } from '../editor/browser/Browser';
import type { UpdateConsumer } from './types';

export type UiComponentProps<Props extends DefaultComponentProps = DefaultComponentProps> = Props & { id: string };

export type DefaultComponentProps = Record<string, PrimitiveValue | Array<ComponentData>>;

type UiComponent<Props extends DefaultComponentProps = DefaultComponentProps> = (props: UiComponentProps<Props>) => ReactNode;

export type FieldOptionValues<TOptions extends Readonly<FieldOption[]>> = TOptions[number]['value'];

export type FieldOption<TValue = PrimitiveValue> = {
  label: string;
  value: TValue;
  icon?: IvyIconProps;
};

export type Subsection =
  | 'General'
  | 'Styling'
  | 'Behaviour'
  | 'Options'
  | 'Static Options'
  | 'Dynamic Options'
  | 'Columns'
  | 'Formatting'
  | 'Parameters'
  | 'Paginator'
  | 'Content'
  | 'Layout'
  | 'Icon';

export type Section = {
  name: string;
  icon: IvyIcons;
};

export const sections = [
  { name: 'Properties', icon: IvyIcons.List },
  { name: 'Layout', icon: IvyIcons.DialogLayout },
  { name: 'Confirm', icon: IvyIcons.Comment }
] as const satisfies Array<Section>;

type SectionId = (typeof sections)[number]['name'];

export type BaseField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  subsection: Subsection;
  label?: string;
  hide?: (component: ComponentProps) => boolean;
  section?: SectionId;
};

export type TextFieldOptions = {
  placeholder?: string;
  disabled?: boolean;
};

export type TextField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'text' | 'number' | 'textarea' | 'checkbox';
  options?: TextFieldOptions;
};

export type TextBrowserField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'textBrowser';
  browsers: Array<FormBrowser>;
  options?: TextFieldOptions;
};

export type TableField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'selectTable';
};

export type SelectField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'select' | 'radio' | 'toggleGroup';
  options: readonly FieldOption[];
};

export type GenericFieldProps = { label: string; value: PrimitiveValue; onChange: (value: PrimitiveValue) => void; validationPath: string };

export type GenericField<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = BaseField<ComponentProps> & {
  type: 'generic';
  render: (props: GenericFieldProps) => React.ReactNode;
};

export type HiddenField = BaseField & {
  type: 'hidden';
};

export type Field<ComponentProps extends DefaultComponentProps = DefaultComponentProps> =
  | TextField<ComponentProps>
  | TextBrowserField<ComponentProps>
  | SelectField<ComponentProps>
  | TableField<ComponentProps>
  | GenericField<ComponentProps>
  | HiddenField;

export type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  [PropName in keyof Omit<Required<ComponentProps>, 'children'>]: Field<ComponentProps>;
};

export type ItemCategory = 'Elements' | 'Structures' | 'Actions' | 'Hidden';
export type ItemSubcategory = 'General' | 'Input' | 'Selection' | 'Text';

export type ComponentConfig<ComponentProps extends DefaultComponentProps = DefaultComponentProps> = {
  name: ComponentType;
  displayName: string;
  category: ItemCategory;
  subcategory: ItemSubcategory;
  icon: ReactNode;
  description: string;
  render: UiComponent<ComponentProps>;
  outlineInfo: (data: ComponentProps) => string | undefined;
  fields: Fields<ComponentProps>;
  quickActions: QuickAction[];
  subSectionControls?: (props: CollapsibleControlProps, subSection: Subsection) => ReactNode;
  onDelete?: (component: ComponentProps, setData: UpdateConsumer<FormData>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Config<Props extends { [key: string]: any } = { [key: string]: any }> = {
  components: {
    [ComponentName in keyof Props]: Omit<ComponentConfig<Props[ComponentName]>, 'type'>;
  };
};

export type QuickAction =
  | 'DELETE'
  | 'DUPLICATE'
  | 'OPENCOMPONENT'
  | 'EXTRACTINTOCOMPONENT'
  | 'CREATE'
  | 'CREATEFROMDATA'
  | 'CREATECOLUMN'
  | 'CREATEACTIONCOLUMN'
  | 'CREATEACTIONCOLUMNBUTTON';

export const DEFAULT_QUICK_ACTIONS: Array<QuickAction> = ['DELETE', 'DUPLICATE', 'CREATE', 'CREATEFROMDATA'] as const;
