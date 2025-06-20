import { createContext, useContext, type ReactNode } from 'react';
import { useComponentsInit } from '../components/components';

type ComponentsContextValue = ReturnType<typeof useComponentsInit>;

const ComponentsContext = createContext<ComponentsContextValue | null>(null);

export const ComponentsProvider = ({ children }: { children: ReactNode }) => {
  const components = useComponentsInit();
  return <ComponentsContext.Provider value={components}>{children}</ComponentsContext.Provider>;
};

export const useComponents = (): ComponentsContextValue => {
  const context = useContext(ComponentsContext);
  if (context === null) {
    throw new Error('useComponents must be used within <ComponentsProvider>');
  }
  return context;
};
