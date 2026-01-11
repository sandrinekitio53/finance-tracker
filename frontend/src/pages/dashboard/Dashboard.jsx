import React from 'react';
import './dashboard.css';
import { Icons, summaryCardDetails } from '../../assets/assets';

const Dashboard = ({ user }) => {
  // 1. Debugging: Check if data is arriving
  console.log("Dashboard User Data:", user);
  console.log("Card Config:", summaryCardDetails);

  const currency = "FCFA";

  // 2. Safety Check: If config is missing, show an error message instead of crashing
  if (!summaryCardDetails || !Array.isArray(summaryCardDetails)) {
    return <div style={{padding: '20px', color: 'red'}}>Error: summaryCardDetails not found in assets.js</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="filter-box">
          {/* Safety check for the icon */}
          {Icons?.Calendar && <Icons.Calendar className="calendar-icon" />}
          <select className="time-select">
            <option>This Year</option>
            <option>This Month</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      <div className="summary-grid">
        {summaryCardDetails.map((card) => {
          // Mapping data logic
          let amount = 0;
          let change = 0;

          if (card.id === "balance") { amount = user?.total_balance || 0; change = 2.5; }
          else if (card.id === "income") { amount = user?.monthly_income || 0; change = 10; }
          else if (card.id === "expenses") { amount = 0; change = -5; }
          else if (card.id === "savings") { amount = user?.total_balance || 0; change = 0; }

          const isPositive = change > 0; // for expenses a decrease is goood
          const isNegative = change < 0; // for everything else an increase is good
          const isGoodNews = card.id === "expenses" ? isNegative : isPositive;
          
          const trendClass = isGoodNews ? "trend-up" : "trend-down";
          
          // Safety Icon Selection
          const TrendIcon = isPositive ? Icons?.ArrowUp : Icons?.ArrowDown;

          return (
            <div className="summary-card" key={card.id}>
       <div className="card-top-row">
      <span className="card-label">{card.label}</span>
    </div>

    {/* Middle: Large Amount */}
    <div className="card-body">
      <h2 className={`card-amount ${card.id === 'expenses' && amount > 0 ? 'text-danger' : ''}`}>
        {Number(amount).toLocaleString()} 
        <span className="currency-symbol">{currency}</span>
      </h2>
    </div>

    {/* Bottom: Opposite alignment of Detail and Percentage */}
    <div className="card-footer">      
      {change !== 0 && (
        <div className={`trend-pill ${trendClass}`}>
          {TrendIcon && <TrendIcon className="trend-icon" />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
       <span className="card-detail-text">{card.detail}</span>
    </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;