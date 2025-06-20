import { CONFIG_DEFAULTS, type ComponentConfigs, type ComponentData, type ComponentType } from '@axonivy/form-editor-protocol';

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
  const config = addDefaults(type, createData?.config);
  switch (type) {
    case 'Button':
      return { ...config, name: createData?.label, action: createData?.value };
  }
  return config;
};

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
