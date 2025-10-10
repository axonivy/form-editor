import { EMPTY_FORM, type FormContext, type FormData, type ValidationResult } from '@axonivy/form-editor-protocol';
import { useReadonly, type useHistoryData } from '@axonivy/ui-components';
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import type { UpdateConsumer } from '../types/types';

export type UI = {
  properties: boolean;
  helpPaddings: boolean;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
};

const DEFAULT_UI: UI = { properties: false, helpPaddings: true, deviceMode: 'desktop' };

export const useUiState = () => {
  const readonly = useReadonly();
  const [ui, setUi] = useState<UI>(readonly ? { ...DEFAULT_UI, helpPaddings: false } : DEFAULT_UI);
  return { ui, setUi };
};

export type AppContext = {
  data: FormData;
  setData: UpdateConsumer<FormData>;
  selectedElement?: string;
  setSelectedElement: (element?: string) => void;
  ui: UI;
  setUi: Dispatch<SetStateAction<UI>>;
  context: FormContext;
  history: ReturnType<typeof useHistoryData<FormData>>;
  validations: Array<ValidationResult>;
  helpUrl: string;
  previewUrl: string;
  namespace: string;
};

export const appContext = createContext<AppContext>({
  data: EMPTY_FORM,
  setData: data => data,
  setSelectedElement: () => {},
  ui: DEFAULT_UI,
  setUi: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  validations: [],
  helpUrl: '',
  previewUrl: '',
  namespace: ''
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};
