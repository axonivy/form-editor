import type { Component, ComponentData, Layout, Variable } from '@axonivy/form-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  Input,
  Message,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
  type BrowserNode
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useFunction } from '../../../context/useFunction';
import { useMeta } from '../../../context/useMeta';
import { genQueryKey } from '../../../query/query-client';
import { Browser } from '../Browser';
import { collectNodesWithChildren, variableTreeData } from '../data-class/variable-tree-data';
import { useExtractFieldValidation } from './useExtractFieldValidation';

type ExtractComponentDialogProps = {
  children: ReactNode;
  data: Component | ComponentData;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
};

export const ExtractComponentDialog = ({ children, data, openDialog, setOpenDialog }: ExtractComponentDialogProps) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <ExtractComponentDialogContent data={data} />
      </DialogContent>
    </Dialog>
  );
};

const ExtractComponentDialogContent = ({ data }: { data: Component | ComponentData }) => {
  const { t } = useTranslation();
  const layoutId = (data.config as Layout)?.id?.length > 0 ? (data.config as Layout).id : data.cid;
  const { context, namespace } = useAppContext();
  const queryClient = useQueryClient();
  const { validateComponentName, validateComponentNamespace } = useExtractFieldValidation();
  const variableInfo = useMeta('meta/data/attributes', context, { types: {}, variables: [] }).data;
  const [name, setName] = useState(layoutId);
  const [nameSpace, setNameSpace] = useState(namespace);
  const [field, setField] = useState('data');
  const [open, setOpen] = useState(false);
  const dataClassItems = useMemo(() => {
    const fullTree: BrowserNode<Variable>[] = variableTreeData().of(variableInfo);
    return fullTree.length === 1 && fullTree[0].children.length === 0 ? [fullTree[0]] : collectNodesWithChildren(fullTree);
  }, [variableInfo]);
  const nameValidation = useMemo(() => validateComponentName(name), [name, validateComponentName]);
  const namespaceValidation = useMemo(() => validateComponentNamespace(nameSpace), [nameSpace, validateComponentNamespace]);
  const buttonDisabled = useMemo(
    () => nameValidation?.variant === 'error' || namespaceValidation?.variant === 'error',
    [nameValidation, namespaceValidation]
  );

  const extractIntoComponent = useFunction(
    'extractIntoComponent',
    {
      context,
      layoutId: data.cid,
      newComponentName: name,
      nameSpace: nameSpace,
      dataClassField: field
    },
    {
      onSuccess: componentName => {
        toast.info(t('dialog.extractSuccess', { componentName }));
        queryClient.invalidateQueries({ queryKey: genQueryKey('data', context) });
      },
      onError: error => {
        toast.error(t('dialog.extractErrorTitle'), {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (error as any).data?.includes('already exists')
            ? t('dialog.extractExists', {
                componentId: (data.config as Layout).id.length > 0 ? (data.config as Layout).id : data.cid
              })
            : error.message
        });
      }
    }
  );

  return (
    <BasicDialogContent
      title={t('dialog.extractComponent', { component: layoutId })}
      description={t('dialog.extractComponentTitle')}
      submit={
        <Button
          variant='primary'
          size='large'
          aria-label={t('dialog.extractComponent', { component: data.cid })}
          icon={IvyIcons.Check}
          onClick={() =>
            extractIntoComponent.mutate({
              context,
              layoutId: data.cid,
              newComponentName: name,
              nameSpace: nameSpace,
              dataClassField: field
            })
          }
          disabled={buttonDisabled}
        >
          {t('dialog.applyExtract')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
    >
      <BasicField className='extract-dialog-name' label={t('dialog.componentName')} message={nameValidation}>
        <Input value={name} onChange={event => setName(event.target.value)} placeholder={layoutId} />
      </BasicField>
      <BasicField className='extract-dialog-namespace' label={t('dialog.nameSpace')} message={namespaceValidation}>
        <Input value={nameSpace} onChange={event => setNameSpace(event.target.value)} placeholder={namespace} />
      </BasicField>
      <Dialog open={open} onOpenChange={setOpen}>
        <BasicField className='extract-dialog-dataclass' label={t('dialog.dataClass')}>
          <Flex alignItems='center' gap={2}>
            <Select value={field} onValueChange={setField} defaultValue={field}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {dataClassItems.map(item => (
                    <SelectItem key={item.value} value={item.value}>
                      <>
                        {item.value}
                        <span style={{ color: 'var(--N500)' }}> {item.info}</span>
                      </>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.ListSearch} aria-label={t('label.browser')} />
            </DialogTrigger>
          </Flex>
        </BasicField>
        <DialogContent style={{ height: '80vh' }}>
          <Browser
            activeBrowsers={[{ type: 'ATTRIBUTE', options: { withoutEl: true, attribute: { onlyObjects: true } } }]}
            close={() => setOpen(false)}
            value={field}
            onChange={setField}
          />
        </DialogContent>
      </Dialog>
      <Message variant='info' message={t('dialog.logicWarning', { component: layoutId })} />
    </BasicDialogContent>
  );
};
