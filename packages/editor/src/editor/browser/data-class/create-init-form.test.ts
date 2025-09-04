import { EMPTY_FORM, type Button, type LayoutConfig } from '@axonivy/form-editor-protocol';
import { createInitForm } from './create-init-form';

test('create', () => {
  const data = createInitForm(emptyData(), [{ type: 'Input', config: { label: 'Age', value: 'age' } }], false);
  expect(data).not.toEqual(emptyData());
  expect(data.components).toHaveLength(1);
  expect(data.components[0]?.type).toEqual('Input');
});

test('create with workflow buttons', () => {
  const data = createInitForm(emptyData(), [{ type: 'Input', config: { label: 'Age', value: 'age' } }], true);
  expect(data).not.toEqual(emptyData());
  expect(data.components).toHaveLength(2);
  expect(data.components[0]?.type).toEqual('Input');
  const layout = data.components[1] as LayoutConfig;
  expect(layout.type).toEqual('Layout');
  expect(layout.config.components).toHaveLength(2);
  expect((layout.config.components[0]?.config as Button).action).toEqual('#{ivyWorkflowView.cancel()}');
  expect((layout.config.components[0]?.config as Button).type).toEqual('BUTTON');
  expect((layout.config.components[1]?.config as Button).action).toEqual('#{logic.close}');
  expect((layout.config.components[1]?.config as Button).type).toEqual('SUBMIT');
});

const emptyData = () => {
  return structuredClone(EMPTY_FORM);
};
