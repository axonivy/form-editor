import type { Component, ComponentData, ComponentType } from '@axonivy/form-editor-protocol';
import { Button, Flex, Popover, PopoverAnchor, PopoverContent, Separator, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../../context/ComponentsContext';
import { useData } from '../../data/data';
import { DataClassDialog } from '../browser/data-class/DataClassDialog';
import { ExtractComponentDialog } from '../browser/extract/ExtractComponentDialog';
import { FormPalette } from '../palette/Palette';

type QuickbarProps = {
  deleteAction?: () => void;
  duplicateAction?: () => void;
  createAction?: (name: ComponentType) => void;
  changeTypeAction?: (name: ComponentType) => void;
  openComponentAction?: () => void;
  extractIntoComponent?: { data: Component | ComponentData; openDialog: boolean; setOpenDialog: (open: boolean) => void };
  createColumnAction?: () => void;
  createActionColumnAction?: () => void;
  createActionColumnButtonAction?: () => void;
  createFromDataAction?: string;
};

export const Quickbar = (props: QuickbarProps) => {
  const [menu, setMenu] = useState(false);
  const [paletteMode, setPaletteMode] = useState<'create' | 'replace' | null>(null);
  const readonly = useReadonly();
  if (readonly) {
    return null;
  }
  return (
    <PopoverContent className='quickbar' sideOffset={8} onOpenAutoFocus={e => e.preventDefault()} hideWhenDetached={true}>
      <Popover open={menu} onOpenChange={change => setMenu(change)}>
        <PopoverAnchor asChild>
          <Flex gap={1}>
            <QuickbarButtons setPaletteMode={setPaletteMode} onToggleMenu={() => setMenu(old => !old)} {...props} />
          </Flex>
        </PopoverAnchor>
        <PopoverContent className='quickbar-menu' sideOffset={8} onClick={e => e.stopPropagation()}>
          <PaletteContent paletteMode={paletteMode} {...props} />
        </PopoverContent>
      </Popover>
    </PopoverContent>
  );
};

type QuickbarButtonsProps = {
  onToggleMenu: () => void;
  setPaletteMode: (mode: 'create' | 'replace' | null) => void;
} & QuickbarProps;

const QuickbarButtons = ({
  deleteAction,
  duplicateAction,
  createAction,
  extractIntoComponent,
  openComponentAction,
  createColumnAction,
  createActionColumnAction,
  changeTypeAction,
  createFromDataAction,
  createActionColumnButtonAction,
  onToggleMenu,
  setPaletteMode
}: QuickbarButtonsProps) => {
  const { t } = useTranslation();

  return (
    <>
      {deleteAction && (
        <Button icon={IvyIcons.Trash} aria-label={t('common.label.delete')} title={t('common.label.delete')} onClick={deleteAction} />
      )}
      {duplicateAction && (
        <Button icon={IvyIcons.Duplicate} aria-label={t('label.duplicate')} title={t('label.duplicate')} onClick={duplicateAction} />
      )}
      {openComponentAction && (
        <Button
          icon={IvyIcons.SubEnd}
          rotate={180}
          aria-label={t('label.openComponent')}
          title={t('label.openComponent')}
          onClick={openComponentAction}
        />
      )}
      {extractIntoComponent && (
        <ExtractComponentDialog
          data={extractIntoComponent.data}
          openDialog={extractIntoComponent.openDialog}
          setOpenDialog={extractIntoComponent.setOpenDialog}
        >
          <Button
            icon={IvyIcons.WrapToSubprocess}
            aria-label={t('label.extractComponent')}
            title={t('label.extractComponent')}
            onClick={e => {
              e.stopPropagation();
              onToggleMenu();
            }}
          />
        </ExtractComponentDialog>
      )}
      {(createColumnAction || createActionColumnButtonAction || createAction || createFromDataAction) && (
        <Separator orientation='vertical' style={{ height: 20, margin: '0 var(--size-1)' }} />
      )}
      {createColumnAction && (
        <Button
          icon={IvyIcons.PoolSwimlanes}
          rotate={90}
          aria-label={t('label.createCol')}
          title={t('label.createCol')}
          onClick={createColumnAction}
        />
      )}
      {createActionColumnAction && (
        <Button
          icon={IvyIcons.MultiSelection}
          aria-label={t('label.createActionCol')}
          title={t('label.createActionCol')}
          onClick={createActionColumnAction}
        />
      )}
      {createActionColumnButtonAction && (
        <Button
          icon={IvyIcons.MultiSelection}
          aria-label={t('label.createActionColBtn')}
          title={t('label.createActionColBtn')}
          onClick={createActionColumnButtonAction}
        />
      )}
      {changeTypeAction && (
        <Button
          icon={IvyIcons.ChangeType}
          aria-label={t('label.changeComponentType')}
          title={t('label.changeComponentType')}
          onClick={e => {
            e.stopPropagation();
            setPaletteMode('replace');
            onToggleMenu();
          }}
        />
      )}
      {createFromDataAction && (
        <DataClassDialog workflowButtonsInit={false} creationTarget={createFromDataAction}>
          <Button
            icon={IvyIcons.DatabaseLink}
            size='small'
            aria-label={t('label.createFromData')}
            title={t('label.createFromData')}
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </DataClassDialog>
      )}
      {createAction && (
        <Button
          icon={IvyIcons.Task}
          aria-label={t('label.allComponents')}
          title={t('label.allComponents')}
          onClick={e => {
            e.stopPropagation();
            setPaletteMode('create');
            onToggleMenu();
          }}
        />
      )}
    </>
  );
};

type PaletteContentProps = Pick<QuickbarProps, 'createAction' | 'changeTypeAction'> & {
  paletteMode: 'create' | 'replace' | null;
};

const PaletteContent = ({ changeTypeAction, createAction, paletteMode }: PaletteContentProps) => {
  const { allComponentsByCategory, componentsByElement } = useComponents();

  const { element } = useData();
  const sections =
    paletteMode === 'replace' && element
      ? componentsByElement(element, [element.type, 'DataTableColumn', 'Dialog', 'Composite'])
      : allComponentsByCategory();

  return (
    <FormPalette
      sections={sections}
      directCreate={type => {
        if (paletteMode === 'replace') {
          changeTypeAction?.(type as ComponentType);
        } else {
          createAction?.(type as ComponentType);
        }
      }}
    />
  );
};
