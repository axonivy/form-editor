import { PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getErrorMessage, type FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

export const ErrorFallback = (props: FallbackProps) => {
  const { t } = useTranslation();
  const message = getErrorMessage(props.error);
  return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.errorOnly', { error: message })} />;
};
