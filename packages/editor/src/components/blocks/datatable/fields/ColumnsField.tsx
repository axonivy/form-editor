import { type DataTableColumn } from '@axonivy/form-editor-protocol';
import { Flex, Message } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { ListItemWithActions } from './ListItemWithActions';
import { useDataTableColumns } from './useDataTableColumns';

export type ColumnItem = DataTableColumn & { columnCid: string };

export const ColumnsField = () => {
  const { boundColumns, activeColumns } = useDataTableColumns();
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={1}>
      {boundColumns.length === 0 && <Message variant='warning' message={t('label.objNotValid')} />}
      {activeColumns.map(column => (
        <ListItemWithActions
          key={column.columnCid}
          componentCid={column.columnCid}
          label={column.header}
          width={column.width}
          isBound={boundColumns.some(active => active.value === column.value)}
        />
      ))}
    </Flex>
  );
};
