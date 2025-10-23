import {
  BasicDialogHeader,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  InputBadgeArea,
  splitNewLine,
  Textarea,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnFocus } from '../../../context/useOnFocus';
import { badgeProps } from '../../../utils/badge-properties';
import { Browser } from '../../browser/Browser';
import { AddCmsQuickFixPopover } from '../../browser/cms/AddCmsQuickFix';
import useTextSelection from '../../browser/cms/useTextSelection';

type TextareaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  message?: MessageData;
};

export const TextareaField = ({ label, value, onChange, message }: TextareaFieldProps) => {
  const [open, setOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isFocusWithin, focusWithinProps } = useOnFocus(value, onChange);
  const { handleTextSelection, showQuickFix, getSelectedText, selection } = useTextSelection(textAreaRef);
  const height = useMemo(() => splitNewLine(value).length * 14, [value]);
  const MINHEIGHT = 60;
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <BasicField label={label} message={message} className='badge-field' {...focusWithinProps} tabIndex={0}>
        {isFocusWithin || showQuickFix() ? (
          <Flex direction='row'>
            <Textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              autoResize={true}
              ref={textAreaRef}
              onSelect={() => handleTextSelection()}
              style={{ minHeight: MINHEIGHT }}
            />
            <Flex
              direction='row'
              style={{
                marginLeft: showQuickFix() && selection ? '-49px' : '-25px',
                marginTop: '8px'
              }}
              gap={1}
            >
              {showQuickFix() && (
                <AddCmsQuickFixPopover
                  value={getSelectedText()}
                  selection={selection}
                  inputRef={textAreaRef}
                  onChange={change => {
                    onChange(change);
                    handleTextSelection();
                  }}
                />
              )}
              <DialogTrigger asChild>
                <Button icon={IvyIcons.ListSearch} aria-label={t('label.browser')} />
              </DialogTrigger>
            </Flex>
          </Flex>
        ) : (
          <InputBadgeArea value={value ?? ''} badgeProps={badgeProps} style={{ height: height, minHeight: MINHEIGHT }} />
        )}
      </BasicField>
      <DialogContent style={{ height: '80vh', gridTemplateRows: 'auto 1fr' }}>
        <BasicDialogHeader title={t('dialog.propertyContentBrowser.title')} description={t('dialog.propertyContentBrowser.description')} />
        <Browser
          activeBrowsers={[
            { type: 'CMS', options: { overrideSelection: true } },
            { type: 'ATTRIBUTE', options: { overrideSelection: true } }
          ]}
          close={() => setOpen(false)}
          value={value}
          onChange={onChange}
          selection={selection}
        />
      </DialogContent>
    </Dialog>
  );
};
