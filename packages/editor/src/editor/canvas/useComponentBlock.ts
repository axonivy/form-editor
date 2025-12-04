import { useReadonly } from '@axonivy/ui-components';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getParentComponent, modifyData, useData } from '../../data/data';
import type { DraggableProps } from './ComponentBlock';
import { getQuickActions, isDataTableEditableButtons } from './quickbar/component-quickaction-registry';
import type { PaletteMode } from './quickbar/Quickbar';
import { useQuickActions } from './quickbar/useQuickActions';
import { useComponentBlockActions } from './useComponentBlockActions';

export const useComponentBlockInit = ({ config, data }: DraggableProps) => {
  const [componentMenu, setComponentMenu] = useState(false);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(undefined);
  const readonly = useReadonly();
  const { setSelectedElement, setUi } = useAppContext();
  const { data: formData, setData } = useData();
  const actions = useComponentBlockActions({ config, data, setComponentMenu, setPaletteMode });
  const availableActions = getQuickActions(data, getParentComponent(formData.components, data.cid)?.type);
  const { quickActionRegistry } = useQuickActions();
  const quickActions = availableActions.map(key => quickActionRegistry[key]).filter(Boolean);

  const componentActionButtons = quickActions
    .filter(a => a.group === 'component')
    .map(a => a.render({ data, config, actions, componentMenu, paletteMode, key: a.id(data) }));
  const structureActionButtons = quickActions
    .filter(a => a.group === 'structural')
    .map(a => a.render({ data, config, actions, componentMenu, paletteMode, key: a.id(data) }));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setSelectedElement(data.cid);
      setUi(old => ({ ...old, properties: true }));
    }
    if (readonly) return;
    if (e.key === 'ArrowUp' && !isDataTableEditableButtons(data)) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveUp', data: { id: data.cid } }).newData);
    }
    if (e.key === 'ArrowDown' && !isDataTableEditableButtons(data)) {
      e.stopPropagation();
      setData(oldData => modifyData(oldData, { type: 'moveDown', data: { id: data.cid } }).newData);
    }
    const action = quickActions.find(a => a.shortcut === e.code);
    if (action) {
      const element = document.getElementById(action.id(data));
      if (element) {
        if (getComputedStyle(element).visibility !== 'hidden') {
          e.stopPropagation();
          e.preventDefault();
          element.click();
        }
      }
    }
  };

  return {
    data,
    config,
    onKeyDown,
    componentMenu,
    setComponentMenu,
    paletteMode,
    setPaletteMode,
    actions,
    componentActionButtons,
    structureActionButtons
  };
};
