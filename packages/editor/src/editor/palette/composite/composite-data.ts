import type { CompositeInfo } from '@axonivy/form-editor-protocol';
import { splitByCamelCase } from '@axonivy/ui-components';
import { simpleType } from '../../../utils/string';
import type { FormPaletteItemConfig } from '../PaletteItem';

export const paletteItems = (composites: Array<CompositeInfo>): Record<string, Array<FormPaletteItemConfig>> => {
  const paletteItems: Record<string, Array<FormPaletteItemConfig>> = {};
  paletteItems['All'] = composites.map<FormPaletteItemConfig>(composite => ({
    name: splitByCamelCase(simpleType(composite.id)),
    displayName: splitByCamelCase(simpleType(composite.id)),
    description: composite.id,
    data: { componentName: 'Composite', label: composite.id, value: composite.id }
  }));
  return paletteItems;
};
