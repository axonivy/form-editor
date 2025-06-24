import type { Variable } from '@axonivy/form-editor-protocol';
import {
  BasicCheckbox,
  BasicDialog,
  Button,
  DialogTrigger,
  ExpandableCell,
  Flex,
  MessageRow,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  useHotkeys,
  useTableExpand,
  useTableSelect,
  type BrowserNode
} from '@axonivy/ui-components';
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useComponents } from '../../../context/ComponentsContext';
import { useMeta } from '../../../context/useMeta';
import { createInitForm, creationTargetId } from '../../../data/data';
import { useKnownHotkeys } from '../../../utils/hotkeys';
import { findAttributesOfType, rowToCreateData, variableTreeData } from './variable-tree-data';

type DataClassDialogProps = {
  showWorkflowButtonsCheckbox?: boolean;
  workflowButtonsInit?: boolean;
  creationTarget?: string;
  onlyAttributs?: string;
  parentName?: string;
  showRootNode?: boolean;
  prefix?: string;
};

type DataClassSelectProps = DataClassDialogProps & {
  onFormCreate: (createFunc: () => void, isCreateDisabled: boolean) => void;
};

export const DataClassDialog = ({ children, ...props }: DataClassDialogProps & { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { createFromData: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => setOpen(true), { scopes: ['global'] });
  const { t } = useTranslation();

  const [currentCreateForm, setCurrentCreateForm] = useState<(() => void) | null>(null);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(true);

  const handleFormCreate = useCallback((createFunc: () => void, isDisabled: boolean) => {
    setCurrentCreateForm(() => createFunc);
    setIsCreateButtonDisabled(isDisabled);
  }, []);

  return (
    <BasicDialog
      open={open}
      onOpenChange={setOpen}
      contentProps={{
        title: t('label.createFromData'),
        description: t('label.selectAttributes'),
        buttonCustom: (
          <Button variant='primary' onClick={currentCreateForm || undefined} disabled={isCreateButtonDisabled}>
            {t('common.label.create')}
          </Button>
        ),
        buttonClose: t('common.label.cancel')
      }}
      dialogTrigger={<DialogTrigger asChild>{children}</DialogTrigger>}
    >
      <div onClick={e => e.stopPropagation()}>
        <DataClassSelect {...props} onFormCreate={handleFormCreate} />
      </div>
    </BasicDialog>
  );
};

const DataClassSelect = ({
  showWorkflowButtonsCheckbox = true,
  workflowButtonsInit = true,
  creationTarget,
  parentName,
  onlyAttributs,
  showRootNode,
  prefix,
  onFormCreate
}: DataClassSelectProps) => {
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

  const createForm = useCallback(() => {
    setData(data => {
      const creates = table
        .getSelectedRowModel()
        .flatRows.map(r => rowToCreateData(r, componentForType, showRootNode, prefix))
        .filter(create => create !== undefined);
      return createInitForm(data, creates, workflowButtons, componentByName, creationTargetId(data.components, creationTarget));
    });
  }, [table, componentForType, showRootNode, prefix, setData, workflowButtons, componentByName, creationTarget]);

  useEffect(() => {
    onFormCreate(createForm, tree.length === 0);
  }, [onFormCreate, createForm, tree.length]);

  return (
    <>
      <Flex direction='column' gap={4}>
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
      </Flex>
    </>
  );
};
