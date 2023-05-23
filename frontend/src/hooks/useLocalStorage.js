import { useState, useCallback } from 'react';

function useLocalStorage(keyName, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value !== undefined && value !== null) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      console.error(err);
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (newValue) => {
      try {
        window.localStorage.setItem(keyName, JSON.stringify(newValue));
      } catch (err) {
        console.error(err);
      }
      setStoredValue(newValue);
    },
    [keyName]
  );
  return [storedValue, setValue];
}

export default useLocalStorage;
