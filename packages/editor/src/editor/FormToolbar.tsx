import {
  Button,
  Field,
  Flex,
  hotkeyRedoFix,
  hotkeyText,
  hotkeyUndoFix,
  IvyIcon,
  Label,
  PaletteButton,
  PaletteButtonLabel,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  Switch,
  Toolbar,
  ToolbarContainer,
  useHotkeys,
  useReadonly,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useRef, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { useComponents } from '../context/ComponentsContext';
import { useAction } from '../context/useAction';
import { useData } from '../data/data';
import { useKnownHotkeys } from '../utils/hotkeys';
import { DataClassDialog } from './browser/data-class/DataClassDialog';
import { CompositePalette } from './palette/composite/CompositePalette';
import { FormPalette } from './palette/Palette';
import { PaletteCategoryPopover, PalettePopover } from './palette/PalettePopover';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const FormToolbar = ({ ref }: ComponentProps<'div'>) => {
  const { t } = useTranslation();
  const { allComponentsByCategory } = useComponents();
  const { ui, setUi, history, helpUrl, previewUrl } = useAppContext();
  const { data, setUnhistoricisedData } = useData();
  const { theme, setTheme, disabled } = useTheme();
  const editable = !useReadonly();
  const openDataClass = useAction('openDataClass');
  const openProcess = useAction('openProcess');
  const openUrl = useAction('openUrl');
  const undo = () => history.undo(setUnhistoricisedData);
  const redo = () => history.redo(setUnhistoricisedData);
  const changeViewMode = () => setUi(old => ({ ...old, helpPaddings: !old.helpPaddings }));
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });

  useHotkeys(hotkeys.openPreview.hotkey, () => openUrl(previewUrl), { scopes: ['global'] });
  useHotkeys(hotkeys.openDataClass.hotkey, () => openDataClass(), { scopes: ['global'] });
  useHotkeys(hotkeys.openProcess.hotkey, () => openProcess(), { scopes: ['global'] });
  useHotkeys(hotkeys.openHelp.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  useHotkeys(hotkeys.viewMode.hotkey, changeViewMode, { scopes: ['global'], enabled: editable });

  const deviceModeProps = useMemo(() => {
    const changeDeviceMode = (value: DeviceMode) => setUi(old => ({ ...old, deviceMode: value }));
    const title = t('label.deviceModeParam', { mode: ui.deviceMode, hotkey: hotkeyText(hotkeys.deviceMode.hotkey) });
    const icon =
      ui.deviceMode === 'mobile' ? IvyIcons.DeviceMobile : ui.deviceMode === 'tablet' ? IvyIcons.DeviceTablet : IvyIcons.EventStart;
    const nextDevice = ui.deviceMode === 'mobile' ? 'desktop' : ui.deviceMode === 'desktop' ? 'tablet' : 'mobile';
    return { icon, title, 'aria-label': title, size: 'large', onClick: () => changeDeviceMode(nextDevice) } as const;
  }, [hotkeys.deviceMode.hotkey, setUi, ui.deviceMode, t]);
  useHotkeys(hotkeys.deviceMode.hotkey, deviceModeProps.onClick, { scopes: ['global'] });

  const firstElement = useRef<HTMLButtonElement>(null);
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(hotkeys.focusMain.hotkey, () => document.querySelector<HTMLElement>('.draggable')?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setUi(old => ({ ...old, properties: true }));
      document.querySelector<HTMLElement>('.ui-inscription-tabs-trigger')?.focus();
    },
    {
      scopes: ['global']
    }
  );

  return (
    <Toolbar ref={ref} className='toolbar'>
      <Flex gap={1}>
        <Button ref={firstElement} {...deviceModeProps} />
        {editable && (
          <>
            <Button
              icon={ui.helpPaddings ? IvyIcons.Edit : IvyIcons.Eye}
              onClick={changeViewMode}
              size='large'
              aria-label={hotkeys.viewMode.label}
              title={hotkeys.viewMode.label}
            />
            <ToolbarContainer maxWidth={450}>
              <Flex>
                <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
                <Flex gap={1}>
                  <Button
                    title={hotkeys.undo.label}
                    aria-label={hotkeys.undo.label}
                    icon={IvyIcons.Undo}
                    size='large'
                    onClick={undo}
                    disabled={!history.canUndo}
                  />
                  <Button
                    title={hotkeys.redo.label}
                    aria-label={hotkeys.redo.label}
                    icon={IvyIcons.Redo}
                    size='large'
                    onClick={redo}
                    disabled={!history.canRedo}
                  />
                </Flex>
              </Flex>
            </ToolbarContainer>
          </>
        )}
      </Flex>
      {editable && (
        <Flex gap={3} className='palette-section'>
          <PalettePopover label={t('label.allComponents')} icon={IvyIcons.Task}>
            <FormPalette sections={allComponentsByCategory()} />
          </PalettePopover>
          <ToolbarContainer maxWidth={650}>
            <Flex gap={3}>
              <PaletteCategoryPopover category={'Structures'} icon={IvyIcons.LaneSwimlanes} />
              <PaletteCategoryPopover category={'Elements'} icon={IvyIcons.ChangeType} />
              <PaletteCategoryPopover category={'Actions'} icon={IvyIcons.MultiSelection} />
            </Flex>
          </ToolbarContainer>
          <PalettePopover label={t('label.composites')} icon={IvyIcons.File}>
            <CompositePalette />
          </PalettePopover>
          <PaletteButtonLabel label={t('label.data')}>
            <DataClassDialog workflowButtonsInit={false}>
              <PaletteButton icon={IvyIcons.DatabaseLink} label={hotkeys.createFromData.label} withoutChevron={true} />
            </DataClassDialog>
          </PaletteButtonLabel>
        </Flex>
      )}

      <Flex gap={1} alignItems='center'>
        <ToolbarContainer maxWidth={450}>
          <Flex gap={1} alignItems='center'>
            {data.config.type === 'FORM' && (
              <Button
                title={hotkeys.openPreview.label}
                aria-label={hotkeys.openPreview.label}
                icon={IvyIcons.Play}
                size='large'
                onClick={() => openUrl(previewUrl)}
              />
            )}
            <Button
              title={hotkeys.openDataClass.label}
              aria-label={hotkeys.openDataClass.label}
              icon={IvyIcons.DatabaseLink}
              size='large'
              onClick={() => openDataClass()}
            />
            <Button
              title={hotkeys.openProcess.label}
              aria-label={hotkeys.openProcess.label}
              icon={IvyIcons.Process}
              size='large'
              onClick={() => openProcess()}
            />
            {!disabled && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button title={t('common.label.options')} aria-label={t('common.label.options')} icon={IvyIcons.Settings} size='large' />
                </PopoverTrigger>
                <PopoverContent sideOffset={12} collisionPadding={5} onClick={e => e.stopPropagation()}>
                  <ReadonlyProvider readonly={false}>
                    <Flex direction='column' gap={2}>
                      <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                        <Label>
                          <Flex alignItems='center' gap={1}>
                            <IvyIcon icon={IvyIcons.DarkMode} />
                            {t('common.label.theme')}
                          </Flex>
                        </Label>
                        <Switch
                          defaultChecked={theme === 'dark'}
                          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                          size='small'
                        />
                      </Field>
                    </Flex>
                    <PopoverArrow />
                  </ReadonlyProvider>
                </PopoverContent>
              </Popover>
            )}
          </Flex>
        </ToolbarContainer>
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          title={t('label.togglePropView')}
          aria-label={t('label.togglePropView')}
          size='large'
          onClick={() => setUi(old => ({ ...old, properties: !old.properties }))}
        />
      </Flex>
    </Toolbar>
  );
};
