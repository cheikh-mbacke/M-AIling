import React from "react";
import { Sparkles } from "lucide-react";
import VersionCard from "./VersionCard";
import styles from "./GeneratedVersions.module.css";

const GeneratedVersions = ({ versions, selectedVersion, onSelectVersion }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Sparkles size={20} />
        <h3 className={styles.title}>Versions générées</h3>
      </div>

      <div className={styles.versions}>
        {versions.map((version, index) => (
          <VersionCard
            key={index}
            version={version}
            index={index}
            isSelected={selectedVersion === index}
            onSelect={() => onSelectVersion(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GeneratedVersions;
