import { isColumn } from '@axonivy/form-editor-protocol';
import { Button, type CollapsibleControlProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { COLUMN_DROPZONE_ID_PREFIX, modifyData, useData } from '../../../../data/data';

export const ContentControls = (props: CollapsibleControlProps) => {
  const { element, setData } = useData();
  const { t } = useTranslation();
  const createActionButton = () => {
    setData(
      oldData =>
        modifyData(oldData, {
          type: 'add',
          data: { componentType: 'Button', targetId: COLUMN_DROPZONE_ID_PREFIX + element?.cid }
        }).newData
    );
  };
  if (!isColumn(element) || !element.config.asActionColumn) {
    return null;
  }

  return <Button icon={IvyIcons.Plus} onClick={createActionButton} size='small' title={t('label.addNewActionCol')} {...props} />;
};
