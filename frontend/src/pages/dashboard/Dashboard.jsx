import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './dashboard.css';
import { Icons, summaryCardDetails } from '../../assets/assets';
import { Plus, ArrowDownCircle, ArrowUpCircle, Target, X } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [liveStats, setLiveStats] = useState({ balance: 0, income: 0, expenses: 0, savings: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [goalsProgress, setGoalsProgress] = useState([]);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState(""); // "income", "expense", or "goal"
  const [formData, setFormData] = useState({ title: "", amount: "", category: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [transRes, goalsRes] = await Promise.all([
        axios.get(`http://localhost:8081/api-transactions/${user.id}`, { withCredentials: true }),
        axios.get(`http://localhost:8081/api-goals/${user.id}`, { withCredentials: true })
      ]);

      const transactions = transRes.data;
      const goals = goalsRes.data;
      // to calaculate the state data
      let totalIncome = 0;
      let totalExpenses = 0;
      transactions.forEach(item => {
        const amt = Number(item.amount || 0);
        if (item.type?.toLowerCase() === 'income') totalIncome += amt;
        else if (item.type?.toLowerCase() === 'expense') totalExpenses += amt;
      });
      // Update the liveStats state as user updates inforamtion
      setLiveStats({
        income: totalIncome, expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
        savings: goals.reduce((acc, g) => acc + Number(g.current_saved || 0), 0)
      });

      setRecentTransactions(transactions.slice(0, 5));
      setGoalsProgress(goals);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

const formatTransactionDate = (dateString) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  const options = {
    day: '2-digit',  month: 'short',
    // month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  };
  const formatted = new Intl.DateTimeFormat('en-GB', options).format(date);// date can be in en-US
  return formatted.replace(',', ' |'); 
};
 const firstInitial = user?.firstName?.charAt(0).toUpperCase() || "";
  const lastName = user?.lastName || "";
  const formattedName = firstInitial ? `${firstInitial}.${lastName}` : "User";
  const currency = "FCFA";

 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const executeAction = async (e) => {
  e.preventDefault();  
  if (!user?.id) {
    console.error("Critical Error: No user ID found in props.", user);
    return;
  }
  const isGoal = formType === 'goal';
  const endpoint = isGoal 
    ? 'http://localhost:8081/api-goals/add' 
    : 'http://localhost:8081/api-add-transaction';

   const payload = isGoal ? {
    userId: user.id,  title: formData.title || "New Goal",
    amount: Number(formData.amount), saved: 0,
    date: new Date().toISOString().split('T')[0]
  } : {
    user_id: user.id, amount: Number(formData.amount),
    type: formType,  category: formData.category || "General",
    status: 'Complete', method: 'Cash in Hand',
    date: new Date().toISOString().split('T')[0], title: formData.category 
  };

  try {
    const response = await axios.post(endpoint, payload);
    if (response.status === 200 || response.status === 201) {
      setIsModalOpen(false);
      setFormData({ title: "", amount: "", category: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      fetchDashboardData(); 
    }
  } catch (err) {
    console.error("Database Sync Failed:", err.response?.data || err.message);
  }
};
  const openActionModal = (type) => {
    setFormType(type);
    setIsModalOpen(true);
    setIsActionsOpen(false);
  };

  return (
    <div className="dashboard-container">
      <header className="contentHeader" >
        <div className="headerWelcome">
          <h1 className="title">Welcome, { formattedName }</h1>
          <p className="subtitle">Here's what's happening with your money today.</p>
        </div>
        <div className="headerActions">
          <div className="userProfileBox" onClick={() => window.location.href='profile'} style={{cursor: 'pointer'}}>
            <div className="profilePic" 
              style={{ backgroundColor: user?.profile_bg_color || '#6366f1' }}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" className="profileImg"/>
              ) : (
                <span className="initialText">{firstInitial}</span>
              )}
            </div>
            <div className="userInfo">
              <span className="userName">{formattedName}</span>
              <span className="userEmail">{user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="summaryGrid">
        {summaryCardDetails.map((card) => {
        const amount = liveStats[card.id] || 0;
        const isNegativeBalance = card.id === "balance" && amount < 0;
        const isPositiveTrend = card.id === 'income' || (card.id === 'balance' && amount > 0);
        const TrendIcon = isPositiveTrend ? Icons.ArrowUp : Icons.ArrowDown;
        const trendClass = isPositiveTrend ? 'trendUp' : 'trendDown';

        const totalActivity = liveStats.income + liveStats.expenses;
        const percentage = totalActivity > 0 ? Math.round((amount / totalActivity) * 100) : 0;
          return (
            <div className={`summaryCard ${isNegativeBalance ? 'negativeAlert' : ''}`} key={card.id}>
              <div className="cardHeader">
                <span className="cardLabel">{card.label}</span>
                {isNegativeBalance && <span className="warningBadge">Overspent</span>}
              </div>
              <div className="card-body">
                <h2 className={`cardAmount ${isNegativeBalance ? 'text-danger' : ''}`}>
                  {amount.toLocaleString()} <span className="currency-symbol">{currency}</span>
                </h2>
              </div>
              <div className="cardFooter">
                <span className="cardDetailText">
                  {isNegativeBalance ? "Warning: Expenses exceed income!" : card.detail}
                </span>
                <div className={`trend-indicator ${trendClass}`}>
                  <TrendIcon size={14} className="trendIcon" />
                  <span>{percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-main-content">
       {showSuccess && (
          <div className="success-toast">
          <div className="check-circle">✓</div>
          <span>Vault Synchronized Successfully!</span>
      </div>)}
        <section className="dashboard-section">
          <h3>Recent Activity</h3>
          <div className="transactions-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="tx-item">
                <div className="tx-info">
                  <span className="tx-name">{tx.title}</span>
                  <span className="tx-date">{formatTransactionDate(tx.date)}</span>
                </div>
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{Number(tx.amount).toLocaleString()} {currency}
                </span>
              </div>
            ))}
          </div>
        </section>

                {/* Goal Display */}
        <section className="dashboard-section">
          <h3>Goal Progress</h3>
          <div className="goals-mini-list">
            {goalsProgress.map((goal) => {
              const target = goal.target_amount || 1;
              const saved = goal.current_saved || 0;
              const percent = Math.min(Math.round((saved / target) * 100), 100);
              return (
                <div key={goal.id} className="goal-mini-card">
                  <div className="goal-label-row">
                    <span>{goal.title}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mini-progress-bar">
                    <div className="mini-progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      {/* Quick action part logic expense, income, goal*/}
{isModalOpen && (
  <div className="mogul-modal-overlay">
    <div className="mogul-modal">
      <div className="modal-header">
        <h3 className="modal-title">New {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
        <X onClick={() => setIsModalOpen(false)} className="close-btn" />
      </div>      
      <form onSubmit={executeAction} className="mogul-form-layout">
        <div className="input-field-group">
          <label className="mogul-label">
            {formType === 'goal' ? "Goal Mission Name" : "Transaction Category"}
          </label>
          <input type="text" name={formType === 'goal' ? "title" : "category"} 
            placeholder={formType === 'goal' ? "e.g., Wifi Box" : "e.g., Salary, Snack"}
            value={formType === 'goal' ? formData.title : formData.category}
            onChange={handleInputChange}   required 
          />
        </div>

        <div className="input-field-group">
          <label className="mogul-label">
            {formType === 'goal' ? "Target Savings (FCFA)" : "Amount (FCFA)"}
          </label>
          <input type="number" name="amount" placeholder="0.00" 
            value={formData.amount} onChange={handleInputChange}  required 
          />
        </div>

        <button type="submit" className={`mogul-submit-btn ${formType}`}>
          confirm
        </button>
      </form>
    </div>
  </div>
)}
    {/*         QUICK ACTIONS       */}
     <div className={`quick-actions-wrapper ${isActionsOpen ? 'open' : ''}`}>
        <div className="actions-menu">
          <button className="action-item income" onClick={() => openActionModal('income')}>
            <ArrowDownCircle size={20} /> <span>Add Income</span>
          </button>
         <button className="action-item expense" onClick={() => openActionModal('expense')}>
            <ArrowUpCircle size={20} /> <span>Add Expense</span>
          </button>
          <button className="action-item goal" onClick={() => openActionModal('goal')}>
            <Target size={20} /> <span>New Goal</span>
          </button>
        </div>
        <button className="main-fab" 
          onClick={() => setIsActionsOpen(!isActionsOpen)} title="Quick Actions">
          {isActionsOpen ? <X size={28} /> : <Plus size={28} />}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
//  - window.location.href='profile' will locate the image updated from the profile page
//  - Promise.all is used to fetch bith the transac and goals at the same time instead of waiting for one to finish b4 the other
// - amount = user?.total_balance is getting the total_balnace of the user from the db
//  a decrease in the expenditures that u make is  a good choice 
// - if the trendicon is up meanig there is a decrease in the good and it will show a green color esle it  is a red color and the arrow willbe turned up
// the formatedate for feb put short for february put long 
// -month: 'short', // 'short' gives 'Feb', 'long' gives 'February'