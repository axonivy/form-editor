import { App, ClientContextProvider, QueryProvider, initQueryClient } from '@axonivy/form-editor';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { FormClientMock } from './mock/form-client-mock';
import { parameter, readonlyParam } from './url-helper';

export function start() {
  const datatable = parameter('datatable') === 'true';
  const formClient = new FormClientMock(datatable);
  const queryClient = initQueryClient();
  const readonly = readonlyParam();

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('Root element not found');
  }
  initTranslation();
  createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme='light'>
        <ClientContextProvider client={formClient}>
          <QueryProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <HotkeysProvider initiallyActiveScopes={['global']}>
                <App context={{ app: '', pmv: '', file: '' }} />
              </HotkeysProvider>
            </ReadonlyProvider>
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
