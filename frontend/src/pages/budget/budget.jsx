import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, AlertCircle, X,TrendingUp,Loader2, Target, Trash2 } from 'lucide-react';
import './budget.css';
import { CATEGORIES } from '../../assets/assets';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthName = (monthString) => {
  const [year, month] = monthString.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('default', { month: 'long' });
};

const Budgets = ({ user }) => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth] = useState(getCurrentMonth());  

  const fetchBudgets = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8081/api/budgets/${user.id}/${currentMonth}`);
      setBudgets(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, currentMonth]);

  useEffect(() => {
    fetchBudgets();
    window.addEventListener('balanceUpdated', fetchBudgets);
    return () => window.removeEventListener('balanceUpdated', fetchBudgets);
  }, [fetchBudgets]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await axios.post('http://localhost:8081/api/add-budget', {
        userId: user.id,
        category: formData.get('category'),
        limitAmount: Number(formData.get('limit')),
        month: currentMonth
      });
      setShowForm(false);
      fetchBudgets();
    } catch (error) { console.error("Dashboard Sync or duplicate data enetery Error:", error); }
  };

  const deleteBudget = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    await axios.delete(`http://localhost:8081/api/delete-budget/${id}`);
    fetchBudgets();
  };

  useEffect(() => {
  // Check for new transactions every 10 seconds if a payment is pending
  const interval = setInterval(() => {
    fetchBudgets(); 
  }, 10000); 
// retrun in useEffect is used to clean code b4 next re-rendering || refresh
  return () => clearInterval(interval);
}, [fetchBudgets]);

  const totalLimit = budgets.reduce((sum, b) => sum + Number(b.limit_amount), 0);
const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
const totalRemaining = totalLimit - totalSpent;
const totalPercent = totalLimit > 0 ? Math.min((totalSpent / totalLimit) * 100, 100) : 0;

  return (
    <div className="budgetContainer">
      <header className="Bheader">
        <div>
          <h1>Budget Goals</h1>
          <p>{getMonthName(currentMonth)} 2026</p>
        </div>
        <button onClick={() => setShowForm(true)} className="addBtn">
          <Plus size={20} /> Set Goal
        </button>
      </header>

      <section className="budget-overview-card">
      <div className="overview-main">
        <div className="stat-item">
          <span className="stat-label">Total Monthly Budget</span>
          <h2 className="stat-value">{formatCurrency(totalLimit)}</h2>
        </div>
        <div className="overview-chart-mini">
           <div className="circular-progress" style={{ '--percent': totalPercent }}>
              <span>{totalPercent.toFixed(0)}%</span>
           </div>
        </div>
      </div>
      
      <div className="overview-footer">
        <div className="footer-stat">
          <span className="text-muted">Spent</span>
          <span className="text-danger">{formatCurrency(totalSpent)}</span>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-stat">
          <span className="text-muted">Remaining</span>
          <span className="text-success">{formatCurrency(totalRemaining)}</span>
        </div>
      </div>
    </section>

      {isLoading ? (
        <div className="loader-box"><Loader2 className="spin" /></div>
      ) : budgets.length > 0 ? (
        <div className="budgetGrid">
          {budgets.map(b => {
            const spent = Number(b.spent || 0);
            const limit = Number(b.limit_amount);
            const ratio = Math.min((spent / limit) * 100, 100);
            
            return (
              <div key={b.id} className={`budgetCard ${ratio >= 100 ? 'over' : ''}`}>
                <div className="card-header">
                  <span className="cat-badge">{b.category}</span>
                  <button onClick={() => deleteBudget(b.id)} className="trash-btn"><Trash2 size={16}/></button>
                </div>
                <div className="amount-row">
                  <span className="spent-val">{formatCurrency(spent)}</span>
                  <span className="limit-val">of {formatCurrency(limit)}</span>
                </div>
                <div className="progress-harness">
                  <div className="progress-fill" style={{ width: `${ratio}%`, background: ratio > 90 ? '#ef4444' : '#2D31FA' }} />
                </div>
                <div className="card-footer">
                  <span>{ratio.toFixed(0)}% used</span>
                  {ratio >= 100 && <span className="warning-text"><AlertCircle size={14}/> Limit Reached</span>}
                </div>
              </div>
            );
          })}
        </div>
      ): (
//  shld in casse there is No budget present 
    <div className="empty-state-container">
      <div className="empty-icon-box">
         <TrendingUp size={48} className="icon-light" />
      </div>
      <p>No budgets set for this month</p>
      <button onClick={() => setShowForm(true)} className="btn-set-first">
        <Plus size={18} /> Set Your First Budget
      </button>
    </div>
  )}

      {showForm && (
        <div className="modal-overlay">
          <form onSubmit={handleAddBudget} className="vibe-form">
            <h2><Target size={20}/> New Budget Goal</h2>
            <select name="category" required>
              <option value="">Select Category</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <input name="limit" type="number" placeholder="Monthly Limit (FCFA)" required />
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="confirmBtn">Confirm</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Budgets;