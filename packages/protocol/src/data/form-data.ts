import type { KeysOfUnion } from '../utils/type-helper';
import type {
  Button,
  Component,
  DataTable,
  DataTableColumn,
  Dialog,
  Fieldset,
  Form,
  FormContext,
  FormEditorData,
  FormExpression,
  FormSaveDataArgs,
  Layout,
  LayoutAlignItems,
  Panel,
  Radio,
  Select,
  SelectItem
} from './form';

export type ComponentType = Component['type'] | 'DataTableColumn';

const ComponentTypes = [
  'Button',
  'Checkbox',
  'Combobox',
  'Composite',
  'DataTable',
  'DataTableColumn',
  'DatePicker',
  'Dialog',
  'Fieldset',
  'Input',
  'Layout',
  'Link',
  'Panel',
  'Radio',
  'Select',
  'Text',
  'Textarea'
] as const satisfies Array<ComponentType>;

export const isComponentType = (type: string): type is ComponentType => {
  return Object.values(ComponentTypes).includes(type as ComponentType);
};

export type ComponentConfigKeys = KeysOfUnion<Component['config']>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrimitiveValue = string | boolean | number | any[] | Record<string, string>;

export type ConfigData = Component['config'] | DataTableColumn;

export type ComponentData = {
  cid: string;
  type: ComponentType;
  config: ConfigData;
};

export type ComponentDataHelper<TType extends ComponentType, TConfig extends ConfigData> = Omit<ComponentData, 'type' | 'config'> & {
  type: TType;
  config: TConfig;
};

export type TableConfig = ComponentDataHelper<'DataTable', DataTable>;
export type ColumnConfig = ComponentDataHelper<'DataTableColumn', DataTableColumn>;
export type LayoutConfig = ComponentDataHelper<'Layout', Omit<Layout, 'components' & { components: Array<ComponentData> }>>;
export type FieldsetConfig = ComponentDataHelper<'Fieldset', Omit<Fieldset, 'components' & { components: Array<ComponentData> }>>;
export type PanelConfig = ComponentDataHelper<'Panel', Omit<Panel, 'components' & { components: Array<ComponentData> }>>;
export type DialogConfig = ComponentDataHelper<'Dialog', Omit<Dialog, 'components' & { components: Array<ComponentData> }>>;
export type RadioConfig = ComponentDataHelper<'Radio', Omit<Radio, 'components' & { components: Array<ComponentData> }>>;
export type SelectConfig = ComponentDataHelper<'Select', Omit<Select, 'components' & { components: Array<ComponentData> }>>;

export type FormData = Omit<Form, 'components' | '$schema'> & {
  components: Array<ComponentData>;
};

export const isStructure = (
  component?: Component | ComponentData
): component is LayoutConfig | FieldsetConfig | PanelConfig | DialogConfig => {
  return (
    component !== undefined &&
    (component.type === 'Layout' || component.type === 'Fieldset' || component.type === 'Panel' || component.type === 'Dialog') &&
    'components' in component.config
  );
};

export const isTable = (component?: ComponentData): component is TableConfig => {
  return component !== undefined && component.type === 'DataTable' && 'components' in component.config;
};

export const isRadioSelect = (component?: ComponentData): component is RadioConfig | SelectConfig => {
  return component !== undefined && (component.type === 'Radio' || component.type === 'Select') && 'dynamicItemsList' in component.config;
};

export const isColumn = (component?: ComponentData): component is ColumnConfig => {
  return component !== undefined && component.type === 'DataTableColumn' && 'components' in component.config;
};

export const isDialog = (component?: ComponentData): component is DialogConfig => {
  return component !== undefined && component.type === 'Dialog' && 'components' in component.config;
};

export const isButton = (component?: ComponentData): component is { cid: string; type: 'Button'; config: Button } => {
  return component !== undefined && component.type === 'Button' && 'type' in component.config && 'action' in component.config;
};

const isLayout = (component?: ComponentData): component is LayoutConfig => {
  return isStructure(component) && component.type === 'Layout';
};

export const isAlignSelfLayout = (component?: ComponentData): component is LayoutConfig => {
  return isLayout(component) && !(component.config.type === 'GRID' && component.config.gridVariant === 'GRID1');
};

export const isFreeLayout = (component?: ComponentData): component is LayoutConfig => {
  return isLayout(component) && component.config.type === 'GRID' && component.config.gridVariant === 'FREE';
};

export type FormEditor = Omit<FormEditorData, 'data'> & {
  data: FormData;
};

export type FormSaveData = Omit<FormSaveDataArgs, 'data'> & {
  data: FormData;
  directSave?: boolean;
};

export type BaseProps = { id: string; alignSelf: LayoutAlignItems; lgSpan: string; mdSpan: string };
export type SelectItemsProps = {
  label: string;
  value: string;
  staticItems: SelectItem[];
  dynamicItemsLabel: string;
  dynamicItemsList: string;
  dynamicItemsValue: string;
};
export type VisibleProps = { visible: FormExpression };
export type DisableProps = VisibleProps & { disabled: string };
export type UpdateProps = DisableProps & { updateOnChange: boolean; listener: string };
export type RequireProps = UpdateProps & { required: string; requiredMessage: string };

export interface FormActionArgs {
  actionId: 'openComponent' | 'openDataClass' | 'openProcess' | 'openUrl' | 'openPreview';
  context: FormContext;
  payload: string;
}
