/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type FormContext,
  type FormData,
  type FormMetaRequestTypes,
  type ValidationResult,
  type VariableInfo
} from '@axonivy/form-editor-protocol';
import { type SetStateAction, type Dispatch, type ReactNode } from 'react';
import { type useHistoryData } from '@axonivy/ui-components';
import { AppProvider, type UI } from '../context/AppContext';
import { renderHook, type RenderHookOptions } from '@testing-library/react';
import { ClientContextProvider, type ClientContext } from '../context/ClientContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type ContextHelperProps = {
  appContext?: {
    context?: FormContext;
    data?: FormData;
    setData?: (data: FormData) => void;
    selectedElement?: string;
    setSelectedElement?: Dispatch<SetStateAction<string | undefined>>;
    ui?: UI;
    setUi?: Dispatch<SetStateAction<UI>>;
    history?: ReturnType<typeof useHistoryData<FormData>>;
    validations?: Array<ValidationResult>;
    helpUrl?: string;
  };
  meta?: {
    attributes?: VariableInfo;
  };
};

const ContextHelper = ({ appContext, meta, children }: ContextHelperProps & { children: ReactNode }) => {
  const data = appContext?.data ?? ({} as FormData);
  const client: ClientContext = {
    // @ts-ignore
    client: {
      meta<TMeta extends keyof FormMetaRequestTypes>(path: TMeta): Promise<FormMetaRequestTypes[TMeta][1]> {
        switch (path) {
          case 'meta/data/attributes':
            return Promise.resolve(meta?.attributes ?? { types: {}, variables: [] });

          default:
            throw Error('mock meta path not programmed');
        }
      }
    }
  };
  const queryClient = new QueryClient();
  return (
    <ClientContextProvider client={client.client}>
      <QueryClientProvider client={queryClient}>
        <AppProvider
          value={{
            context: appContext?.context ?? ({ file: '' } as FormContext),
            data,
            // @ts-ignore
            setData: appContext?.setData ? getData => appContext.setData(getData(data)) : () => {},
            selectedElement: appContext?.selectedElement,
            setSelectedElement: appContext?.setSelectedElement ?? (() => {}),
            ui: appContext?.ui ?? { deviceMode: 'desktop', helpPaddings: true, properties: false },
            setUi: appContext?.setUi ? appContext.setUi : () => {},
            history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
            validations: [],
            helpUrl: appContext?.helpUrl ?? ''
          }}
        >
          {children}
        </AppProvider>
      </QueryClientProvider>
    </ClientContextProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};
