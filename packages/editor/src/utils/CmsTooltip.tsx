import type { ContentObject } from '@axonivy/form-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useMeta } from '../context/useMeta';

export const CmsTooltip = ({ text }: { text: string }) => {
  const { context } = useAppContext();
  const cmsItems = useMeta('meta/cms/cmsTree', { context, requiredProjects: false }, []).data;

  text = text.replaceAll(/#{ivy.cms.co\(|['"]|\)}/g, '');
  const entries = findCmsEntries(text, cmsItems);
  entries.unshift(text);

  return entries.map(entry => (
    <span key={entry}>
      {entry}
      <br />
    </span>
  ));
};

export const findCmsEntries = (targetPath: string, cmsTree: Array<ContentObject>) => {
  const notFound = ['no cms entry found'];
  if (cmsTree.length === 0) {
    return notFound;
  }
  const entries = findDeep(targetPath, cmsTree[0]);
  if (!entries) {
    return notFound;
  }
  return Object.entries(entries).map(entry => {
    let value = entry[1];
    if (value.length > 40) {
      value = value.substring(0, 40) + '...';
    }
    return `${entry[0]}: ${value}`;
  });
};

const findDeep = (targetPath: string, obj?: ContentObject) => {
  if (!obj) return null;
  if (obj.fullPath === targetPath) return obj.values;
  if (!obj.children || obj.children.length === 0) return null;
  return findDeep(
    targetPath,
    obj.children.find(e => targetPath.startsWith(e.fullPath))
  );
};
