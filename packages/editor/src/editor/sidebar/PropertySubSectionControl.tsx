import { type CollapsibleControlProps } from '@axonivy/ui-components';
import { useComponents } from '../../context/ComponentsContext';
import { useData } from '../../data/data';
import type { Subsection } from '../../types/config';

export const usePropertySubSectionControl = () => {
  const { componentByName } = useComponents();
  const { element } = useData();
  const PropertySubSectionControl = ({ title, ...props }: CollapsibleControlProps & { title: string }) => {
    if (element === undefined) {
      return null;
    }
    const config = componentByName(element.type);
    if (config?.subSectionControls) {
      return config.subSectionControls(props, title as Subsection);
    }
    return null;
  };

  return {
    PropertySubSectionControl
  };
};
