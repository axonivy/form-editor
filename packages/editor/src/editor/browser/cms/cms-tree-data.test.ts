import type { ContentObject } from '@axonivy/form-editor-protocol';
import { cmsTreeData } from './cms-tree-data';

const cmsData: Array<ContentObject> = [
  {
    name: 'form-test-project',
    fullPath: '/',
    type: 'FOLDER',
    values: {},
    children: [{ name: 'greetings', fullPath: '/greetings', type: 'STRING', values: { en: 'Hello World' }, children: [] }]
  }
];

test('of', () => {
  const tree = cmsTreeData(cmsData);
  expect(tree).toHaveLength(1);
  expect(tree[0]?.value).equals('form-test-project');
  expect(tree[0]?.info).equals('FOLDER');
  expect(tree[0]?.icon).equals('folder-open');
  expect(tree[0]?.notSelectable).equals(true);
  expect(tree[0]?.isLoaded).equals(true);
  expect(tree[0]?.children).toHaveLength(1);
  expect(tree[0]?.children[0]?.value).equals('greetings');
  expect(tree[0]?.children[0]?.info).equals('STRING');
  expect(tree[0]?.children[0]?.icon).equals('change-type');
  expect(tree[0]?.children[0]?.notSelectable).equals(false);
  expect(tree[0]?.children[0]?.isLoaded).equals(true);
});
