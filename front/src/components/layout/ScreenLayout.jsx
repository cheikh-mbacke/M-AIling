import React, { useEffect, useRef, useState } from "react";
import styles from "./ScreenLayout.module.css";

const ScreenLayout = ({
  header,
  children,
  footer,
  resetScrollOnMount = true,
}) => {
  const contentRef = useRef(null);
  const screenRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Stocker la hauteur initiale
    const initialHeight = window.innerHeight;
    let keyboardOpen = false;

    const updateViewportHeight = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // Si la hauteur diminue de plus de 150px = clavier ouvert
      if (heightDifference > 150) {
        if (!keyboardOpen) {
          keyboardOpen = true;
          console.log("🎹 Clavier ouvert - hauteur figée");
        }
        // Ne pas changer la hauteur, garder celle d'avant
        return;
      } else {
        // Clavier fermé, reprendre les mises à jour normales
        if (keyboardOpen) {
          keyboardOpen = false;
          console.log("📱 Clavier fermé - hauteur adaptative");
        }

        // Mettre à jour la hauteur normalement
        setViewportHeight(currentHeight);
        document.documentElement.style.setProperty(
          "--viewport-height",
          `${currentHeight}px`
        );

        if (screenRef.current) {
          screenRef.current.style.height = `${currentHeight}px`;
        }
      }
    };

    // Fonction de debounce pour éviter trop d'appels
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateViewportHeight, 50);
    };

    // Setup initial
    updateViewportHeight();

    // Écouter les événements
    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", updateViewportHeight);

    // Visual Viewport API pour une détection plus précise
    if (window.visualViewport) {
      const handleVisualViewportChange = () => {
        const vvHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const heightDifference = windowHeight - vvHeight;

        if (heightDifference > 150) {
          if (!keyboardOpen) {
            keyboardOpen = true;
            console.log("🎹 Clavier détecté (Visual Viewport) - hauteur figée");
          }
          // Ne rien faire, garder la hauteur actuelle
          return;
        } else {
          if (keyboardOpen) {
            keyboardOpen = false;
            console.log("📱 Clavier fermé (Visual Viewport)");
          }

          // Mettre à jour normalement
          setViewportHeight(windowHeight);
          document.documentElement.style.setProperty(
            "--viewport-height",
            `${windowHeight}px`
          );
          if (screenRef.current) {
            screenRef.current.style.height = `${windowHeight}px`;
          }
        }
      };

      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportChange
      );

      return () => {
        window.removeEventListener("resize", debouncedResize);
        window.removeEventListener("orientationchange", updateViewportHeight);
        window.visualViewport?.removeEventListener(
          "resize",
          handleVisualViewportChange
        );
        clearTimeout(resizeTimeout);
      };
    }

    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", updateViewportHeight);
      clearTimeout(resizeTimeout);
    };
  }, [viewportHeight]);

  useEffect(() => {
    if (resetScrollOnMount && contentRef.current) {
      // Reset scroll position au montage
      contentRef.current.scrollTop = 0;
    }
  }, [resetScrollOnMount]);

  // Style inline pour garantir la hauteur exacte
  const screenStyle = {
    height: `${viewportHeight}px`,
    maxHeight: `${viewportHeight}px`,
    overflow: "hidden",
  };

  return (
    <div ref={screenRef} className={styles.screen} style={screenStyle}>
      {header && <div className={styles.header}>{header}</div>}
      <main ref={contentRef} className={styles.content} data-scroll-container>
        {children}
      </main>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default ScreenLayout;
