import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { Icons, summaryCardDetails } from '../../assets/assets';

const Dashboard = ({ user }) => {
  // --- LIVE DATA STATE ---
  const [liveStats, setLiveStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0
  });

  /**
   * AI Rectification: Consolidated Data Processor
   * Calculates the current financial health from local storage.
   */
  const calculateDashboardData = () => {
    const transactionsData = localStorage.getItem('userTransactions');
    let totalIncome = 0;
    let totalExpenses = 0;

    if (transactionsData) {
      const transactions = JSON.parse(transactionsData);
      transactions.forEach(item => {
        const amt = Number(item.amount || 0);
        // Ensure type checking is case-insensitive for robustness [cite: 2026-02-15]
        if (item.type?.toLowerCase() === 'income') {
          totalIncome += amt;
        } else if (item.type?.toLowerCase() === 'expense') {
          totalExpenses += amt;
        }
      });
    }

    const goalsData = localStorage.getItem('userSavingsGoals');
    let totalSaved = 0;
    if (goalsData) {
      const goals = JSON.parse(goalsData);
      goals.forEach(goal => {
        totalSaved += Number(goal.currentSaved || 0);
      });
    }

    setLiveStats({
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
      savings: totalSaved
    });
  };

  useEffect(() => {
    calculateDashboardData();
    window.addEventListener('balanceUpdated', calculateDashboardData);
    window.addEventListener('storage', calculateDashboardData);
    return () => {
      window.removeEventListener('balanceUpdated', calculateDashboardData);
      window.removeEventListener('storage', calculateDashboardData);
    };
  }, []);

  if (!summaryCardDetails || !Array.isArray(summaryCardDetails)) {
    return <div style={{padding: '20px', color: 'red'}}>Error: summaryCardDetails not found.</div>;
  }
  
  const currentUser = user || {};
  const firstName = currentUser.firstName || "User";
  const currency = "FCFA";

  return (
    <div className="dashboard-container">
      <header className="content-header">
        <div className="header-welcome">
          <h1 className="title">Welcome, {firstName}</h1>
          <p className="subtitle">Here's what's happening with your money today.</p>
        </div>

        <div className="header-actions">
          <button className="icon-btn">
            <Icons.Notification className="icons" />
            <span className="notification-dot"></span>
          </button>

          <div className="userProfileBox">
            <div className="profilePic">
              {currentUser.profilePic ? (
                <img src={currentUser.profilePic} alt="profile" className="profileImg"/>
              ) : (
                <span className="initialText">{currentUser.userInitial || firstName.charAt(0)}</span>
              )}
            </div>
            <div className="userInfo">
              <span className="user-name">{firstName} {currentUser.lastName || ""}</span>
              <span className="user-email">{currentUser.email || "No email provided"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="summary-grid">
        {summaryCardDetails.map((card) => {
          let amount = liveStats[card.id] || 0;
          
          // RECTIFICATION: Visual Warning Logic [cite: 2026-02-15]
          const isBalanceCard = card.id === "balance";
          const isNegativeBalance = isBalanceCard && amount < 0;

          return (
            <div 
              className={`summary-card ${isNegativeBalance ? 'negative-alert' : ''}`} 
              key={card.id}
            >
              <div className="card-top-row">
                <span className="card-label">{card.label}</span>
                {isNegativeBalance && <span className="warning-badge">Overspent</span>}
              </div>

              <div className="card-body">
                <h2 className={`card-amount ${isNegativeBalance ? 'text-danger' : ''}`}>
                  {Number(amount).toLocaleString()} 
                  <span className="currency-symbol"> {currency}</span>
                </h2>
              </div>

              <div className="cardFooter">      
                <span className="cardDetailText">
                  {isNegativeBalance 
                    ? "Warning: Expenses exceed income!" 
                    : card.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
// amount = user?.total_balance is getting the total_balnace of the user from the db
//  a decrease in the expenditures that u make is  a good choice 
//  if the trendicon is up meanig there is a decrease in the good and it will show a green color esle it  is a red color and the arrow willbe turned up