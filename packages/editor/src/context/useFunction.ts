import type { FormMetaRequestTypes } from '@axonivy/form-editor-protocol';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useClient } from './ClientContext';

type UseFunctionOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useFunction<TFunct extends keyof FormMetaRequestTypes>(
  path: TFunct,
  initialArgs: FormMetaRequestTypes[TFunct][0],
  options?: UseFunctionOptions<FormMetaRequestTypes[TFunct][1]>
): UseMutationResult<FormMetaRequestTypes[TFunct][1], Error, FormMetaRequestTypes[TFunct][0] | undefined> {
  const client = useClient();

  return useMutation({
    mutationKey: genQueryKey(path, initialArgs),
    mutationFn: (args?: FormMetaRequestTypes[TFunct][0]) => client.meta(path, args ?? initialArgs),
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}
