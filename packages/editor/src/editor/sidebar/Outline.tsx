import { type ComponentData, isStructure } from '@axonivy/form-editor-protocol';
import { type OutlineNode, Outline } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useComponents } from '../../context/ComponentsContext';
import { useData } from '../../data/data';
import type { ItemCategory } from '../../types/config';

export const FormOutline = ({ hideOutline }: { hideOutline: () => void }) => {
  const { t } = useTranslation();
  const { componentByName } = useComponents();

  const iconByCategory = (category: ItemCategory) => {
    switch (category) {
      case 'Structures':
        return IvyIcons.LaneSwimlanes;
      case 'Actions':
        return IvyIcons.MultiSelection;
      case 'Elements':
      default:
        return IvyIcons.ChangeType;
    }
  };

  const toOutlineNodes = (components: Array<ComponentData>): Array<OutlineNode> =>
    components.map<OutlineNode>(component => {
      const config = componentByName(component.type);
      let children: Array<OutlineNode> = [];
      if (isStructure(component)) {
        children = toOutlineNodes(component.config.components);
      }
      return {
        id: component.cid,
        title: component.type,
        info: config.outlineInfo({ ...component.config }),
        icon: iconByCategory(config.category),
        children
      };
    });

  const { data, element, setSelectedElement } = useData();
  const outlineData = toOutlineNodes(data.components);
  return (
    <Outline
      options={{ searchPlaceholder: t('common.label.search') }}
      outline={outlineData}
      selection={element?.cid}
      onClick={setSelectedElement}
      onDoubleClick={hideOutline}
    />
  );
};
