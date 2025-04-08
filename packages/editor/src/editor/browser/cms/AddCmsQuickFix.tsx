import { useState } from 'react';
import { useMeta } from '../../../context/useMeta';
import { Button, Flex, Popover, PopoverArrow, PopoverContent, PopoverTrigger, toast } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useFunction } from '../../../context/useFunction';
import { useQueryClient } from '@tanstack/react-query';
import { genQueryKey } from '../../../query/query-client';
import type { InputTextAreaRef, Selection } from './useTextSelection';
import { useTranslation } from 'react-i18next';

type AddCmsQuickFixPopoverProps = {
  value: string;
  onChange: (value: string) => void;
  selection?: Selection;
  inputRef: InputTextAreaRef;
};

export const AddCmsQuickFixPopover = ({ value, onChange, selection, inputRef }: AddCmsQuickFixPopoverProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { context } = useAppContext();
  const queryClient = useQueryClient();
  const cmsQuickFixes = useMeta('meta/cms/cmsQuickActions', { context, text: value }, []).data;
  const executeCmsQuickFix = useFunction(
    'meta/cms/executeCmsQuickAction',
    {
      context,
      cmsQuickAction: { category: 'global', coContent: '', coName: '', parentUri: '' }
    },
    {
      onSuccess: data => {
        toast.info('Content Object was successfully created ' + data);
        queryClient.invalidateQueries({ queryKey: genQueryKey('meta/cms/cmsTree', { context, requiredProjects: false }) });
        queryClient.invalidateQueries({
          queryKey: genQueryKey('meta/cms/cmsQuickActions', { context, text: value })
        });
        if (inputRef.current && selection && selection.start !== selection.end) {
          const currentValue = inputRef.current.value;
          const newValue = currentValue.slice(0, selection.start) + data + currentValue.slice(selection.end);
          inputRef.current.setSelectionRange(selection.start + data.length, selection.start + data.length);
          onChange(newValue);
          setOpen(false);
        }
      },
      onError: error => {
        toast.error('Failed to create Content Object', { description: error.message });
      }
    }
  );

  const restoreSelection = (e: Event) => {
    e.preventDefault();
    if (inputRef.current && selection) {
      inputRef.current.setSelectionRange(selection.start, selection.end);
      inputRef.current.focus();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button icon={IvyIcons.Cms} aria-label={t('label.cmsQuickfix')} title={t('label.cmsQuickfix')} />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={12}
        collisionPadding={5}
        onOpenAutoFocus={restoreSelection}
        onCloseAutoFocus={e => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        onFocusOutside={e => e.preventDefault()}
      >
        <Flex direction='column' gap={2} alignItems='center'>
          {value.length > 0 &&
            cmsQuickFixes?.map((fix, index) => (
              <Button
                key={index}
                icon={IvyIcons.Cms}
                aria-label={t('label.cmsQuickfixCat', { cat: fix.category })}
                title={t('label.createContentObj', {
                  parentUri: fix.parentUri,
                  name: fix.coName,
                  value: fix.coContent,
                  category: fix.category
                })}
                onClick={() => {
                  executeCmsQuickFix.mutate({
                    context,
                    cmsQuickAction: fix
                  });
                }}
                style={{ width: '100%', justifyContent: 'start' }}
              >
                {t('label.createCmsObj', { category: fix.category, name: fix.coName })}
              </Button>
            ))}
        </Flex>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};
