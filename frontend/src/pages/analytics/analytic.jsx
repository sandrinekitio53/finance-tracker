import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis,
  PieChart, Pie, AreaChart, Area, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './analytic.css';

// Pass the user object as a prop to get the user_id [cite: 2026-02-16]
const Analytics = ({ user }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [activeChartType, setActiveChartType] = useState('bar'); 
  const [summaryStats, setSummaryStats] = useState({ income: 0, expenses: 0, savings: 0 });
  const [topCategory, setTopCategory] = useState({ name: '', value: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = ['#D9363E', '#2D31FA', '#1A1A1A', '#B35AB3', '#8B5CF6'];
  const fetchAnalyticsFromDb = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {

      const response = await axios.get(`http://localhost:8081/api-transactions/${user.id}`, { withCredentials: true });
      const transactions = response.data;
      
      if (transactions && transactions.length > 0) {
        // Filter and calc totals using DB data
        const expenseList = transactions.filter(t => t.type === 'expense');
        const incomeList = transactions.filter(t => t.type === 'income');
        
        const totalIncome = incomeList.reduce((acc, t) => acc + Number(t.amount), 0);
        const totalExpenses = expenseList.reduce((acc, t) => acc + Number(t.amount), 0);

        // Group by category for charts
        const categoryMap = {};
        expenseList.forEach(t => {
          const cat = t.category || "Other";
          categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
        });

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

        if (formatted.length > 0) {
          setTopCategory(formatted[0]);
        }
      }
    } catch (error) {
      console.error("❌ Analytics DB Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAnalyticsFromDb();
    
    // Listen for global updates (like when you save in the Drawer) 
    window.addEventListener('balanceUpdated', fetchAnalyticsFromDb);
    return () => window.removeEventListener('balanceUpdated', fetchAnalyticsFromDb);
  }, [fetchAnalyticsFromDb]);

  // Custom Tooltip component for a youthful vibe
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip-vibe">
          <p className="label">{`${payload[0].payload.name || payload[0].name}`}</p>
          <p className="value">{`${payload[0].value.toLocaleString()} FCFA`}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (isLoading) return <div className="emptyState">Syncing with database...</div>;
    if (analyticsData.length === 0) return <div className="emptyState">No transaction data found in DB.</div>;

    switch (activeChartType) {
      case 'bar':
        return (
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie 
              data={analyticsData} 
              dataKey="value" 
              cx="50%" cy="50%" 
              innerRadius={0} 
              outerRadius={110} 
              paddingAngle={2} 
              labelLine={false}
              stroke="none"
            >
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart data={analyticsData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D31FA" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2D31FA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#2D31FA" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} hide />
            <Radar name="Expenses" dataKey="value" stroke="#2D31FA" fill="#2D31FA" fillOpacity={0.5} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        );
      case 'scatter':
        return (
          <ScatterChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="value" unit="fcfa" />
            <ZAxis type="number" range={[64, 144]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter name="Expenses" data={analyticsData}>
              {analyticsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        );
      default: return null;
    }
  };

  return (
    <div className="analyticsContainer">
      <header className="analyticsHeader">
        <h1>Analytics</h1>
        <div className="chartSwitcher">
          {['bar', 'pie', 'area', 'radar', 'scatter'].map((type) => (
            <button 
              key={type}
              onClick={() => setActiveChartType(type)} 
              className={activeChartType === type ? 'active' : ''}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <section className="statsGrid">
        <div className="statCard">
          <label>Income <span className="period">Total</span></label>
          <h3>{summaryStats.income.toLocaleString()} FCFA</h3>
        </div>
        <div className="statCard">
          <label>Expenses <span className="period">Total</span></label>
          <h3>{summaryStats.expenses.toLocaleString()} FCFA</h3>
        </div>
        <div className="statCard highlight">
          <label>Savings</label>
          <h3>{summaryStats.savings.toLocaleString()} FCFA</h3>
        </div>
      </section>

      <section className="mainVisualSection">
        <div className="chartBox">
          <h3>Expense Distribution</h3>
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
      
      <section className="insightsBox">
        <h3>Spending Insights</h3>
        {topCategory.name ? (
          <div className="insightCard">
        {/*  this insight card should be able of just  showing the 3 bigeest spendings made */}
            <h4><span>{topCategory.name}</span> is your biggest expense</h4>
            <p>This category accounts for {topCategory.percentage}% of your total spending. Consider reviewing your {topCategory.name} habits!</p>
          </div>
        ) : (
          <div className="insightCard"><p>Start tracking to see insights.</p></div>
        )}
      </section>
    </div>
  );
};

export default Analytics;