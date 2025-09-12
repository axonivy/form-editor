import { Palette, PaletteSection } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useBase } from '../../components/blocks/base';
import { FormPaletteItem, type FormPaletteItemConfig } from './PaletteItem';

export type PaletteProps = {
  sections: Record<string, FormPaletteItemConfig[]>;
  directCreate?: (name: string) => void;
};

export const FormPalette = ({ sections, directCreate }: PaletteProps) => {
  const { t } = useTranslation();
  const { categoryTranslations } = useBase();
  const searchFilter = (item: FormPaletteItemConfig, term: string) =>
    item.displayName.toLocaleLowerCase().includes(term.toLocaleLowerCase());
  return (
    <Palette
      sections={sections}
      options={{ searchPlaceholder: t('common.label.search'), searchFilter, emptyMessage: t('message.emptyPalette') }}
    >
      {(title, items) => (
        <PaletteSection key={title} title={categoryTranslations[title] ?? ''} items={items}>
          {item => <FormPaletteItem key={item.name} directCreate={directCreate} {...item} />}
        </PaletteSection>
      )}
    </Palette>
  );
};
