import React, { useState, useEffect } from 'react';
import './Budget.css';
// import { useUserStorage } from '../../component/authen/utils';


const Budget = () => {
  const [budgetList, setBudgetList] = useState([]);
  // const [transactions] = useUserStorage('userTransactions');
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

/**
 * AI Version: Budget Calculation Engine
 * Rectification: Implements strict normalization to fix the 0% matching error.
 */
const calculateBudgetProgress = () => {
  // 1. Fetch data from the Vault [cite: 2026-02-15]
  const savedTransactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
  const savedBudgets = JSON.parse(localStorage.getItem('userBudgets') || '[]');

  // 2. Filter for Expenses only (Normalization: lowercase)
  const expenses = savedTransactions.filter(t => 
    t.type?.toLowerCase() === 'expense'
  );

  // 3. Process Budgets [cite: 2026-02-15]
  const updatedBudgets = savedBudgets.map(budget => {
    // Normalization: Remove hidden spaces and force lowercase for the search key
    const budgetKey = budget.category?.toString().trim().toLowerCase();

    // Sum up transactions where categories match normalized keys
    const spentInCategory = expenses
      .filter(t => {
        const transKey = t.category?.toString().trim().toLowerCase();
        return transKey === budgetKey;
      })
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);
    
    const limit = Number(budget.limit || 0);
    
    // Safety check: Avoid Division by Zero errors
    const calculatedPercent = limit > 0 ? (spentInCategory / limit) * 100 : 0;

    return {
      ...budget,
      spent: spentInCategory,
      remaining: limit - spentInCategory,
      // RECTIFICATION: We cap the UI progress at 100% so the bar doesn't overflow
      percentUsed: Math.min(calculatedPercent, 100),
      actualPercent: calculatedPercent // Keep the real number for labels
    };
  });

  // 4. Update UI State [cite: 2026-02-15]
  setBudgetList(updatedBudgets);
  
  // Update totals for the top summary cards
  const totalLimit = savedBudgets.reduce((acc, b) => acc + Number(b.limit || 0), 0);
  const totalSpentAcrossCategories = updatedBudgets.reduce((acc, b) => acc + b.spent, 0);
  
  setTotalBudgeted(totalLimit);
  setTotalSpent(totalSpentAcrossCategories);
};

  useEffect(() => {
    calculateBudgetProgress();
    window.addEventListener('balanceUpdated', calculateBudgetProgress);
    return () => window.removeEventListener('balanceUpdated', calculateBudgetProgress);
  }, []);

  const overallUsage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  // Smart Suggestion Logic [cite: 2026-01-09]
  const getSpendingStatus = () => {
    if (overallUsage > 100) return "You've exceeded your total budget! Time to cut back.";
    if (overallUsage > 80) return "Careful! You've used most of your budget for this month.";
    if (overallUsage > 50) return "You're halfway through. Keep tracking your small wins!";
    return "Great job! You're well within your limits so far.";
  };

  return (
    <div className="budgetContainer">
      <header className="budgetHeader">
        <div className="titleArea">
          <h1>Budget</h1>
          <p>Plan your spending, reach your goals</p>
        </div>
        <button className="addBudgetBtn">+ Set New Limit</button>
      </header>

      {/* Global Summary Card [cite: 2026-01-09] */}
      <div className="overallSummaryCard">
        <div className="summaryInfo">
          <div>
            <span>Total Monthly Spend</span>
            <h2>{totalSpent.toLocaleString()} / {totalBudgeted.toLocaleString()} <small>FCFA</small></h2>
            <p className="spendingStatusText">{getSpendingStatus()}</p>
          </div>
          <div className="usageBadge">{overallUsage}% Used</div>
        </div>
        <div className="globalProgressBarBase">
          <div 
            className="globalProgressBarFill" 
            style={{ width: `${Math.min(overallUsage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="budgetGrid">
        {budgetList.map((item, index) => (
          <div key={index} className="budgetCard">
            <div className="budgetInfo">
              <span className="categoryName">{item.category}</span>
              <span className="amountRatio">
                {item.spent.toLocaleString()} / <strong>{Number(item.limit).toLocaleString()} FCFA</strong>
              </span>
            </div>

            <div className="progressBarBase">
              <div 
                className={`progressBarFill ${item.percentUsed > 90 ? 'danger' : ''}`} 
                style={{ width: `${item.percentUsed}%` }}
              ></div>
            </div>

            <div className="budgetFooter">
              <span className="remainingText">
                {item.remaining >= 0 
                  ? `${item.remaining.toLocaleString()} Left` 
                  : `Over by ${(Math.abs(item.remaining)).toLocaleString()}`
                }
              </span>
              <span className="percentLabel">{Math.round(item.percentUsed)}% used</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budget;