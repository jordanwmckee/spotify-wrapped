import { useState } from 'react';

const useToggleState = (
  initialValue = false
): [boolean, () => void, () => void] => {
  const [state, setState] = useState(initialValue);

  const toggleState = () => {
    setState((state) => !state);
  };

  const setToFalse = () => {
    setState(false);
  };

  return [state, toggleState, setToFalse];
};

export default useToggleState;
