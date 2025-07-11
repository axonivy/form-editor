import { PaletteButton, PaletteButtonLabel, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useDndContext } from '@dnd-kit/core';
import { useEffect, useState, type ReactNode } from 'react';
import { useBase } from '../../components/blocks/base';
import { useComponents } from '../../context/ComponentsContext';
import type { ItemCategory } from '../../types/config';
import { FormPalette } from './Palette';

type PalettePopoverProps = {
  label: string;
  icon: IvyIcons;
  children: ReactNode;
};

export const PalettePopover = ({ label, icon, children }: PalettePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { active } = useDndContext();

  useEffect(() => {
    if (active !== undefined && active !== null && popoverOpen) {
      setPopoverOpen(false);
    }
  }, [active, popoverOpen]);

  return (
    <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
      <PaletteButtonLabel label={label}>
        <PopoverTrigger asChild>
          <PaletteButton label={label} icon={icon} />
        </PopoverTrigger>
      </PaletteButtonLabel>
      <PopoverContent sideOffset={7} hideWhenDetached={true}>
        {children}
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};

type PaletteCategoryPopoverProps = Omit<PalettePopoverProps, 'children' | 'label'> & { category: ItemCategory };

export const PaletteCategoryPopover = ({ category, icon }: PaletteCategoryPopoverProps) => {
  const { componentsByCategory } = useComponents();
  const { categoryTranslations: CategoryTranslations } = useBase();
  return (
    <PalettePopover label={CategoryTranslations[category]} icon={icon}>
      <FormPalette sections={componentsByCategory(category)} />
    </PalettePopover>
  );
};
