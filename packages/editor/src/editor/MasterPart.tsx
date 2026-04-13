import { Flex, ResizablePanel } from '@axonivy/ui-components';
import { useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useAppContext } from '../context/AppContext';
import { useData } from '../data/data';
import { Canvas } from './canvas/Canvas';
import { ErrorFallback } from './canvas/ErrorFallback';
import { FormToolbar } from './FormToolbar';

export const MasterPart = () => {
  const { setSelectedElement, setUi } = useAppContext();
  const { data } = useData();
  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <ResizablePanel
      id='canvas'
      defaultSize='50%'
      minSize='30%'
      className='panel'
      onClick={e => {
        if (e.target !== e.currentTarget && !toolbarRef.current?.contains(e.target as Node)) {
          setSelectedElement(undefined);
          setUi(old => ({ ...old, properties: !old.properties }));
        }
      }}
    >
      <Flex direction='column' className='canvas-panel'>
        <FormToolbar ref={toolbarRef} />
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
          <Canvas />
        </ErrorBoundary>
      </Flex>
    </ResizablePanel>
  );
};
