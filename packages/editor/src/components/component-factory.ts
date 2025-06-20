import {
  CONFIG_DEFAULTS,
  type Component,
  type ComponentConfigs,
  type ComponentType,
  type DataTableColumn
} from '@axonivy/form-editor-protocol';

export const addDefaults = <TType extends ComponentType>(type: TType, config?: Partial<ComponentConfigs[TType]>) => {
  const defaults: Component['config'] | DataTableColumn = CONFIG_DEFAULTS[type];
  return { ...defaults, ...config } as ComponentConfigs[TType];
};

export const createComponent = <TType extends ComponentType>(type: TType, initProps?: ComponentConfigs[TType]) => {
  return addDefaults(type, initProps);
};
