import type { LogicMethodInfo } from '@axonivy/form-editor-protocol';
import { useBrowser, type Browser } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { formatLogicMethodInfo, logicTreeData } from './logic-tree-data';

export const LOGIC_BROWSER_ID = 'Logic';

export const useLogicBrowser = (): Browser => {
  const { context } = useAppContext();
  const logicInfo = useMeta('meta/data/logic', context, { startMethods: [], eventStarts: [] }).data;
  const tree = useMemo(() => logicTreeData(logicInfo), [logicInfo]);
  const browser = useBrowser(tree, { expandedState: true });
  return {
    name: LOGIC_BROWSER_ID,
    icon: IvyIcons.Process,
    browser,
    infoProvider: row => (row?.original.data ? formatLogicMethodInfo(row?.original.data as LogicMethodInfo) : row?.original.info),
    applyModifier: row => ({ value: 'logic.' + row?.original.value })
  };
};
