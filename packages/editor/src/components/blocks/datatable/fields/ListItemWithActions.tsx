import { Button, Flex, IvyIcon, Label } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { modifyData, useData } from '../../../../data/data';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../../../../context/ComponentsContext';
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
  const { componentByName } = useComponents();
  const { setData, setSelectedElement } = useData();
  return (
    <Flex direction='row' justifyContent='space-between' alignItems='center' gap={1} className='list-item-with-actions'>
      <Flex direction='row' gap={1} alignItems='center'>
        {icon && icon.length > 0 && <i className={icon} />}
        <Label title={isBound ? t('components.dataTable.property.colBoundByAttr') : ''}>{label}</Label>
      </Flex>

      <Flex direction='row' alignItems='center' gap={1}>
        {width !== undefined && (
          <Flex direction='row' gap={1} alignItems='center' justifyContent='center' className='list-item-width-badge'>
            <IvyIcon icon={IvyIcons.Straighten} />
            {width.length > 0 ? width : t('components.dataTableColumn.property.widthAuto')}
          </Flex>
        )}
        <Button
          onClick={() => setData(oldData => modifyData(oldData, { type: 'remove', data: { id: componentCid } }, componentByName).newData)}
          icon={IvyIcons.Trash}
          variant='outline'
        />
        <Button onClick={() => setSelectedElement(componentCid)} icon={IvyIcons.Edit} variant='outline' />
      </Flex>
    </Flex>
  );
};
