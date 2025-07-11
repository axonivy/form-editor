import type { Component, ComponentData, ComponentType, ConfigData } from '@axonivy/form-editor-protocol';
import { useReadonly } from '@axonivy/ui-components';
import { useClipboard, type TextDropItem } from 'react-aria';
import { CANVAS_DROPZONE_ID, modifyData, useData } from '../../data/data';

export const useCopyPaste = (data?: Component | ComponentData) => {
  const { setData } = useData();
  const readonly = useReadonly();
  const { clipboardProps } = useClipboard({
    getItems: data ? () => [{ 'text/plain': JSON.stringify(data, undefined, 2) }] : undefined,
    onCut: () => {
      if (data === undefined) {
        return;
      }
      setData(old => modifyData(old, { type: 'remove', data: { id: data.cid } }).newData);
    },
    onPaste: async items => {
      if (readonly) {
        return;
      }
      const item = items.filter(item => item.kind === 'text' && item.types.has('text/plain'))[0] as TextDropItem;
      const component = toComponent(await item.getText('text/plain'));
      if (!component) {
        return;
      }
      setData(
        old =>
          modifyData(old, {
            type: 'paste',
            data: { componentType: component.type, clipboard: component.config, targetId: data?.cid ?? CANVAS_DROPZONE_ID }
          }).newData
      );
    }
  });
  return clipboardProps;
};

const toComponent = (data: string) => {
  try {
    const component = JSON.parse(data);
    if (isComponent(component)) {
      return component;
    }
  } catch {
    // ignore
  }
  return undefined;
};

const isComponent = (data: unknown): data is { type: ComponentType; config: ConfigData } => {
  return typeof data === 'object' && data !== null && 'type' in data && 'config' in data;
};
