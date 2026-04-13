import { createContext, use, type ReactNode } from 'react';
import type { DraggableProps } from '../editor/canvas/ComponentBlock';
import { useComponentBlockInit } from '../editor/canvas/useComponentBlock';

type ComponentBlockContextValue = ReturnType<typeof useComponentBlockInit>;

const ComponentBlockContext = createContext<ComponentBlockContextValue | null>(null);

export const ComponentBlockProvider = ({ children, config, data }: { children: ReactNode } & DraggableProps) => {
  const components = useComponentBlockInit({ config, data });
  return <ComponentBlockContext value={components}>{children}</ComponentBlockContext>;
};

export const useComponentBlock = (): ComponentBlockContextValue => {
  const context = use(ComponentBlockContext);
  if (context === null) {
    throw new Error('useComponentBlock must be used within <ComponentBlockProvider>');
  }
  return context;
};
