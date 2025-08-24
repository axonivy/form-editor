import { simpleType, stripELExpression, typesString } from './string';

test('simpleType', () => {
  expect(simpleType('')).toEqual('');
  expect(simpleType('Type')).toEqual('Type');
  expect(simpleType('com.example.Type')).toEqual('Type');
  expect(simpleType('Another.Type.Name')).toEqual('Name');
});

test('typesString', () => {
  expect(typesString([{ type: 'Number' }, { type: 'com.example.Type' }])).toEqual('Number, Type');
});

test('stripELExpression', () => {
  expect(stripELExpression('#{some.value}')).toEqual('some.value');
  expect(stripELExpression('#{ another.value }')).toEqual('another.value');
  expect(stripELExpression('#{nested.value.deep}')).toEqual('nested.value.deep');
  expect(stripELExpression('some.value')).toEqual('some.value');
  expect(stripELExpression('#{}')).toEqual('');
  expect(stripELExpression('#{   }')).toEqual('');
  expect(stripELExpression('#{a}')).toEqual('a');
});
