import type { ComponentData } from '@axonivy/form-editor-protocol';
import { Button } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComponentConfig } from '../../../types/config';
import { DataClassDialog } from '../../browser/data-class/DataClassDialog';
import { ExtractComponentDialog } from '../../browser/extract/ExtractComponentDialog';
import { useComponentBlockActions } from '../useComponentBlockActions';
import type { PaletteMode } from './Quickbar';

export type QuickAction =
  | 'DELETE'
  | 'DUPLICATE'
  | 'OPENCOMPONENT'
  | 'EXTRACTINTOCOMPONENT'
  | 'CHANGETYPE'
  | 'CREATE'
  | 'CREATEFROMDATA'
  | 'CREATECOLUMN'
  | 'CREATEACTIONCOLUMN'
  | 'CREATEACTIONCOLUMNBUTTON';

export type QuickActionDefinition = {
  group: 'component' | 'structural';
  render: (ctx: QuickActionContext) => ReactNode;
  id: (ctx: ComponentData) => string;
  shortcut?: string;
};

export type QuickActionContext = {
  data: ComponentData;
  config: ComponentConfig;
  actions: ReturnType<typeof useComponentBlockActions>;
  componentMenu: boolean;
  paletteMode: PaletteMode;
  key?: string;
};

export const useQuickActions = () => {
  const { t } = useTranslation();

  const quickActionRegistry: Record<QuickAction, QuickActionDefinition> = useMemo(() => {
    return {
      DELETE: {
        group: 'component',
        id: ctx => `DELETE-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`DELETE-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.Trash}
            title={t('common.label.delete')}
            aria-label={t('common.label.delete')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.deleteElement();
            }}
          />
        ),
        shortcut: 'Delete'
      },
      DUPLICATE: {
        group: 'component',
        id: ctx => `DUPLICATE-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`DUPLICATE-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.Duplicate}
            title={t('label.duplicate')}
            aria-label={t('label.duplicate')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.duplicateElement();
            }}
          />
        ),
        shortcut: 'KeyM'
      },
      OPENCOMPONENT: {
        group: 'component',
        id: ctx => `OPENCOMPONENT-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`OPENCOMPONENT-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.SubEnd}
            title={t('label.openComponent')}
            aria-label={t('label.openComponent')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.openComponent(ctx.config.name);
            }}
          />
        ),
        shortcut: 'KeyJ'
      },
      EXTRACTINTOCOMPONENT: {
        group: 'component',
        id: ctx => `EXTRACTINTOCOMPONENT-ACTION-${ctx.cid}`,
        render: ctx => (
          <ExtractComponentDialog
            key={ctx.key}
            data={ctx.actions.extractComponent.data}
            openDialog={ctx.actions.extractComponent.openDialog}
            setOpenDialog={ctx.actions.extractComponent.setOpenDialog}
          >
            <Button
              id={`EXTRACTINTOCOMPONENT-ACTION-${ctx.data.cid}`}
              icon={IvyIcons.WrapToSubprocess}
              aria-label={t('label.extractComponent')}
              title={t('label.extractComponent')}
              onClick={e => {
                e.stopPropagation();
              }}
            />
          </ExtractComponentDialog>
        ),
        shortcut: 'KeyE'
      },
      CHANGETYPE: {
        group: 'component',
        id: ctx => `CHANGETYPE-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`CHANGETYPE-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.Replace}
            title={t('label.changeComponentType')}
            aria-label={t('label.changeComponentType')}
            variant={ctx.componentMenu && ctx.paletteMode === 'replace' ? 'primary-outline' : undefined}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.toggleComponentMenu('replace');
            }}
          />
        ),
        shortcut: 'KeyT'
      },

      CREATEFROMDATA: {
        id: ctx => `CREATEFROMDATA-ACTION-${ctx.cid}`,
        group: 'structural',
        render: ctx => (
          <DataClassDialog key={ctx.key} workflowButtonsInit={false} creationTarget={ctx.data.cid}>
            <Button
              id={`CREATEFROMDATA-ACTION-${ctx.data.cid}`}
              icon={IvyIcons.DatabaseLink}
              size='small'
              aria-label={t('label.createFromData')}
              title={t('label.createFromData')}
              onClick={e => {
                e.stopPropagation();
              }}
            />
          </DataClassDialog>
        ),
        shortcut: 'KeyA'
      },
      CREATECOLUMN: {
        id: ctx => `CREATECOLUMN-ACTION-${ctx.cid}`,
        group: 'structural',
        render: ctx => (
          <Button
            key={ctx.key}
            id={`CREATECOLUMN-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.PoolSwimlanes}
            title={t('label.createCol')}
            aria-label={t('label.createCol')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.createColumn();
            }}
          />
        )
      },
      CREATEACTIONCOLUMN: {
        group: 'structural',
        id: ctx => `CREATEACTIONCOLUMN-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`CREATEACTIONCOLUMN-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.MultiSelection}
            title={t('label.createActionCol')}
            aria-label={t('label.createActionCol')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.createActionColumn();
            }}
          />
        )
      },
      CREATEACTIONCOLUMNBUTTON: {
        group: 'structural',
        id: ctx => `CREATEACTIONCOLUMNBUTTON-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`CREATEACTIONCOLUMNBUTTON-ACTION-${ctx.data.cid}`}
            icon={IvyIcons.MultiSelection}
            title={t('label.createActionColBtn')}
            aria-label={t('label.createActionColBtn')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.createActionButton();
            }}
          />
        )
      },
      CREATE: {
        group: 'structural',
        id: ctx => `CREATE-ACTION-${ctx.cid}`,
        render: ctx => (
          <Button
            key={ctx.key}
            id={`CREATE-ACTION-${ctx.data.cid}`}
            variant={ctx.componentMenu && ctx.paletteMode === 'create' ? 'primary-outline' : undefined}
            icon={IvyIcons.Task}
            title={t('label.allComponentsInsert')}
            aria-label={t('label.allComponentsInsert')}
            onClick={e => {
              e.stopPropagation();
              ctx.actions.toggleComponentMenu('create');
            }}
          />
        ),
        shortcut: 'KeyN'
      }
    };
  }, [t]);

  return { quickActionRegistry };
};
