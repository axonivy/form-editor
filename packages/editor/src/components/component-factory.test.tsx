import { componentForDataType } from './component-factory';

test('componentForDataType', () => {
  expect(componentForDataType('String')).toEqual({ type: 'Input' });
  expect(componentForDataType('Number')).toEqual({ type: 'Input', config: { type: 'NUMBER' } });
  expect(componentForDataType('Boolean')).toEqual({ type: 'Checkbox' });
  expect(componentForDataType('Date')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('DateTime')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('java.util.Date')).toEqual({ type: 'DatePicker' });
  expect(componentForDataType('List<String>')).toEqual({ type: 'DataTable' });
  expect(componentForDataType('Time')).toEqual({ type: undefined });
  expect(componentForDataType('File')).toEqual({ type: undefined });
});
