import type { FormMetaRequestTypes } from '@axonivy/form-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useClient } from './ClientContext';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof FormMetaRequestTypes>(
  path: TMeta,
  args: FormMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<FormMetaRequestTypes[TMeta][1]>
): { data: FormMetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
