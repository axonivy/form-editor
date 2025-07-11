import { BasicField, BasicSelect } from '@axonivy/ui-components';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { useValidation } from '../../../../context/useValidation';
import { useData } from '../../../../data/data';
import type { GenericFieldProps } from '../../../../types/config';
import { typesString } from '../../../../utils/string';
import { useCompositeComponent } from '../Composite';

export const renderStartMethodSelect = (props: GenericFieldProps) => {
  return <StartMethodSelect {...props} />;
};

const StartMethodSelect = ({ label, value, onChange, validationPath }: GenericFieldProps) => {
  const { context } = useAppContext();
  const { element } = useData();
  const { isComposite } = useCompositeComponent();
  const methods =
    useMeta('meta/composite/all', context, [])
      .data.find(composite => isComposite(element) && composite.id === element?.config.name)
      ?.startMethods.map<{ label: string; value: string }>(method => ({
        label: `${method.name}(${typesString(method.parameters)})`,
        value: method.name
      })) ?? [];
  const message = useValidation(validationPath);
  return (
    <BasicField label={label} message={message}>
      <BasicSelect items={methods} value={value.toString()} onValueChange={onChange} />
    </BasicField>
  );
};
