import { App, ClientContextProvider, initQueryClient, QueryProvider } from '@axonivy/form-editor';
import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { Flex, HotkeysProvider, ReadonlyProvider, Spinner, ThemeProvider, toast, Toaster } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { appParam, directSaveParam, fileParam, pmvParam, readonlyParam, themeParam, webSocketBase } from './url-helper';

export async function start() {
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
  initTranslation();
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
            <QueryProvider client={queryClient}>
              <ReadonlyProvider readonly={readonly}>
                <HotkeysProvider initiallyActiveScopes={['global']}>
                  <App context={{ app, pmv, file }} directSave={directSave} />
                </HotkeysProvider>
              </ReadonlyProvider>
            </QueryProvider>
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

  await webSocketConnection<FormClientJsonRpc>(FormClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: { log: console.log, info: toast.info, warn: toast.warning, error: toast.error }
  });
}

start();
