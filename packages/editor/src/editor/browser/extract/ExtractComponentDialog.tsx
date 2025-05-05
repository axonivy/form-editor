import {
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { Component, ComponentData, Layout, Variable } from '@axonivy/form-editor-protocol';
import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../../../query/query-client';
import { useFunction } from '../../../context/useFunction';
import { useMeta } from '../../../context/useMeta';
import { collectNodesWithChildren, variableTreeData } from '../data-class/variable-tree-data';
import { useExtractFieldValidation } from './useExtractFieldValidation';
import { IvyIcons } from '@axonivy/ui-icons';
import { Browser } from '../Browser';
type ExtractComponentDialogProps = {
  children: ReactNode;
  data: Component | ComponentData;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
};

export const ExtractComponentDialog = ({ children, data, openDialog, setOpenDialog }: ExtractComponentDialogProps) => {
  const { t } = useTranslation();
  const layoutId = (data.config as Layout)?.id?.length > 0 ? (data.config as Layout).id : data.cid;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{t('dialog.extractComponent', { component: layoutId })}</DialogTitle>
        </DialogHeader>
        <ExtractComponentDialogContent data={data} layoutId={layoutId} />
      </DialogContent>
    </Dialog>
  );
};

const ExtractComponentDialogContent = ({ data, layoutId }: { data: Component | ComponentData; layoutId: string }) => {
  const { context, namespace } = useAppContext();
  const { t } = useTranslation();
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
    <>
      <Flex direction='column' gap={2}>
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
      </Flex>

      <DialogFooter>
        <Flex direction='column' gap={2}>
          <Button
            variant='primary'
            size='large'
            aria-label={t('dialog.extractComponent', { component: data.cid })}
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
        </Flex>
      </DialogFooter>
    </>
  );
};
