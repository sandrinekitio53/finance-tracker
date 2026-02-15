import React, { useState, useEffect } from 'react';
import GoalDrawer from './goalDrawer'; // Ensure the filename is exactly GoalDrawer.jsx
import './goal.css';

const Goals = () => {
  const [goalsList, setGoalsList] = useState(() => {
    const saved = localStorage.getItem('userSavingsGoals');
    return saved ? JSON.parse(saved) : [];
  });

const [availableBalance, setAvailableBalance] = useState(0);

  // RECTIFICATION: A reusable function to calculate the REAL balance
  const calculateLiveBalance = () => {
    // IMPORTANT: Check your Transaction Drawer code to see the EXACT key name used
    const savedData = localStorage.getItem('userTransactions'); 
    
    if (savedData) {
      const transactions = JSON.parse(savedData);
      const total = transactions.reduce((acc, item) => {
        // Ensure naming matches your Transaction object (amount vs price)
        const amt = Number(item.amount || item.price || 0);
        return item.type === 'income' ? acc + amt : acc - amt;
      }, 0);
      setAvailableBalance(total);
    } else {
      setAvailableBalance(117500); // Fallback
    }
  };

  // Unique state name to avoid conflicts with other drawers
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('userSavingsGoals', JSON.stringify(goalsList));
  }, [goalsList]);

  // Load balance on mount
  useEffect(() => {
    calculateLiveBalance();
    // Listen for the signal from TransactionDrawer
    window.addEventListener('balanceUpdated', calculateLiveBalance);
    // Listen for changes from other tabs
    window.addEventListener('storage', calculateLiveBalance);
    
  return () =>{
      window.removeEventListener('balanceUpdated', calculateLiveBalance);
      window.removeEventListener('storage', calculateLiveBalance);
  }    
  }, []);

  const handleSaveGoal = (data) => {
    const newGoal = {
      id: Date.now(),
      title: data.title,
      targetAmount: data.amount,
      currentSaved: data.saved,
      targetDate: data.date
    };
    setGoalsList((prev) => [...prev, newGoal]);
    calculateLiveBalance();
    setShowGoalModal(false);
  };

  return (
    <div className="goalsContainer">
      <GoalDrawer 
        isOpen={showGoalModal} 
        onClose={() => setShowGoalModal(false)} 
        onSave={handleSaveGoal} 
      />

      <div className="goalsHeader">
        <div className="headerText">
          <h1>Goals</h1>
          <p>Track your savings targets</p>
        </div>
        
        <div className="balanceSection">
          <span className="balanceLabel">Available Balance</span>
          <h2 className="balanceValue">{availableBalance.toLocaleString()}frs</h2>
        </div>

        <button 
          className="setNewBtn" 
          onClick={() => {
            console.log("Set New button clicked!"); // Check your console (F12) for this
            setShowGoalModal(true);
          }}
        >
          Set New
        </button>
      </div>

      <div className="goalsGrid">
        {goalsList.map((goal) => {
          const remaining = goal.targetAmount - goal.currentSaved;
          const progressPercent = Math.min(Math.round((goal.currentSaved / goal.targetAmount) * 100), 100);

          return (
            <div key={goal.id} className="goalCard">
              <div className="cardHeader">
                <h4>{goal.title}</h4>
                <button className="cardMenuBtn">&#8942;</button>
              </div>
              <h3 className="cardMainAmount">{goal.targetAmount.toLocaleString()}frs</h3>
              <div className="progressContainer">
                <div className="progressInfo">
                    <div className="savedInfo">
                        <span>{goal.currentSaved.toLocaleString()}frs</span>
                        <small>Saved</small>
                    </div>
                    <span>{progressPercent}%</span>
                </div>
                <div className="progressBarBase">
                  <div className="progressBarFill" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              <div className="cardFooterDetails">
                <div className="footerRow">
                    <span>Target</span>
                    <span>{goal.targetDate}</span>
                </div>
                <div className="footerRow">
                    <span>Remaining</span>
                    <span>{remaining.toLocaleString()}frs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;