import {
  BasicCheckbox,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ExpandableCell,
  MessageRow,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  useHotkeyLocalScopes,
  useHotkeys,
  useTableExpand,
  useTableSelect,
  type BrowserNode
} from '@axonivy/ui-components';
import { useMeta } from '../../../context/useMeta';
import { useAppContext } from '../../../context/AppContext';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { Variable } from '@axonivy/form-editor-protocol';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { createInitForm, creationTargetId } from '../../../data/data';
import { useKnownHotkeys } from '../../../utils/hotkeys';
import { useTranslation } from 'react-i18next';
import { findAttributesOfType, variableTreeData, rowToCreateData } from './variable-tree-data';
import { useComponents } from '../../../context/ComponentsContext';

type DataClassDialogProps = {
  showWorkflowButtonsCheckbox?: boolean;
  workflowButtonsInit?: boolean;
  creationTarget?: string;
  onlyAttributs?: string;
  parentName?: string;
  showRootNode?: boolean;
  prefix?: string;
};

export const DataClassDialog = ({ children, ...props }: DataClassDialogProps & { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { createFromData: shortcut } = useKnownHotkeys();
  const { activateLocalScopes, restoreLocalScopes } = useHotkeyLocalScopes(['dataclassDialog']);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (open) {
      activateLocalScopes();
    } else {
      restoreLocalScopes();
    }
  };

  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'] });
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t('label.createFromData')}</DialogTitle>
        </DialogHeader>
        <DataClassSelect {...props} />
      </DialogContent>
    </Dialog>
  );
};

const DataClassSelect = ({
  showWorkflowButtonsCheckbox = true,
  workflowButtonsInit = true,
  creationTarget,
  parentName,
  onlyAttributs,
  showRootNode,
  prefix
}: DataClassDialogProps) => {
  const { context, setData } = useAppContext();
  const { t } = useTranslation();
  const [tree, setTree] = useState<Array<BrowserNode<Variable>>>([]);
  const [workflowButtons, setWorkflowButtons] = useState(showWorkflowButtonsCheckbox ? workflowButtonsInit : false);
  const dataClass = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const { componentForType, componentByName } = useComponents();

  useEffect(() => {
    if (onlyAttributs) {
      setTree(findAttributesOfType(dataClass, onlyAttributs, 10, parentName));
    } else {
      setTree(variableTreeData().of(dataClass));
    }
  }, [dataClass, onlyAttributs, parentName]);
  const loadChildren = useCallback<(row: Row<BrowserNode>) => void>(
    row => setTree(tree => variableTreeData().loadChildrenFor(dataClass, row.original.info, tree)),
    [dataClass, setTree]
  );
  const columns: ColumnDef<BrowserNode, string>[] = [
    {
      accessorKey: 'value',
      cell: cell => (
        <ExpandableCell
          cell={cell}
          icon={cell.row.original.icon}
          lazy={cell.row.original.isLoaded !== undefined ? { isLoaded: cell.row.original.isLoaded, loadChildren } : undefined}
        >
          <span>{cell.getValue()}</span>
          <span style={{ color: 'var(--N500)' }}>{cell.row.original.info}</span>
        </ExpandableCell>
      )
    }
  ];
  const [filter, setFilter] = useState('');
  const expanded = useTableExpand<BrowserNode>({ '0': true });
  const select = useTableSelect<BrowserNode>();
  const table = useReactTable({
    ...expanded.options,
    ...select.options,
    enableMultiRowSelection: true,
    enableSubRowSelection: true,
    data: tree,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filter,
      ...expanded.tableState,
      ...select.tableState
    }
  });
  const createForm = () => {
    setData(data => {
      const creates = table
        .getSelectedRowModel()
        .flatRows.map(r => rowToCreateData(r, componentForType, showRootNode, prefix))
        .filter(create => create !== undefined);
      return createInitForm(data, creates, workflowButtons, componentByName, creationTargetId(data.components, creationTarget));
    });
  };
  return (
    <>
      <Table>
        <TableBody>
          {table.getRowModel().flatRows.length ? (
            table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </SelectRow>
            ))
          ) : (
            <MessageRow message={{ message: t('message.noData'), variant: 'info' }} columnCount={1} />
          )}
        </TableBody>
      </Table>
      {showWorkflowButtonsCheckbox && (
        <BasicCheckbox
          checked={workflowButtons}
          onCheckedChange={change => setWorkflowButtons(Boolean(change))}
          label={t('label.createBtns')}
        />
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='primary' onClick={createForm} disabled={tree.length === 0}>
            {t('common.label.create')}
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant='outline'>{t('common.label.cancel')}</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};
