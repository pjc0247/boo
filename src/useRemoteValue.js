import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export const useRemoteValue = (api, deps = [], defaultValue = null)=> {
  const [value, setValue] = useState();
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setValue(await api());
      } catch({ message }) {
        Toast.show({ text1: message, type: 'error' });
      }
    })();
  }, [counter, ...deps]);

  return [value || defaultValue, () => setCounter((v) => v + 1)];
};
