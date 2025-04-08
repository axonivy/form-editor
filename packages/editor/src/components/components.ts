import type { ComponentConfig, Config, ItemCategory } from '../types/config';
import { groupBy } from '../utils/array';
import { useButtonComponent } from './blocks/button/Button';
import { useLayoutComponent } from './blocks/layout/Layout';
import { useInputComponent } from './blocks/input/Input';
import { useLinkComponent } from './blocks/link/Link';
import { useTextComponent } from './blocks/text/Text';
import { useCheckboxComponent } from './blocks/checkbox/Checkbox';
import { useSelectComponent } from './blocks/select/Select';
import { isTable, type ComponentData, type ComponentType } from '@axonivy/form-editor-protocol';
import type { AutoCompleteWithString } from '../types/types';
import { useComboboxComponent } from './blocks/combobox/Combobox';
import { useRadioComponent } from './blocks/radio/Radio';
import { useDatePickerComponent } from './blocks/datepicker/DatePicker';
import { useTextareaComponent } from './blocks/textarea/Textarea';
import { useDataTableComponent } from './blocks/datatable/DataTable';
import { useDataTableColumnComponent } from './blocks/datatablecolumn/DataTableColumn';
import { useFieldsetComponent } from './blocks/fieldset/Fieldset';
import { usePanelComponent } from './blocks/panel/Panel';
import { getParentComponent } from '../data/data';
import { useCompositeComponent } from './blocks/composite/Composite';
import { useDialogComponent } from './blocks/dialog/Dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentConfigWithoutType = Omit<ComponentConfig<any, any>, 'type'>;

export type ComponentByName = (name: AutoCompleteWithString<ComponentType>) => ComponentConfigWithoutType;

export type ComponentForType = (type: AutoCompleteWithString<ComponentType>) =>
  | {
      component: ComponentConfigWithoutType;
      defaultProps?: object | undefined;
    }
  | undefined;

export const useComponents = () => {
  const componentByElement = (element: ComponentData, data: Array<ComponentData>) => {
    const component = componentByName(element.type);
    if (component === undefined && isTable(getParentComponent(data, element.cid))) {
      return componentByName('DataTableColumn');
    }
    return component;
  };

  const componentByName: ComponentByName = name => {
    return config.components[name];
  };

  const componentsByCategory = (category: ItemCategory) => {
    // Provisional: Filter out undefined components before checking category
    const filteredComponents = Object.values(config.components)
      .filter(component => component !== undefined)
      .filter(component => component.category === category);

    return groupBy(Object.values(filteredComponents), item => item.subcategory);
  };

  const allComponentsByCategory = () => {
    // Provisional: Filter out undefined components before checking category
    return groupBy(
      Object.values(config.components)
        .filter(component => component !== undefined)
        .filter(component => component.category !== 'Hidden'),
      item => item.category
    );
  };

  const componentForType: ComponentForType = type => {
    if (type.startsWith('List<') && type.endsWith('>')) {
      return { component: config.components.DataTable };
    }

    switch (type) {
      case 'String':
        return { component: config.components.Input };
      case 'Number':
      case 'Byte':
      case 'Short':
      case 'Integer':
      case 'Long':
      case 'Float':
      case 'Double':
      case 'BigDecimal':
        return { component: config.components.Input, defaultProps: { type: 'NUMBER' } };
      case 'Boolean':
        return { component: config.components.Checkbox };
      case 'Date':
      case 'DateTime':
      case 'java.util.Date':
        return { component: config.components.DatePicker };
      default:
        return undefined;
    }
  };

  const { InputComponent } = useInputComponent();
  const { TextareaComponent } = useTextareaComponent();
  const { DatePickerComponent } = useDatePickerComponent();
  const { ComboboxComponent } = useComboboxComponent();
  const { CheckboxComponent } = useCheckboxComponent();
  const { RadioComponent } = useRadioComponent();
  const { SelectComponent } = useSelectComponent();
  const { TextComponent } = useTextComponent();
  const { ButtonComponent } = useButtonComponent();
  const { LinkComponent } = useLinkComponent();
  const { LayoutComponent } = useLayoutComponent();
  const { DataTableComponent } = useDataTableComponent(componentByName);
  const { DataTableColumnComponent } = useDataTableColumnComponent();
  const { FieldsetComponent } = useFieldsetComponent();
  const { PanelComponent } = usePanelComponent();
  const { DialogComponent } = useDialogComponent();
  const { CompositeComponent } = useCompositeComponent();

  const config: Config = {
    components: {
      Input: InputComponent,
      Textarea: TextareaComponent,
      DatePicker: DatePickerComponent,
      Combobox: ComboboxComponent,
      Checkbox: CheckboxComponent,
      Radio: RadioComponent,
      Select: SelectComponent,
      Text: TextComponent,
      Button: ButtonComponent,
      Link: LinkComponent,
      Layout: LayoutComponent,
      DataTable: DataTableComponent,
      DataTableColumn: DataTableColumnComponent,
      Fieldset: FieldsetComponent,
      Panel: PanelComponent,
      Dialog: DialogComponent,
      Composite: CompositeComponent
    }
  } as const;

  return {
    config,
    componentByElement,
    componentByName,
    componentsByCategory,
    allComponentsByCategory,
    componentForType
  };
};
