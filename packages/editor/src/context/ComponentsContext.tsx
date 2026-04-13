import { createContext, use, type ReactNode } from 'react';
import { useComponentsInit } from '../components/components';

type ComponentsContextValue = ReturnType<typeof useComponentsInit>;

const ComponentsContext = createContext<ComponentsContextValue | null>(null);

export const ComponentsProvider = ({ children }: { children: ReactNode }) => {
  const components = useComponentsInit();
  return <ComponentsContext value={components}>{children}</ComponentsContext>;
};

export const useComponents = (): ComponentsContextValue => {
  const context = use(ComponentsContext);
  if (context === null) {
    throw new Error('useComponents must be used within <ComponentsProvider>');
  }
  return context;
};
