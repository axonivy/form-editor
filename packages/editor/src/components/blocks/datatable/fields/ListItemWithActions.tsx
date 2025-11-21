import { Badge, Button, Flex, IvyIcon, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { modifyData, useData } from '../../../../data/data';
import './ListItemWithActions.css';

type ListItemWithActionsProps = {
  componentCid: string;
  label: string;
  icon?: string;
  width?: string;
  isBound?: boolean;
};

export const ListItemWithActions = ({ componentCid, label, icon, width, isBound }: ListItemWithActionsProps) => {
  const { t } = useTranslation();
  const { setData, setSelectedElement } = useData();
  return (
    <Flex direction='row' justifyContent='space-between' alignItems='center' gap={1} className='list-item-with-actions'>
      <Flex direction='row' gap={1} alignItems='center' style={{ flex: 1 }}>
        {icon && icon.length > 0 && <i className={icon} />}
        <Label title={isBound ? t('components.dataTable.property.colBoundByAttr') : ''}>{label}</Label>
      </Flex>
      {width !== undefined && (
        <Badge variant='secondary'>
          <IvyIcon icon={IvyIcons.Straighten} />
          {width.length > 0 ? width : t('components.dataTableColumn.property.widthAuto')}
        </Badge>
      )}
      <Flex direction='row' alignItems='center' gap={1}>
        <Button
          onClick={() => setData(oldData => modifyData(oldData, { type: 'remove', data: { id: componentCid } }).newData)}
          icon={IvyIcons.Trash}
          variant='outline'
        />
        <Button onClick={() => setSelectedElement(componentCid)} icon={IvyIcons.Edit} variant='outline' />
      </Flex>
    </Flex>
  );
};
