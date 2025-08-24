import type { ConfigData } from '@axonivy/form-editor-protocol';
import type { Fields } from '../../types/config';
import { groupFieldsBySubsection, visibleFields, visibleSections, type VisibleFields } from './property';

describe('visibleFields', () => {
  const fields: Fields = {
    a: { type: 'text', subsection: 'General' },
    b: { type: 'number', subsection: 'Behaviour', hide: config => config.a === 'hide' },
    c: { type: 'hidden', subsection: 'General' }
  } as const;

  test('no hidden fields', () => {
    expect(visibleFields(fields, {})).toEqual([
      { key: 'a', field: fields['a'] },
      { key: 'b', field: fields['b'] }
    ]);
  });

  test('no hide config fields', () => {
    expect(visibleFields(fields, { a: 'hide' })).toEqual([{ key: 'a', field: fields['a'], value: 'hide' }]);
  });
});

describe('visibleSections', () => {
  const visibleFields: VisibleFields = [
    { key: 'a', field: { subsection: 'General', type: 'text' }, value: '' },
    { key: 'b', field: { subsection: 'Behaviour', type: 'number' }, value: '' },
    { key: 'lgSpan', field: { section: 'Layout', subsection: 'General', type: 'text' }, value: '' },
    { key: 'alignSelf', field: { section: 'Layout', subsection: 'General', type: 'text' }, value: '' }
  ];

  test('no parent', () => {
    expect(visibleSections(visibleFields)).toEqual(
      new Map([['Properties', { section: { name: 'Properties', icon: 'list' }, fields: [visibleFields[0], visibleFields[1]] }]])
    );
  });

  test('parent is grid layout', () => {
    expect(
      visibleSections(visibleFields, {
        cid: 'grid-layout',
        type: 'Layout',
        config: { gridVariant: 'GRID1', type: 'GRID', components: [] } as unknown as ConfigData
      })
    ).toEqual(new Map([['Properties', { section: { name: 'Properties', icon: 'list' }, fields: [visibleFields[0], visibleFields[1]] }]]));
  });

  test('parent is free layout', () => {
    expect(
      visibleSections(visibleFields, {
        cid: 'free-layout',
        type: 'Layout',
        config: { gridVariant: 'FREE', type: 'GRID', components: [] } as unknown as ConfigData
      })
    ).toEqual(
      new Map([
        ['Properties', { section: { name: 'Properties', icon: 'list' }, fields: [visibleFields[0], visibleFields[1]] }],
        ['Layout', { section: { name: 'Layout', icon: 'dialog-layout' }, fields: [visibleFields[2], visibleFields[3]] }]
      ])
    );
  });
});

describe('groupFieldsBySubsection', () => {
  const fields: VisibleFields = [
    { key: 'a', field: { subsection: 'General', type: 'text' }, value: '' },
    { key: 'b', field: { subsection: 'Behaviour', type: 'number' }, value: '' }
  ];

  test('subsections', () => {
    expect(groupFieldsBySubsection(fields)).toEqual([
      { title: 'General', fields: [{ key: 'a', field: fields[0]?.field, value: '' }] },
      { title: 'Behaviour', fields: [{ key: 'b', field: fields[1]?.field, value: '' }] }
    ]);
  });
});
