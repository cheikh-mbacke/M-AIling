import React, { useState } from "react";
import { PenLine } from "lucide-react";
import Header from "../common/Header/Header";
import ConnectedAccounts from "./ConnectedAccounts/ConnectedAccounts";
import Button from "../common/Button/Button";
import AccountDetailsModal from "../modals/AccountDetailsModal/AccountDetailsModal";
import ScreenLayout from "../layout/ScreenLayout";
import styles from "./Dashboard.module.css";

const Dashboard = ({ onCompose }) => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      provider: "gmail",
      emails: ["john.doe@gmail.com", "john.work@gmail.com"],
    },
    { id: 2, provider: "outlook", emails: ["john@outlook.com"] },
    { id: 3, provider: "yahoo", emails: ["titi@yahoo.com"] },
  ]);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const handleSettingsClick = () => {
    console.log("Paramètres cliqués");
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setShowAccountDetails(true);
  };

  const handleAddAccount = () => {
    console.log("Ajouter un compte");
  };

  const handleComposeEmail = () => {
    if (onCompose) {
      onCompose();
    }
  };

  const handleDisconnectEmail = (accountId, emailToRemove) => {
    setAccounts((prevAccounts) =>
      prevAccounts.reduce((acc, account) => {
        if (account.id === accountId) {
          const updatedEmails = account.emails.filter(
            (email) => email !== emailToRemove
          );
          if (updatedEmails.length > 0) {
            acc.push({ ...account, emails: updatedEmails });
          }
        } else {
          acc.push(account);
        }
        return acc;
      }, [])
    );

    const updatedAccount = accounts.find((acc) => acc.id === accountId);
    if (updatedAccount && updatedAccount.emails.length === 1) {
      setShowAccountDetails(false);
    }
  };

  return (
    <ScreenLayout
      header={<Header onSettingsClick={handleSettingsClick} />}
      footer={
        <div>
          <div className={styles.container}>
            <Button
              onClick={handleComposeEmail}
              variant="primary"
              size="large"
              fullWidth
              icon={<PenLine size={20} />}
            >
              Rédiger un nouveau mail
            </Button>
          </div>
        </div>
      }
    >
      <main className={styles.dashboardContent}>
        <div className={styles.container}>
          <ConnectedAccounts
            accounts={accounts}
            onAccountClick={handleAccountClick}
            onAddAccount={handleAddAccount}
          />
        </div>

        {showAccountDetails && selectedAccount && (
          <AccountDetailsModal
            account={selectedAccount}
            onClose={() => setShowAccountDetails(false)}
            onDisconnect={handleDisconnectEmail}
          />
        )}
      </main>
    </ScreenLayout>
  );
};

export default Dashboard;
