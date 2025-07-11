import type { Component, ComponentData } from '@axonivy/form-editor-protocol';
import { Button, cn, Flex, PanelMessage } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { STRUCTURE_DROPZONE_ID_PREFIX } from '../../data/data';
import { DataClassDialog } from '../browser/data-class/DataClassDialog';
import { DropZone } from './DropZone';
import './EmptyBlock.css';

type EmptyBlockProps = {
  id: string;
  components: Array<ComponentData> | Array<Component>;
};

export const EmptyBlock = ({ id, components }: EmptyBlockProps) => {
  const { t } = useTranslation();
  return (
    <DropZone id={id} preId={components.at(-1)?.cid ?? ''}>
      {components.length === 0 ? (
        <Flex direction='column' alignItems='center' justifyContent='center' className='canvas-empty-message'>
          <PanelMessage message={t('hint.dragFirstItem')} mode='column' className={cn('drag-hint', 'column')} />
          <Flex justifyContent='center'>
            <DataClassDialog>
              <Button className='drag-hint-button' size='large' variant='primary'>
                {t('label.createFromData')}
              </Button>
            </DataClassDialog>
          </Flex>
        </Flex>
      ) : (
        <div className='empty-block' />
      )}
    </DropZone>
  );
};

export const EmptyLayoutBlock = ({ id, components, type }: EmptyBlockProps & { type: string }) => {
  const { t } = useTranslation();
  return (
    <DropZone id={`${STRUCTURE_DROPZONE_ID_PREFIX}${id}`} preId={components[components.length - 1]?.cid}>
      {components.length === 0 ? (
        <PanelMessage message={t('hint.dragItemInto', { type: type })} mode='row' className='drag-hint row' />
      ) : (
        <div className='empty-block for-layout' />
      )}
    </DropZone>
  );
};
