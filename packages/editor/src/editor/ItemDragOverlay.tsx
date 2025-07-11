import type { CreateData } from '../components/component-factory';
import { useComponents } from '../context/ComponentsContext';
import { useData } from '../data/data';
import { ComponentBlockOverlay } from './canvas/ComponentBlock';
import { PaletteItemOverlay } from './palette/PaletteItem';

export const ItemDragOverlay = ({ activeId, createData }: { activeId?: string; createData?: CreateData }) => {
  const { componentByElement, componentByName } = useComponents();
  const { element } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(activeId);
  if (component) {
    return <PaletteItemOverlay type={component.name} createData={createData} />;
  }
  if (element) {
    const component = componentByElement(element);
    return <ComponentBlockOverlay config={component} data={element} />;
  }
  return null;
};
