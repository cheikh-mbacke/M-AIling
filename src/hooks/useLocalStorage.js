import { useState } from "react";

const useLocalStorage = (key, initialValue) => {
  // État initialisé depuis localStorage ou valeur par défaut
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erreur lecture localStorage pour ${key}:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur écriture localStorage pour ${key}:`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
