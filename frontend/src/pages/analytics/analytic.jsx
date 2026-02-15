import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, AreaChart, Area, CartesianGrid 
} from 'recharts';
import './analytic.css';

const Analytics = () => {
  // --- STATE MANAGEMENT ---
  const [analyticsData, setAnalyticsData] = useState([]);
  const [activeChartType, setActiveChartType] = useState('bar'); 
  const [summaryStats, setSummaryStats] = useState({ income: 0, expenses: 0, savings: 0 });
  const [topCategory, setTopCategory] = useState({ name: '', value: 0, percentage: 0 });

  // UI Brand Colors
  const COLORS = ['#D9363E', '#2D31FA', '#1A1A1A', '#B35AB3'];

  // --- LOGIC ENGINE ---
  const refreshAnalytics = () => {
    const rawData = localStorage.getItem('userTransactions');
    
    if (rawData) {
      const transactions = JSON.parse(rawData);
      
      // 1. Filter and Calculate Totals
      const expenseList = transactions.filter(t => t.type === 'expense');
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
      const totalExpenses = expenseList.reduce((acc, t) => acc + Number(t.amount), 0);

      // 2. Group by Category
      const categoryMap = {};
      expenseList.forEach(t => {
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
      });

      // 3. Format & Sort (Biggest first for the list) 
      const formatted = Object.keys(categoryMap).map(cat => ({
        name: cat,
        value: categoryMap[cat],
        percentage: totalExpenses > 0 ? Math.round((categoryMap[cat] / totalExpenses) * 100) : 0
      })).sort((a, b) => b.value - a.value);

      setAnalyticsData(formatted);
      setSummaryStats({
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses
      });

      // 4. Set Smart Insight (The largest expense) 
      if (formatted.length > 0) {
        setTopCategory(formatted[0]);
      }
    }
  };

  useEffect(() => {
    refreshAnalytics();
    // Listen for updates from other parts of the app 
    window.addEventListener('balanceUpdated', refreshAnalytics);
    window.addEventListener('storage', refreshAnalytics);
    return () => {
      window.removeEventListener('balanceUpdated', refreshAnalytics);
      window.removeEventListener('storage', refreshAnalytics);
    };
  }, []);

  // --- CHART RENDERER ---
  const renderChart = () => {
    if (analyticsData.length === 0) return <div className="emptyState">No transaction data yet.</div>;

    switch (activeChartType) {
      case 'bar':
        return (
          <BarChart data={analyticsData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={analyticsData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5}>
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#2D31FA" fill="#2D31FA33" strokeWidth={3} />
          </AreaChart>
        );
      default: return null;
    }
  };

  return (
    <div className="analyticsContainer">
      <header className="analyticsHeader">
        <h1>Analytics</h1>
        <div className="chartSwitcher">
          <button onClick={() => setActiveChartType('bar')} className={activeChartType === 'bar' ? 'active' : ''}>Bar</button>
          <button onClick={() => setActiveChartType('pie')} className={activeChartType === 'pie' ? 'active' : ''}>Pie</button>
          <button onClick={() => setActiveChartType('area')} className={activeChartType === 'area' ? 'active' : ''}>Trend</button>
        </div>
      </header>

      {/* Top Cards Section */}
      <section className="statsGrid">
        <div className="statCard">
          <label>Income <span className="period">Monthly</span></label>
          <h3>{summaryStats.income.toLocaleString()}fcfa</h3>
        </div>
        <div className="statCard">
          <label>Expenses <span className="period">Monthly</span></label>
          <h3>{summaryStats.expenses.toLocaleString()}fcfa</h3>
        </div>
        <div className="statCard highlight">
          <label>Saving Rate</label>
          <h3>{summaryStats.savings.toLocaleString()}fcfa</h3>
        </div>
      </section>

      {/* Main Charts & Categories Section */}
      
      <section className="mainVisualSection">
        <div className="chartBox">
          <h3>Expenses Breakdown</h3>
          <div className="chartHarness">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="categoriesBox">
          <h3>Top Spending Categories</h3>
          <div className="categoryListItems">
            {analyticsData.map((item, index) => (
              <div key={index} className="categoryRowItem">
                <span className="dot" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                <span className="categoryLabel">{item.name}</span>
                <span className="categoryValue">{item.value.toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Insights Section [cite: 2026-01-09] */}
      <section className="insightsBox">
        <h3>Spending Insights</h3>
        {topCategory.name ? (
          <div className="insightCard">
            <h4>{topCategory.name} costs are your largest expenses</h4>
            <p>This month you have spent more on {topCategory.name} ({topCategory.percentage}% of total expenses).</p>
          </div>
        ) : (
          <div className="insightCard">
            <p>Add some expenses to generate smart insights!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Analytics;
