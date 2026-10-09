import './index.css';
import { App, ClientContextProvider, initQueryClient } from '@axonivy/form-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { ThemeProvider, ReadonlyProvider, toast, Toaster, Spinner, Flex, HotkeysProvider } from '@axonivy/ui-components';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { webSocketBase, appParam, pmvParam, fileParam, directSaveParam, themeParam, readonlyParam } from './url-helper';

export async function start(): Promise<void> {
  const server = webSocketBase();
  const app = appParam();
  const pmv = pmvParam();
  const file = fileParam();
  const directSave = directSaveParam();
  const theme = themeParam();
  const readonly = readonlyParam();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (rootElement === null) {
    throw new Error('Root element not found');
  }
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
        <Toaster closeButton={true} position='bottom-left' />
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await FormClientJsonRpc.startClient(connection);
    client.initialize({ app, pmv, file });
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryClientProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <App context={{ app, pmv, file }} directSave={directSave} />
                </HotkeysProvider>
              </ReadonlyProvider>
              <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
            </QueryClientProvider>
          </ClientContextProvider>
          <Toaster closeButton={true} position='bottom-left' />
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: FormClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<FormClientJsonRpc>(FormClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
