import { useState, useEffect } from "react";

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simuler le chargement des comptes depuis le localStorage ou une API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        // Simuler un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Charger depuis localStorage
        const savedAccounts = localStorage.getItem("mailreform_accounts");
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          // Données par défaut pour la démo
          setAccounts([
            {
              id: 1,
              provider: "gmail",
              emails: ["john.doe@gmail.com", "john.work@gmail.com"],
            },
            { id: 2, provider: "outlook", emails: ["john@outlook.com"] },
          ]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // Sauvegarder les comptes à chaque modification
  useEffect(() => {
    if (!loading && accounts.length > 0) {
      localStorage.setItem("mailreform_accounts", JSON.stringify(accounts));
    }
  }, [accounts, loading]);

  const addAccount = (provider, emails) => {
    const newAccount = {
      id: Date.now(),
      provider,
      emails: Array.isArray(emails) ? emails : [emails],
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const removeEmail = (accountId, emailToRemove) => {
    setAccounts((prevAccounts) => {
      return prevAccounts.reduce((acc, account) => {
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
      }, []);
    });
  };

  const removeAccount = (accountId) => {
    setAccounts((prev) => prev.filter((account) => account.id !== accountId));
  };

  return {
    accounts,
    loading,
    error,
    addAccount,
    removeEmail,
    removeAccount,
  };
};

export default useAccounts;
