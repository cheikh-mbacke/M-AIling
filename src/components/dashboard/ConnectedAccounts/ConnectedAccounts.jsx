import React from "react";
import AccountCard from "../AccountCard/AccountCard";
import AddAccountCard from "../AddAccountCard/AddAccountCard";
import { ProviderIcon } from "../../icons/ProviderIcons";
import { getProviderConfig } from "../../../config/providers";
import styles from "./ConnectedAccounts.module.css";

const ConnectedAccounts = ({ accounts, onAccountClick, onAddAccount }) => {
  return (
    <div className={styles.connectedAccounts}>
      <h2 className={styles.sectionTitle}>Comptes connectés</h2>
      <div className={styles.accountsGrid}>
        {accounts.map((account) => {
          const providerConfig = getProviderConfig(account.provider);
          return (
            <AccountCard
              key={account.id}
              provider={providerConfig.displayName}
              icon={<ProviderIcon provider={account.provider} size={32} />}
              onClick={() => onAccountClick(account)}
            />
          );
        })}
        <AddAccountCard onClick={onAddAccount} />
      </div>
    </div>
  );
};

export default ConnectedAccounts;
