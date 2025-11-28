import {
  CONFIG_DEFAULTS,
  isRadioSelect,
  isTable,
  type ComponentConfigs,
  type ComponentData,
  type ComponentType
} from '@axonivy/form-editor-protocol';

export const addDefaults = <TType extends ComponentType>(type: TType, config?: Partial<ComponentConfigs[TType]>) => {
  const defaults: ComponentData['config'] = CONFIG_DEFAULTS[type];
  return { ...defaults, ...config } as ComponentConfigs[TType];
};

export type CreateData<TType extends ComponentType = ComponentType> = {
  label?: string;
  value?: string;
  config?: Partial<ComponentConfigs[TType]>;
};

export const createComponent = <TType extends ComponentType>(type: TType, createData?: CreateData<TType>) => {
  if (createData === undefined) {
    return addDefaults(type);
  }
  const { label, value, config } = createData;

  switch (type) {
    case 'Button':
      return addDefaults('Button', { name: label, action: value, ...config }) as ComponentConfigs[TType];
    case 'Checkbox':
      return addDefaults('Checkbox', { label, value, ...config }) as ComponentConfigs[TType];
    case 'Dialog':
      return addDefaults('Dialog', { header: label, linkedComponent: value, ...config }) as ComponentConfigs[TType];
    case 'Composite':
      return addDefaults('Composite', { name: label, ...config }) as ComponentConfigs[TType];
    case 'DataTableColumn':
      return addDefaults('DataTableColumn', { header: label, value, ...config }) as ComponentConfigs[TType];
    case 'Input':
      return addDefaults('Input', { label, value, ...config }) as ComponentConfigs[TType];
    case 'Textarea':
      return addDefaults('Textarea', { label, value, ...config }) as ComponentConfigs[TType];
    case 'Radio':
      return addDefaults('Radio', { label, value, ...config }) as ComponentConfigs[TType];
    case 'Select':
      return addDefaults('Select', { label, value, ...config }) as ComponentConfigs[TType];
    case 'Text':
      return addDefaults('Text', { content: value, ...config }) as ComponentConfigs[TType];
  }
  return addDefaults(type, { ...config });
};

export function applyConfigOfPreviousComponent(previous: ComponentData, current: ComponentData): void {
  const prevConfig = previous.config;
  const currConfig = current.config;

  (Object.keys(currConfig) as (keyof typeof currConfig)[]).forEach(key => {
    if (key in prevConfig) {
      currConfig[key] = prevConfig[key];
    }
  });

  if (isTable(current) && isRadioSelect(previous)) {
    current.config.value = previous.config.dynamicItemsList;
  }
  if (isTable(previous) && isRadioSelect(current)) {
    current.config.dynamicItemsList = previous.config.value;
  }
}

export const componentForDataType = (
  dataType: string
): { type: ComponentType | undefined; config?: Partial<ComponentConfigs[ComponentType]> } => {
  if (dataType.startsWith('List<') && dataType.endsWith('>')) {
    return { type: 'DataTable' };
  }

  switch (dataType) {
    case 'String':
      return { type: 'Input' };
    case 'Number':
    case 'Byte':
    case 'Short':
    case 'Integer':
    case 'Long':
    case 'Float':
    case 'Double':
    case 'BigDecimal':
      return { type: 'Input', config: { type: 'NUMBER' } };
    case 'Boolean':
      return { type: 'Checkbox' };
    case 'Date':
    case 'DateTime':
    case 'java.util.Date':
      return { type: 'DatePicker' };
    default:
      return { type: undefined };
  }
};
