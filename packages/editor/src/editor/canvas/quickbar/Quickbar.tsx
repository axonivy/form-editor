import type { ComponentType } from '@axonivy/form-editor-protocol';
import { Flex, Popover, PopoverAnchor, PopoverContent, Separator, useReadonly } from '@axonivy/ui-components';
import { useComponentBlock } from '../../../context/ComponentBlockContext';
import { useComponents } from '../../../context/ComponentsContext';
import { useData } from '../../../data/data';
import { FormPalette } from '../../palette/Palette';

export type PaletteMode = 'create' | 'replace' | undefined;

export const Quickbar = () => {
  const readonly = useReadonly();
  const { componentMenu, setComponentMenu, componentActionButtons, structureActionButtons } = useComponentBlock();
  if (readonly) {
    return null;
  }
  if (componentActionButtons.length === 0 && structureActionButtons.length === 0) {
    return null;
  }
  return (
    <PopoverContent className='quickbar' sideOffset={8} onOpenAutoFocus={e => e.preventDefault()} hideWhenDetached={true}>
      <Popover open={componentMenu} onOpenChange={change => setComponentMenu(change)}>
        <PopoverAnchor asChild>
          <Flex gap={1}>
            {componentActionButtons}
            {componentActionButtons.length > 0 && structureActionButtons.length > 0 && (
              <Separator orientation='vertical' style={{ height: 20, margin: '0 var(--size-1)' }} />
            )}
            {structureActionButtons}
          </Flex>
        </PopoverAnchor>
        <PopoverContent className='quickbar-menu' sideOffset={8} onClick={e => e.stopPropagation()}>
          <PaletteContent />
        </PopoverContent>
      </Popover>
    </PopoverContent>
  );
};

const PaletteContent = () => {
  const { allComponentsByCategory, componentsByElement } = useComponents();
  const { actions, paletteMode } = useComponentBlock();

  const { element } = useData();
  const sections =
    paletteMode === 'replace' && element
      ? componentsByElement(element, [element.type, 'DataTableColumn', 'Dialog', 'Composite'])
      : allComponentsByCategory();

  return (
    <FormPalette
      sections={sections}
      directCreate={type => {
        if (paletteMode === 'replace') {
          actions.changeElementType?.(type as ComponentType);
        } else {
          actions.createElement?.(type as ComponentType);
        }
      }}
    />
  );
};
