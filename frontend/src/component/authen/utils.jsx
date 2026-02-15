import { useState} from 'react';

/**
 * AI-Standard Custom Hook [cite: 2026-01-09]
 * This hook automatically detects the user and manages their specific data.
 */
export const useUserStorage = (key) => {
  // 1. Get User ID safely
  const getUserKey = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = user.email ? user.email.replace(/[^a-zA-Z0-9]/g, "") : 'guest';
    return `${userId}_${key}`;
  };

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(getUserKey());
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Sync data whenever the "User" or "Storage" changes [cite: 2026-01-09]
  const saveData = (newData) => {
    localStorage.setItem(getUserKey(), JSON.stringify(newData));
    setData(newData);
    window.dispatchEvent(new Event("balanceUpdated"));
  };

  return [data, saveData];
};