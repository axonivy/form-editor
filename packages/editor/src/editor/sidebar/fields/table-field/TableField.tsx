import {
  arraymove,
  BasicField,
  Button,
  deepEqual,
  MessageRow,
  ReorderRow,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableResizableHeader,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useValidation } from '../../../../context/useValidation';

export type TableFieldProps<TData extends object> = {
  label: string;
  data: TData[];
  onChange: (change: TData[]) => void;
  columns: ColumnDef<TData, string>[];
  emptyDataObject: TData;
  validationPath: string;
};

export const TableField = <TData extends object>({
  label,
  data,
  onChange,
  columns,
  emptyDataObject,
  validationPath
}: TableFieldProps<TData>) => {
  const [tableData, setTableData] = useState(data);
  const changeData = useCallback(
    (change: TData[]) => {
      setTableData(change);
      //enable one empty option
      let hasEmptyDataObject = false;
      const filteredData = change.filter(obj => {
        if (deepEqual(obj, emptyDataObject)) {
          if (!hasEmptyDataObject) {
            hasEmptyDataObject = true;
            return true;
          }
          return false;
        }
        return true;
      });

      onChange(filteredData);
    },
    [emptyDataObject, onChange]
  );

  const addRow = () => {
    const newData = [...tableData];
    newData.push(emptyDataObject);
    changeData(newData);
    tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
  };

  const removeRow = () => {
    if (tableSelection.tableState.rowSelection === undefined) {
      return;
    }
    const index = table.getRowModel().rowsById[Object.keys(tableSelection.tableState.rowSelection)[0]].index;
    const newData = [...tableData];
    newData.splice(index, 1);
    if (newData.length === 0) {
      tableSelection.options.onRowSelectionChange({});
    } else if (index === tableData.length - 1) {
      tableSelection.options.onRowSelectionChange({ [`${newData.length - 1}`]: true });
    }
    changeData(newData);
  };

  const showAddButton = () => {
    if (tableData.filter(obj => deepEqual(obj, emptyDataObject)).length <= 1) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const updateDataArray = (fromIndex: number[], toIndex: number, data: TData[]) => {
    arraymove(data, fromIndex[0], toIndex);
    onChange(data);
    setTableData([...data]);
  };
  const updateOrder = (moveId: string, targetId: string) => {
    updateDataArray([Number(moveId)], Number(targetId), tableData);
  };

  const tableSelection = useTableSelect<TData>();
  const table = useReactTable({
    ...tableSelection.options,
    data: tableData,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...tableSelection.tableState
    },
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = parseInt(rowId);
        const updatedData = tableData.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [columnId]: value
            };
          }
          return row;
        });
        changeData(updatedData);
      }
    }
  });

  return (
    <BasicField
      label={label}
      control={table.getSelectedRowModel().rows.length > 0 && <Button icon={IvyIcons.Trash} aria-label='Remove row' onClick={removeRow} />}
      className='table-field'
    >
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <ValidationRow key={row.id} row={row} validationPath={validationPath} updateOrder={updateOrder} />
          ))}
        </TableBody>
      </Table>
      {showAddButton()}
    </BasicField>
  );
};

const ValidationRow = <TData,>({
  row,
  validationPath,
  updateOrder
}: {
  row: Row<TData>;
  validationPath: string;
  updateOrder: (moveId: string, targetId: string) => void;
}) => {
  const message = useValidation(`${validationPath}.[${row.index}]`);
  const cells = row.getVisibleCells();

  return (
    <>
      <ReorderRow key={row.id} row={row} id={row.id} updateOrder={updateOrder}>
        {cells.map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </ReorderRow>
      <MessageRow message={message} columnCount={cells.length} />
    </>
  );
};
