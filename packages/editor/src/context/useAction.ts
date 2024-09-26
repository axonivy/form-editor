import type { FormActionArgs } from '@axonivy/form-editor-protocol';
import { useClient } from './ClientContext';
import { useAppContext } from './AppContext';

export function useAction(actionId: FormActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: FormActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
