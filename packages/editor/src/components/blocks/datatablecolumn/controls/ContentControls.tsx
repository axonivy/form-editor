import { Button, type CollapsibleControlProps } from '@axonivy/ui-components';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, useData } from '../../../../data/data';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../../../../context/ComponentsContext';

export const ContentControls = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { t } = useTranslation();
  const { componentByName } = useComponents();
  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentName: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + element?.cid, componentByName }
        }).newData
    );
  };

  return (
    element?.type === 'DataTableColumn' &&
    element.config.asActionColumn && (
      <Button icon={IvyIcons.Plus} onClick={createActionButton} size='small' title={t('label.addNewActionCol')} {...props} />
    )
  );
};
