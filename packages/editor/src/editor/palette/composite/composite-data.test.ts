import type { CompositeInfo } from '@axonivy/form-editor-protocol';
import { paletteItems } from './composite-data';

const composites: Array<CompositeInfo> = [
  {
    id: 'form.test.project.AddressComponent',
    startMethods: [
      { name: 'start', parameters: [{ name: 'address', type: 'form.test.project.Address', description: '' }], deprecated: false }
    ]
  }
];

test('of', () => {
  const items = paletteItems(composites);
  expect(Object.keys(items)).toEqual(['All']);
  expect(items['All']).toHaveLength(1);
  const comp = items['All']![0];
  expect(comp?.name).toEqual('Address Component');
  expect(comp?.description).toEqual('form.test.project.AddressComponent');
  expect(comp?.data?.componentName).toEqual('Composite');
});
