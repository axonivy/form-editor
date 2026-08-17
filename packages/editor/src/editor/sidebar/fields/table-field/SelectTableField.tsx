import type { SelectItem } from '@axonivy/form-editor-protocol';
import { dataTableHelper, ReorderHandleWrapper } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { InputCellWithBrowser } from './InputCellWithBrowser';
import { TableField, type TableFieldProps } from './TableField';

type SelectTableFieldProps = Omit<TableFieldProps<SelectItem>, 'columns' | 'emptyDataObject'>;

const { columnHelper } = dataTableHelper<SelectItem>();

export const SelectTableField = (props: SelectTableFieldProps) => {
  const { t } = useTranslation();
  const selectTableColumns = columnHelper.columns([
    columnHelper.accessor('label', {
      header: () => <span>{t('property.label')}</span>,
      cell: cell => <InputCellWithBrowser cell={cell} />,
      minSize: 50
    }),
    columnHelper.accessor('value', {
      header: () => <span>{t('property.value')}</span>,
      cell: cell => (
        <ReorderHandleWrapper>
          <InputCellWithBrowser cell={cell} />
        </ReorderHandleWrapper>
      )
    })
  ]);
  return <TableField {...props} columns={selectTableColumns} emptyDataObject={{ label: '', value: '' }} />;
};
