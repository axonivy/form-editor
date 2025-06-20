import type { BaseProps, DisableProps, RequireProps, UpdateProps, VisibleProps } from '..';
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

const VISIBLE_DEFAULTS: VisibleProps = {
  visible: ''
} as const;

const DISABLE_DEFAULTS: DisableProps = {
  ...VISIBLE_DEFAULTS,
  disabled: ''
} as const;

const UPDATE_DEFAULTS: UpdateProps = {
  ...DISABLE_DEFAULTS,
  updateOnChange: false
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
  name: '',
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
  label: '',
  selected: 'true',
  ...UPDATE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const COMBOBOX_DEFAULTS: Combobox = {
  label: '',
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
  maxRows: '10',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const DATATABLECOLUMN_DEFAULTS: DataTableColumn = {
  header: 'header',
  value: '',
  components: [],
  asActionColumn: false,
  actionColumnAsMenu: false,
  sortable: false,
  filterable: false,
  actionButtonAlignment: 'END',
  ...VISIBLE_DEFAULTS
} as const;

export const DATEPICKER_DEFAULTS: DatePicker = {
  label: '',
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
  ...BASE_DEFAULTS
} as const;

export const FIELDSET_DEFAULTS: Fieldset = {
  components: [],
  legend: '',
  collapsible: false,
  collapsed: false,
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const INPUT_DEFAULTS: Input = {
  label: '',
  value: '',
  type: 'TEXT',
  decimalPlaces: '',
  symbol: '',
  symbolPosition: 's',
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
  name: '',
  href: '',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const PANEL_DEFAULTS: Panel = {
  components: [],
  title: '',
  collapsible: false,
  collapsed: false,
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const RADIO_DEFAULTS: Radio = {
  label: '',
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
  label: '',
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
  content: '',
  type: 'RAW',
  iconStyle: 'INLINE',
  ...VISIBLE_DEFAULTS,
  ...BASE_DEFAULTS
} as const;

export const TEXTAREA_DEFAULTS: Textarea = {
  label: '',
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
} as const;
