import { DEFAULT_QUICK_ACTIONS, type ComponentConfig, type UiComponentProps } from '../../../types/config';
import { isTable, type Dialog, type Prettify } from '@axonivy/form-editor-protocol';
import { useBase } from '../base';
import IconSvg from './Dialog.svg?react';
import { ComponentBlock } from '../../../editor/canvas/ComponentBlock';
import { EmptyLayoutBlock } from '../../../editor/canvas/EmptyBlock';
import { UiBadge } from '../../UiBlockHeader';
import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { findComponentDeep } from '../../../data/data';
import { DataClassDialog } from '../../../editor/browser/data-class/DataClassDialog';
import { stripELExpression } from '../../../utils/string';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type DialogProps = Prettify<Dialog>;

export const useDialogComponent = () => {
  const { baseComponentFields } = useBase();
  const { t } = useTranslation();

  const DialogComponent: ComponentConfig<DialogProps> = useMemo(() => {
    const DialogComponent: ComponentConfig<DialogProps> = {
      name: 'Dialog',
      displayName: t('components.dialog.name'),
      category: 'Hidden',
      subcategory: 'General',
      icon: <IconSvg />,
      description: t('components.dialog.description'),
      render: props => <DialogUiBlock {...props} />,
      outlineInfo: component => component.header,
      fields: {
        ...baseComponentFields,
        components: { subsection: 'General', type: 'hidden' },
        header: {
          subsection: 'General',
          label: t('property.header'),
          type: 'textBrowser',
          browsers: [{ type: 'CMS', options: { overrideSelection: true } }]
        },
        linkedComponent: { subsection: 'General', label: t('property.linkedComponent'), type: 'hidden' }
      },
      quickActions: DEFAULT_QUICK_ACTIONS
    };

    return DialogComponent;
  }, [baseComponentFields, t]);

  return {
    DialogComponent
  };
};

const DialogUiBlock = ({ id, components, header, linkedComponent }: UiComponentProps<DialogProps>) => {
  const { data } = useAppContext();
  const dataTable = findComponentDeep(data.components, linkedComponent);
  const table = dataTable ? dataTable.data[dataTable.index] : undefined;
  const onlyAttributs = table && isTable(table) ? stripELExpression(table.config.value) : undefined;
  const { t } = useTranslation();

  return (
    <>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <UiBadge value={header} />
        <DataClassDialog
          showWorkflowButtonsCheckbox={false}
          creationTarget={id}
          onlyAttributs={onlyAttributs}
          showRootNode={false}
          prefix='currentRow'
          parentName='row'
        >
          <Button
            icon={IvyIcons.DatabaseLink}
            size='small'
            aria-label={t('label.createFrom', { component: linkedComponent })}
            title={t('label.createFrom', { component: linkedComponent })}
            onClick={e => {
              e.stopPropagation();
            }}
          />
        </DataClassDialog>
      </Flex>
      {components.map((component, index) => {
        return <ComponentBlock key={component.cid} component={component} preId={components[index - 1]?.cid} />;
      })}

      <EmptyLayoutBlock id={id} components={components} type='dialog' />
      <Flex direction='row' justifyContent='flex-end' alignItems='center' gap={1}>
        <div className='block-button' data-variant='secondary' data-style='flat'>
          {t('common.label.cancel')}
        </div>
        <div className='block-button' data-variant='primary'>
          <i className='si si-check-1' />
          {t('common.label.save')}
        </div>
      </Flex>
    </>
  );
};
