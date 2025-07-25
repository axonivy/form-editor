import type {
  Button as ButtonType,
  Component,
  ComponentData,
  ComponentType,
  Composite,
  DataTableColumn
} from '@axonivy/form-editor-protocol';
import {
  Button,
  cn,
  evalDotState,
  Flex,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Separator,
  useDialogHotkeys,
  useReadonly
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addDefaults } from '../../components/component-factory';
import { useAppContext } from '../../context/AppContext';
import { useComponents } from '../../context/ComponentsContext';
import { useValidations } from '../../context/useValidation';
import { getParentComponent, useData } from '../../data/data';
import type { ComponentConfig } from '../../types/config';
import { DataClassDialog } from '../browser/data-class/DataClassDialog';
import { ExtractComponentDialog } from '../browser/extract/ExtractComponentDialog';
import { FormPalette } from '../palette/Palette';
import './ComponentBlock.css';
import { dragData } from './drag-data';
import { DropZone, type DropZoneProps } from './DropZone';
import { useComponentBlockActions } from './useComponentBlockActions';
import { useCopyPaste } from './useCopyPaste';

type ComponentBlockProps = Omit<DropZoneProps, 'id'> & {
  component: ComponentData | Component;
  preId?: string;
};

export const ComponentBlock = ({ component, preId, ...props }: ComponentBlockProps) => {
  const { componentByName } = useComponents();
  return (
    <DropZone id={component.cid} type={component.type} preId={preId} {...props}>
      <Draggable config={componentByName(component.type)} data={component} />
    </DropZone>
  );
};

export type DraggableProps = {
  config: ComponentConfig;
  data: Component | ComponentData;
};

const Draggable = ({ config, data }: DraggableProps) => {
  const { setUi } = useAppContext();
  const { data: formData } = useData();
  const readonly = useReadonly();
  const isDataTableEditableButtons =
    data.type === 'Button' && ((data.config as ButtonType).type === 'EDIT' || (data.config as ButtonType).type === 'DELETE');
  const { isDragging, attributes, listeners, setNodeRef } = useDraggable({
    disabled: readonly || isDataTableEditableButtons,
    id: data.cid,
    data: dragData(data)
  });
  const { selectedElement, setSelectedElement } = useAppContext();
  const isSelected = selectedElement === data.cid;
  const elementConfig = addDefaults(data.type, data.config);
  const { open: showExtractDialog, onOpenChange: onOpenExtractDialogChange } = useDialogHotkeys(['extractDialog']);
  const { createElement, duplicateElement, openComponent, onKeyDown, deleteElement, createActionButton, createActionColumn, createColumn } =
    useComponentBlockActions({ config, data, setShowExtractDialog: onOpenExtractDialogChange });
  const validations = useValidations(data.cid);
  const clipboardProps = useCopyPaste(data);
  const parentComponent = getParentComponent(formData.components, data.cid);
  if (data.type === 'Dialog') {
    return null;
  }
  return (
    <Popover open={isSelected && !isDragging}>
      <PopoverAnchor asChild>
        <div
          onClick={e => {
            e.stopPropagation();
            setSelectedElement(data.cid);
          }}
          onDoubleClick={e => {
            e.stopPropagation();
            setUi(old => ({ ...old, properties: true }));
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'draggable',
            isSelected && 'selected',
            isDragging && 'dragging',
            validations.length > 0 && `validation ${evalDotState(validations, undefined)}`
          )}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          {...clipboardProps}
        >
          {config.render({ ...elementConfig, id: data.cid })}
        </div>
      </PopoverAnchor>
      <Quickbar
        deleteAction={config.quickActions.includes('DELETE') ? deleteElement : undefined}
        duplicateAction={config.quickActions.includes('DUPLICATE') && !isDataTableEditableButtons ? duplicateElement : undefined}
        createAction={parentComponent?.type !== 'DataTableColumn' && config.quickActions.includes('CREATE') ? createElement : undefined}
        createFromDataAction={
          parentComponent?.type !== 'DataTableColumn' &&
          parentComponent?.type !== 'Dialog' &&
          config.quickActions.includes('CREATEFROMDATA')
            ? data.cid
            : undefined
        }
        openComponentAction={
          config.quickActions.includes('OPENCOMPONENT') && data.type === 'Composite'
            ? () => openComponent((data.config as Composite).name)
            : undefined
        }
        extractIntoComponent={
          config.quickActions.includes('EXTRACTINTOCOMPONENT')
            ? { data, openDialog: showExtractDialog, setOpenDialog: onOpenExtractDialogChange }
            : undefined
        }
        createColumnAction={config.quickActions.includes('CREATECOLUMN') ? createColumn : undefined}
        createActionColumnAction={config.quickActions.includes('CREATEACTIONCOLUMN') ? createActionColumn : undefined}
        createActionColumnButtonAction={
          config.quickActions.includes('CREATEACTIONCOLUMNBUTTON') &&
          data.type === 'DataTableColumn' &&
          (data.config as DataTableColumn).asActionColumn
            ? createActionButton
            : undefined
        }
      />
    </Popover>
  );
};

export const ComponentBlockOverlay = ({ config, data }: DraggableProps) => {
  const elementConfig = addDefaults(data.type, data.config);
  return <div className='draggable dragging'>{config.render({ ...elementConfig, id: data.cid })}</div>;
};

type QuickbarProps = {
  deleteAction?: () => void;
  duplicateAction?: () => void;
  createAction?: (name: ComponentType) => void;
  openComponentAction?: () => void;
  extractIntoComponent?: { data: Component | ComponentData; openDialog: boolean; setOpenDialog: (open: boolean) => void };
  createColumnAction?: () => void;
  createActionColumnAction?: () => void;
  createActionColumnButtonAction?: () => void;
  createFromDataAction?: string;
};

const Quickbar = ({
  deleteAction,
  duplicateAction,
  createAction,
  extractIntoComponent,
  openComponentAction,
  createColumnAction,
  createActionColumnAction,
  createFromDataAction,
  createActionColumnButtonAction
}: QuickbarProps) => {
  const { t } = useTranslation();
  const { allComponentsByCategory } = useComponents();
  const [menu, setMenu] = useState(false);
  const readonly = useReadonly();
  if (readonly) {
    return null;
  }
  return (
    <PopoverContent className='quickbar' sideOffset={8} onOpenAutoFocus={e => e.preventDefault()} hideWhenDetached={true}>
      <Popover open={menu} onOpenChange={change => setMenu(change)}>
        <PopoverAnchor asChild>
          <Flex gap={1}>
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
                    setMenu(old => !old);
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
            {/* <Button icon={IvyIcons.ChangeType} title='Change Type' /> */}
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
                  setMenu(old => !old);
                }}
              />
            )}
          </Flex>
        </PopoverAnchor>
        <PopoverContent className='quickbar-menu' sideOffset={8} onClick={e => e.stopPropagation()}>
          <FormPalette sections={allComponentsByCategory()} directCreate={type => createAction?.(type as ComponentType)} />
        </PopoverContent>
      </Popover>
    </PopoverContent>
  );
};
