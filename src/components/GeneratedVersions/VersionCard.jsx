import React, { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { copyToClipboard } from "../../utils";
import styles from "./GeneratedVersions.module.css";

const VersionCard = ({ version, index, isSelected, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copyToClipboard(version);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const preview = version.split("\n").slice(0, 3).join("\n");
  const needsExpansion = version.split("\n").length > 3;

  return (
    <div
      className={`${styles.versionCard} ${isSelected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <div className={styles.cardHeader}>
        <span className={styles.versionNumber}>Version {index + 1}</span>
        <button
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Copier"
        >
          {copied ? (
            <Check size={16} className={styles.success} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>

      <div className={styles.versionContent}>
        <p className={styles.text}>
          {expanded ? version : preview}
          {!expanded && needsExpansion && "..."}
        </p>

        {needsExpansion && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className={styles.expandButton}
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                Voir plus
              </>
            )}
          </button>
        )}
      </div>

      {isSelected && <div className={styles.selectedIndicator} />}
    </div>
  );
};

export default VersionCard;
