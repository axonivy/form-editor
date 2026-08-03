import './Editor.css';
import { useEffect, useMemo, useState } from 'react';
import { AppProvider, useUiState } from '../context/AppContext';
import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, Spinner, useHistoryData } from '@axonivy/ui-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import type { Unary } from '../types/types';
import type { FormContext, FormData, FormEditor } from '@axonivy/form-editor-protocol';
import { DndContext } from '../context/DndContext';
import { genQueryKey } from '../query/query-client';
import { IvyIcons } from '@axonivy/ui-icons';
import { MasterPart } from './MasterPart';
import { Sidebar } from './sidebar/Sidebar';
import { useTranslation } from 'react-i18next';
import { ComponentsProvider } from '../context/ComponentsContext';
import { useComponentsInit } from '../components/components';
import { initTranslation } from '../translation/i18n';

export type FormEditorProps = { context: FormContext; directSave?: boolean };

export const Editor = ({ context, directSave }: FormEditorProps) => {
  initTranslation();
  const { t } = useTranslation();
  const components = useComponentsInit();
  const { componentByName } = components;
  const [selectedElement, setSelectedElement] = useState<string>();
  const { ui, setUi } = useUiState();
  const [initialData, setInitialData] = useState<FormData | undefined>(undefined);
  const history = useHistoryData<FormData>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: (context: FormContext) => genQueryKey('data', context),
      saveData: (context: FormContext) => genQueryKey('saveData', context),
      validation: (context: FormContext) => genQueryKey('validations', context)
    };
  }, []);

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const { data: validations } = useQuery({
    queryKey: queryKeys.validation(context),
    queryFn: () => client.validate(context),
    initialData: [],
    enabled: isSuccess
  });

  useEffect(() => {
    const validationDispose = client.onValidationChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.validation(context) }));
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    const selectElementDispose = client.onSelectElement(selectedElement => setSelectedElement(selectedElement));
    return () => {
      validationDispose.dispose();
      dataDispose.dispose();
      selectElementDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  if (data?.data !== undefined && initialData === undefined) {
    setInitialData(data.data);
    history.push(data.data);
  }

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: (updateData: Unary<FormData>) => {
      const saveData = queryClient.setQueryData<FormEditor>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave });
      }
      return Promise.resolve();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.validation(context) })
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }
  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccured', { message: error.message })} />;
  }
  if (data.data.components === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.formNotFound')} />;
  }

  return (
    <AppProvider
      value={{
        data: data.data,
        setData: mutation.mutate,
        selectedElement,
        setSelectedElement,
        ui,
        setUi,
        context,
        history,
        validations,
        helpUrl: data.helpUrl,
        previewUrl: data.previewUrl,
        namespace: data.namespace
      }}
    >
      <link rel='stylesheet' href='/dev-workflow-ui/webjars/font-awesome/6.1.0/css/all.min.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/webjars/streamline-icons/11.4.0/StreamlineIcons.css' />
      <link rel='stylesheet' href='/dev-workflow-ui/faces/javax.faces.resource/primeicons/primeicons.css?ln=primefaces&v=13.0.14-LTS' />
      <ComponentsProvider components={components}>
        <DndContext componentByName={componentByName}>
          <ResizablePanelGroup direction='horizontal' autoSaveId='form-editor-resize'>
            <MasterPart />
            {ui.properties && (
              <>
                <ResizableHandle />
                <ResizablePanel id='properties' order={3} defaultSize={25} minSize={10} className='panel'>
                  <Sidebar />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </DndContext>
      </ComponentsProvider>
    </AppProvider>
  );
};
