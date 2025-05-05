import { type ColumnDef } from '@tanstack/react-table';
import type { SelectItem } from '@axonivy/form-editor-protocol';
import { InputCellWithBrowser } from './InputCellWithBrowser';
import { TableField, type TableFieldProps } from './TableField';
import { useTranslation } from 'react-i18next';
import { ReorderHandleWrapper } from '@axonivy/ui-components';

type SelectTableFieldProps = Omit<TableFieldProps<SelectItem>, 'columns' | 'emptyDataObject'>;

export const SelectTableField = (props: SelectTableFieldProps) => {
  const { t } = useTranslation();
  const selectTableColumns: ColumnDef<SelectItem, string>[] = [
    {
      accessorKey: 'label',
      header: () => <span>{t('property.label')}</span>,
      cell: cell => <InputCellWithBrowser cell={cell} />,
      minSize: 50
    },
    {
      accessorKey: 'value',
      header: () => <span>{t('property.value')}</span>,
      cell: cell => (
        <ReorderHandleWrapper>
          <InputCellWithBrowser cell={cell} />
        </ReorderHandleWrapper>
      )
    }
  ];
  return <TableField {...props} columns={selectTableColumns} emptyDataObject={{ label: '', value: '' }} />;
};
