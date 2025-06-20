import {
  BUTTON_DEFAULTS,
  type Button,
  type Checkbox,
  type Combobox,
  type ComponentType,
  type Composite,
  type DataTable,
  type DataTableColumn,
  type DatePicker,
  type Dialog,
  type Fieldset,
  type Input,
  type Layout,
  type Link,
  type Panel,
  type Radio,
  type Select,
  type Text,
  type Textarea
} from '@axonivy/form-editor-protocol';

export const addDefaults = <TType extends ComponentType>(
  type: TType,
  config: Partial<ComponentConfigs[TType]>
): ComponentConfigs[TType] => ({
  ...CONFIG_DEFAULTS[type],
  ...config
});

addDefaults('Button', {});
