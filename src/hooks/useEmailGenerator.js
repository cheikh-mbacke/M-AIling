import { useState, useCallback } from "react";
import { generateEmailVersions } from "../services";

const useEmailGenerator = () => {
  const [generatedVersions, setGeneratedVersions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateVersions = useCallback(async (message, style) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulation d'un délai réseau
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const versions = generateEmailVersions(message, style);
      setGeneratedVersions(versions);
    } catch (err) {
      setError("Erreur lors de la génération des versions");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedVersions([]);
    setError(null);
  }, []);

  return {
    generatedVersions,
    isGenerating,
    error,
    generateVersions,
    reset,
  };
};

export default useEmailGenerator;
