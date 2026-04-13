import { useState } from 'react';
import { useFocusWithin, type FocusWithinResult } from 'react-aria';

export const useOnFocus = (): { isFocusWithin: boolean; focusWithinProps: FocusWithinResult['focusWithinProps'] } => {
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocusWithin
  });
  return { isFocusWithin, focusWithinProps };
};
