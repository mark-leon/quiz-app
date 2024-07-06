export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState) as T;
  } catch (err) {
    console.error("Could not load from localStorage", err);
    return null;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error("Could not save to localStorage", err);
  }
};
