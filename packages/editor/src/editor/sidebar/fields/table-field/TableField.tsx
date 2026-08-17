import {
  arraymove,
  BasicField,
  Button,
  dataTableFeatures,
  deepEqual,
  MessageRow,
  ReorderRow,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableResizableHeader,
  type DataTableFeatures
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable, type ColumnDef, type Row, type RowData } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { useValidation } from '../../../../context/useValidation';

export type TableFieldProps<TData extends RowData> = {
  label: string;
  data: TData[];
  onChange: (change: TData[]) => void;
  columns: ReadonlyArray<ColumnDef<DataTableFeatures, TData, unknown>>;
  emptyDataObject: TData;
  validationPath: string;
};

export const TableField = <TData extends RowData>({
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
    table.setRowSelection({ [`${newData.length - 1}`]: true });
  };

  const removeRow = () => {
    const selectedRowIndex = table.getSelectedRowModel().rows.at(0)?.index;
    if (selectedRowIndex === undefined) {
      return;
    }
    const newData = [...tableData];
    newData.splice(selectedRowIndex, 1);
    if (newData.length === 0) {
      table.setRowSelection({});
    } else if (selectedRowIndex === tableData.length - 1) {
      table.setRowSelection({ [`${newData.length - 1}`]: true });
    }
    changeData(newData);
  };

  const showAddButton = () => {
    if (tableData.filter(obj => deepEqual(obj, emptyDataObject)).length <= 1) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const updateDataArray = (fromIndex: number, toIndex: number, data: TData[]) => {
    arraymove(data, fromIndex, toIndex);
    onChange(data);
    setTableData([...data]);
  };

  const updateOrder = (moveId: string, targetId: string) => {
    updateDataArray(Number(moveId), Number(targetId), tableData);
  };

  const table = useTable({
    features: dataTableFeatures,
    data: tableData,
    columns,
    columnResizeMode: 'onChange',
    meta: {
      updateData: (rowId: string, columnId: string, value: unknown) => {
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

const ValidationRow = <TData extends RowData>({
  row,
  validationPath,
  updateOrder
}: {
  row: Row<DataTableFeatures, TData>;
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
