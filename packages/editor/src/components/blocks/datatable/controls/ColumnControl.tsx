import { Button, Flex, type CollapsibleControlProps } from '@axonivy/ui-components';
import { useData } from '../../../../data/data';
import { useDataTableColumns } from '../fields/useDataTableColumns';
import { IvyIcons } from '@axonivy/ui-icons';
import { isTable } from '@axonivy/form-editor-protocol';
import { useTranslation } from 'react-i18next';
import { createInitTableColumns } from '../create-init-columns';

export const ColumnControl = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { boundInactiveColumns } = useDataTableColumns();
  const { t } = useTranslation();

  const bindAllColumns = () => {
    if (isTable(element)) {
      setData(data => {
        const creates = boundInactiveColumns
          .map(column => ({
            label: column.value.length > 0 ? column.value : column.header,
            value: column.value
          }))
          .filter(create => create !== undefined);
        return createInitTableColumns(element.cid, data, creates);
      });
    }
  };

  return (
    <Flex gap={1}>
      <Button icon={IvyIcons.Plus} size={'small'} onClick={bindAllColumns} title={t('label.setDefaultCol')} {...props} />
    </Flex>
  );
};
