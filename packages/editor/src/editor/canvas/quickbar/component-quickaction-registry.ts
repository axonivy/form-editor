import type { Button, ComponentData, ComponentType, DataTableColumn } from '@axonivy/form-editor-protocol';
import type { QuickAction } from './useQuickActions';

export const DEFAULT_QUICK_ACTIONS: Array<QuickAction> = ['DELETE', 'DUPLICATE', 'CREATEFROMDATA', 'CHANGETYPE', 'CREATE'] as const;

export const getQuickActions = (component: ComponentData, parentType?: ComponentType): QuickAction[] => {
  let quickActions: QuickAction[] = DEFAULT_QUICK_ACTIONS;

  switch (component.type) {
    case 'Button':
      if (isDialogButton(component)) {
        return [];
      }
      if (isDataTableEditableButtons(component)) {
        return ['DELETE'];
      }
      quickActions = DEFAULT_QUICK_ACTIONS;
      break;
    case 'DataTable':
      quickActions = ['DELETE', 'DUPLICATE', 'CREATECOLUMN', 'CREATEACTIONCOLUMN', 'CHANGETYPE'];
      break;
    case 'DataTableColumn':
      if (!(component.config as DataTableColumn).asActionColumn) {
        quickActions = ['DELETE', 'DUPLICATE'];
      } else {
        quickActions = ['DELETE', 'DUPLICATE', 'CREATEACTIONCOLUMNBUTTON'];
      }
      break;
    case 'Composite':
      quickActions = ['DELETE', 'DUPLICATE', 'CREATE', 'CREATEFROMDATA', 'OPENCOMPONENT'];
      break;
    case 'Fieldset':
      quickActions = [...DEFAULT_QUICK_ACTIONS, 'EXTRACTINTOCOMPONENT'];
      break;
    case 'Layout':
      quickActions = [...DEFAULT_QUICK_ACTIONS, 'EXTRACTINTOCOMPONENT'];
      break;
    case 'Panel':
      quickActions = [...DEFAULT_QUICK_ACTIONS, 'EXTRACTINTOCOMPONENT'];
      break;
  }
  if (parentType === 'DataTableColumn') {
    return ['DELETE'];
  }
  if (parentType === 'Dialog') {
    return quickActions.filter(a => a !== 'CREATEFROMDATA');
  }
  return quickActions;
};

export const isDataTableEditableButtons = (data: ComponentData) => {
  return data.type === 'Button' && ((data.config as Button).type === 'EDIT' || (data.config as Button).type === 'DELETE');
};

export const isDialogButton = (data: ComponentData) => {
  return data.type === 'Button' && ((data.config as Button).type === 'DIALOGCANCEL' || (data.config as Button).type === 'DIALOGSAVE');
};
