import React from "react";
import { Plus } from "lucide-react";
import AccountCard from "../AccountCard/AccountCard";
import styles from "./AddAccountCard.module.css";

const AddAccountCard = ({ onClick }) => {
  return (
    <div className={styles.addAccountCard}>
      <AccountCard
        provider="Ajouter un compte"
        icon={<Plus size={32} />}
        onClick={onClick}
      />
    </div>
  );
};

export default AddAccountCard;
