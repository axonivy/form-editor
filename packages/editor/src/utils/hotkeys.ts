import { hotkeyText, isWindows } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const { t } = useTranslation();
  const undo = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+Z';
    return { hotkey, label: t('common.hotkey.undo', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const redo = useMemo<KnownHotkey>(() => {
    const hotkey = isWindows() ? 'mod+Y' : 'mod+shift+Z';
    return { hotkey, label: t('common.hotkey.redo', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const openPreview = useMemo<KnownHotkey>(() => {
    const hotkey = 'X';
    return { hotkey, label: t('hotkey.openPreview', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const openDataClass = useMemo<KnownHotkey>(() => {
    const hotkey = 'C';
    return { hotkey, label: t('hotkey.openDataClass', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const openProcess = useMemo<KnownHotkey>(() => {
    const hotkey = 'P';
    return { hotkey, label: t('hotkey.openProcess', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: t('common.hotkey.help', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const viewMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'V';
    return { hotkey, label: t('hotkey.viewMode', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const deviceMode = useMemo<KnownHotkey>(() => {
    const hotkey = 'D';
    return { hotkey, label: t('hotkey.deviceMode', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const createFromData = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: t('hotkey.createFormData', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: t('common.hotkey.focusToolbar', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: t('common.hotkey.focusMain', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: t('common.hotkey.focusInscription', { hotkey: hotkeyText(hotkey) }) };
  }, [t]);

  return {
    undo,
    redo,
    openPreview,
    openDataClass,
    openProcess,
    openHelp,
    viewMode,
    deviceMode,
    createFromData,
    focusToolbar,
    focusMain,
    focusInscription
  };
};
