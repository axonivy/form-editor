import type { ParameterInfo, PrimitiveValue } from '@axonivy/form-editor-protocol';
import { capitalize, Flex, Message } from '@axonivy/ui-components';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../../context/AppContext';
import { useMeta } from '../../../../context/useMeta';
import { useValidation } from '../../../../context/useValidation';
import { useData } from '../../../../data/data';
import { InputFieldWithBrowser } from '../../../../editor/sidebar/fields/InputFieldWithBrowser';
import type { GenericFieldProps } from '../../../../types/config';
import { useCompositeComponent } from '../Composite';

export const renderParameters = (props: GenericFieldProps) => {
  return <Parameters {...props} />;
};

const isStringRecord = (primitive?: PrimitiveValue): primitive is Record<string, string> =>
  primitive !== undefined && typeof primitive === 'object';

const Parameters = ({ value, ...props }: GenericFieldProps) => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const { element } = useData();
  const { isComposite } = useCompositeComponent();
  const method = useMeta('meta/composite/all', context, [])
    .data.find(composite => isComposite(element) && composite.id === element.config.name)
    ?.startMethods.find(method => isComposite(element) && method.name === element.config.startMethod);
  const params = useMeta('meta/composite/params', { context, compositeId: isComposite(element) ? element.config.name : '' }, []).data;

  if (!isStringRecord(value)) {
    return null;
  }
  if (method === undefined || (method.parameters.length === 0 && params.length === 0)) {
    return <Message variant='info' message={t('message.noParam')} />;
  }
  return (
    <Flex direction='column' gap={2}>
      {method.parameters.map(param => (
        <ParameterInput key={param.name} {...param} {...props} value={value} />
      ))}
      {params.map(param => (
        <ParameterInput key={param.name} {...param} {...props} value={value} />
      ))}
    </Flex>
  );
};

type ParameterInputProps = ParameterInfo &
  Omit<GenericFieldProps, 'value'> & {
    value: Record<string, string>;
  };

const ParameterInput = ({ value, onChange, name, description, type, validationPath }: ParameterInputProps) => {
  const message = useValidation(`${validationPath}.${name}`);
  const updateValue = (key: string, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };
  return (
    <InputFieldWithBrowser
      label={capitalize(name)}
      value={value[name]}
      onChange={change => updateValue(name, change)}
      browsers={[{ type: 'ATTRIBUTE', options: { attribute: { typeHint: type } } }]}
      message={message ?? { variant: 'description', message: description }}
    />
  );
};
