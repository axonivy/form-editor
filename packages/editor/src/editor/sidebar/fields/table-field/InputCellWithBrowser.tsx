import { useEditCell, type DataTableFeatures, type InputProps } from '@axonivy/ui-components';
import { type CellContext, type RowData } from '@tanstack/react-table';
import { InputFieldWithBrowser } from '../InputFieldWithBrowser';
import './TableField.css';

type InputCellProps<TData extends RowData> = InputProps & { cell: CellContext<DataTableFeatures, TData, string> };

export const InputCellWithBrowser = <TData extends RowData>({ cell }: InputCellProps<TData>) => {
  const { value, setValue, onBlur, updateValue } = useEditCell(cell);

  return (
    <InputFieldWithBrowser
      label=''
      onChange={setValue}
      value={value}
      onBlur={onBlur}
      onBrowserClose={updateValue}
      browsers={[
        { type: 'ATTRIBUTE', options: { overrideSelection: true } },
        { type: 'CMS', options: { overrideSelection: true } }
      ]}
    />
  );
};
