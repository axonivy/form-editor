import { IvyIcons } from '@axonivy/ui-icons';
import type { ItemCategory } from '../../types/config';
import { Button, IvyIcon, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@axonivy/ui-components';
import { Palette } from './Palette';
import { useDndContext } from '@dnd-kit/core';
import { useEffect, useState, type ReactNode } from 'react';
import './PalettePopover.css';
import { PaletteButton } from './PaletteButton';
import { useBase } from '../../components/blocks/base';
import { useComponents } from '../../context/ComponentsContext';

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
    <PaletteButton text={label}>
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger asChild>
          <Button aria-label={label} icon={icon} size='large'>
            <IvyIcon icon={IvyIcons.Chevron} className='category-icon' rotate={90} />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} hideWhenDetached={true} onClick={e => e.stopPropagation()}>
          {children}
          <PopoverArrow />
        </PopoverContent>
      </Popover>
    </PaletteButton>
  );
};

export const PaletteCategoryPopover = (props: Omit<PalettePopoverProps, 'children' | 'label'> & { category: ItemCategory }) => {
  const { componentsByCategory } = useComponents();
  const { categoryTranslations: CategoryTranslations } = useBase();
  return (
    <PalettePopover label={CategoryTranslations[props.category]} icon={props.icon}>
      <Palette sections={componentsByCategory(props.category)} />
    </PalettePopover>
  );
};
