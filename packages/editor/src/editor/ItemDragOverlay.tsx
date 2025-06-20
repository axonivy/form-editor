import { ComponentBlockOverlay } from './canvas/ComponentBlock';
import { useData } from '../data/data';
import { useComponents } from '../context/ComponentsContext';
import { PaletteItemOverlay } from './palette/PaletteItem';
import type { CreateData } from '../components/component-factory';

export const ItemDragOverlay = ({ activeId, createData }: { activeId?: string; createData?: CreateData }) => {
  const { componentByElement, componentByName } = useComponents();
  const { element, data } = useData();
  if (!activeId) {
    return null;
  }
  const component = componentByName(activeId);
  if (component) {
    return <PaletteItemOverlay type={component.name} createData={createData} />;
  }
  if (element) {
    const component = componentByElement(element, data.components);
    return <ComponentBlockOverlay config={component} data={element} />;
  }
  return null;
};
