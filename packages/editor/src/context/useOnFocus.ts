import { useState } from 'react';
import { useFocusWithin, type FocusWithinResult } from 'react-aria';

export const useOnFocus = (): { isFocusWithin: boolean; focusWithinProps: FocusWithinResult['focusWithinProps'] } => {
  const [isFocusWithin, setFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setFocusWithin
  });
  return { isFocusWithin, focusWithinProps };
};
