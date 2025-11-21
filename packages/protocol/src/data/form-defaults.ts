import type { BaseProps, ComponentType, ConfigData, DisableProps, FormData, RequireProps, UpdateProps, VisibleProps } from '..';
import type {
  Button,
  Checkbox,
  Combobox,
  Composite,
  DataTable,
  DataTableColumn,
  DatePicker,
  Dialog,
  Fieldset,
  Input,
  Layout,
  Link,
  Panel,
  Radio,
  Select,
  Text,
  Textarea
} from './form';

export const EMPTY_FORM: FormData = {
  id: 'empty',
  config: {
    renderer: 'JSF',
    theme: '',
    type: 'FORM'
  },
  components: []
} as const;

const VISIBLE_DEFAULTS: VisibleProps = {
  visible: ''
} as const;

const DISABLE_DEFAULTS: DisableProps = {
  ...VISIBLE_DEFAULTS,
  disabled: ''
} as const;

const UPDATE_DEFAULTS: UpdateProps = {
  ...DISABLE_DEFAULTS,
  updateOnChange: false,
  listener: ''
} as const;

const REQUIRE_DEFAULTS: RequireProps = {
  ...UPDATE_DEFAULTS,
  required: '',
  requiredMessage: ''
} as const;

const BASE_DEFAULTS: BaseProps = {
  id: '',
  alignSelf: 'START',
  lgSpan: '6',
  mdSpan: '12'
} as const;

export const BUTTON_DEFAULTS: Button = {
  name: 'Action',
  action: '',
  variant: 'PRIMARY',
  style: 'SOLID',
  rounded: false,
  type: 'BUTTON',
  icon: '',
  processOnlySelf: false,
  confirmDialog: false,
  confirmMessage: '',
  confirmHeader: '',
  confirmSeverity: 'WARN',
  confirmCancelValue: '',
  confirmOkValue: '',
  ...DISABLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const CHECKBOX_DEFAULTS: Checkbox = {
  label: 'Label',
  selected: 'true',
  ...UPDATE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const COMBOBOX_DEFAULTS: Combobox = {
  label: 'Combobox',
  value: '',
  completeMethod: '',
  itemLabel: '',
  itemValue: '',
  withDropdown: false,
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const COMPOSITE_DEFAULTS: Composite = {
  name: '',
  startMethod: '',
  parameters: {},
  ...BASE_DEFAULTS
} as const;

export const DATATABLE_DEFAULTS: DataTable = {
  components: [],
  value: '',
  isEditable: false,
  addButton: false,
  editDialogId: '',
  paginator: false,
  resizableColumns: true,
  maxRows: '10',
  ...UPDATE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const DATATABLECOLUMN_DEFAULTS: DataTableColumn = {
  header: 'Header',
  value: '#{currentRow}',
  components: [],
  asActionColumn: false,
  actionColumnAsMenu: false,
  sortable: false,
  filterable: false,
  actionButtonAlignment: 'END',
  width: '',
  ...VISIBLE_DEFAULTS
} as const;

export const DATEPICKER_DEFAULTS: DatePicker = {
  label: 'Date Picker',
  value: '',
  datePattern: 'dd.MM.yyyy',
  timePattern: 'HH:mm',
  showTime: false,
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const DIALOG_DEFAULTS: Dialog = {
  components: [],
  header: '',
  linkedComponent: '',
  buttons: [],
  ...BASE_DEFAULTS
} as const;

export const FIELDSET_DEFAULTS: Fieldset = {
  components: [],
  legend: 'Title',
  collapsible: false,
  collapsed: false,
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const INPUT_DEFAULTS: Input = {
  label: 'Input',
  value: '',
  type: 'TEXT',
  decimalPlaces: '',
  symbol: '',
  symbolPosition: 's',
  validationMessage: 'Invalid E-Mail',
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const LAYOUT_DEFAULTS: Layout = {
  components: [],
  type: 'GRID',
  justifyContent: 'NORMAL',
  gridVariant: 'GRID2',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const LINK_DEFAULTS: Link = {
  name: 'Link',
  href: '',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const PANEL_DEFAULTS: Panel = {
  components: [],
  title: 'Title',
  collapsible: false,
  collapsed: false,
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const RADIO_DEFAULTS: Radio = {
  label: 'Radio',
  orientation: 'horizontal',
  value: '',
  staticItems: [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' }
  ],
  dynamicItemsList: '',
  dynamicItemsLabel: '#{item}',
  dynamicItemsValue: '#{item}',
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const SELECT_DEFAULTS: Select = {
  label: 'Select',
  value: '',
  staticItems: [],
  dynamicItemsList: '',
  dynamicItemsLabel: '#{item}',
  dynamicItemsValue: '#{item}',
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const TEXT_DEFAULTS: Text = {
  icon: '',
  content: 'This is a Text',
  type: 'RAW',
  iconStyle: 'INLINE',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const TEXTAREA_DEFAULTS: Textarea = {
  label: 'Textarea',
  value: '',
  rows: '5',
  autoResize: true,
  ...REQUIRE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const CONFIG_DEFAULTS = {
  Button: BUTTON_DEFAULTS,
  Checkbox: CHECKBOX_DEFAULTS,
  Combobox: COMBOBOX_DEFAULTS,
  Composite: COMPOSITE_DEFAULTS,
  DataTable: DATATABLE_DEFAULTS,
  DataTableColumn: DATATABLECOLUMN_DEFAULTS,
  DatePicker: DATEPICKER_DEFAULTS,
  Dialog: DIALOG_DEFAULTS,
  Fieldset: FIELDSET_DEFAULTS,
  Input: INPUT_DEFAULTS,
  Layout: LAYOUT_DEFAULTS,
  Link: LINK_DEFAULTS,
  Panel: PANEL_DEFAULTS,
  Radio: RADIO_DEFAULTS,
  Select: SELECT_DEFAULTS,
  Text: TEXT_DEFAULTS,
  Textarea: TEXTAREA_DEFAULTS
} as const satisfies Record<ComponentType, ConfigData>;

export type ComponentConfigs = typeof CONFIG_DEFAULTS;
