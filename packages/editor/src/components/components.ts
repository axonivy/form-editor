import { type ComponentData, type ComponentType } from '@axonivy/form-editor-protocol';
import { groupBy } from '@axonivy/ui-components';
import type { ComponentConfig, Config, ItemCategory } from '../types/config';
import type { AutoCompleteWithString } from '../types/types';
import { useButtonComponent } from './blocks/button/Button';
import { useCheckboxComponent } from './blocks/checkbox/Checkbox';
import { useComboboxComponent } from './blocks/combobox/Combobox';
import { useCompositeComponent } from './blocks/composite/Composite';
import { useDataTableComponent } from './blocks/datatable/DataTable';
import { useDataTableColumnComponent } from './blocks/datatablecolumn/DataTableColumn';
import { useDatePickerComponent } from './blocks/datepicker/DatePicker';
import { useDialogComponent } from './blocks/dialog/Dialog';
import { useFieldsetComponent } from './blocks/fieldset/Fieldset';
import { useInputComponent } from './blocks/input/Input';
import { useLayoutComponent } from './blocks/layout/Layout';
import { useLinkComponent } from './blocks/link/Link';
import { usePanelComponent } from './blocks/panel/Panel';
import { useRadioComponent } from './blocks/radio/Radio';
import { useSelectComponent } from './blocks/select/Select';
import { useTextComponent } from './blocks/text/Text';
import { useTextareaComponent } from './blocks/textarea/Textarea';

export const useComponentsInit = () => {
  const componentByElement = (element: ComponentData) => {
    return componentByName(element.type);
  };

  const componentByName = (type: AutoCompleteWithString<ComponentType>): ComponentConfig | undefined => {
    return config.components[type];
  };

  const componentsByCategory = (category: ItemCategory) => {
    const filteredComponents = Object.values(config.components).filter(component => component.category === category);
    return groupBy(Object.values(filteredComponents), item => item.subcategory);
  };

  const allComponentsByCategory = () => {
    return groupBy(
      Object.values(config.components).filter(component => component?.category !== 'Hidden'),
      item => item.category
    );
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
  const { DataTableComponent } = useDataTableComponent();
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
    allComponentsByCategory
  };
};
