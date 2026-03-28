import React, { useEffect, useMemo, useState } from 'react';
import TransactionTable from './transacTable';
import TransactionDrawer from './transacDrawer';
import './transac.css';

const Transactions = ({ user }) => {
  //  main Data State fetched from the db
  const [data, setData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeType, setActiveType] = useState('expense');
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [timeframeFilter, setTimeframeFilter] = useState('All'); // 'Month', 'Day', 'Year', 'All'

  const rowsPerPage = 9;
  const API_BASE_URL = "http://localhost:8081";

const handleAutomatedSync = async () => {
    const rawPhone = window.prompt("Enter phone (237xxxxxxxxx):");
    const rawAmount = window.prompt("Enter Amount:");

    if (!rawPhone || !rawAmount) return;

    const sanitizedAmount = Number(rawAmount); 
    const sanitizedPhone = rawPhone.trim().replace(/\+/g, ''); 

    try {
        const response = await fetch(`${API_BASE_URL}/api/collect-automated`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id, 
                phoneNumber: sanitizedPhone,
                amount: sanitizedAmount 
            })
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        alert("Vault Sync Active! Confirm the prompt on your phone.");
        
        setTimeout(() => {
            fetchTransactions(); 
            window.dispatchEvent(new Event("balanceUpdated"));
        }, 15000); 

    } catch (err) {
        console.error("Sync Error Details:", err.message);
        alert("Sync Failed: " + err.message);
    }
};
//  gets data from user based on the database 
  const fetchTransactions = async () => {
    if (!user?.id) {
      console.warn("Transactions: No User ID found. Ensure login is successful.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api-transactions/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Backend Connection Error:", err);
    }
  };

  // Sync with backend on component mount or user change
  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  
  
  const filteredTransactions = useMemo(() => {
    return (data || []).filter(item => {
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchMethod = methodFilter === 'All' || item.method === methodFilter;
      return matchStatus && matchCategory && matchMethod;
    });
  }, [statusFilter, categoryFilter, methodFilter, data]);

  // Group transactions by timeframe (Day, Month, Year, or All)
  const groupedTransactions = useMemo(() => {
    const grouped = {};
    
    filteredTransactions.forEach(item => {
      let key = '';
      
      if (timeframeFilter === 'All') {
        key = 'All Transactions';
      } else {
        // Parse date - handle both ISO format and other formats
        let date;
        if (typeof item.date === 'string') {
          date = new Date(item.date);
        } else {
          date = new Date();
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date for item:', item);
          return;
        }
        
        if (timeframeFilter === 'Day') {
          key = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (timeframeFilter === 'Month') {
          key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        } else if (timeframeFilter === 'Year') {
          key = date.getFullYear().toString();
        }
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    
    console.log('Grouped transactions:', grouped, 'Timeframe:', timeframeFilter);
    
    // Sort groups by date (newest first)
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      if (timeframeFilter === 'All') return 0; // Keep natural order for 'All'
      const dateA = new Date(grouped[a][0].date);
      const dateB = new Date(grouped[b][0].date);
      return dateB - dateA;
    });
    
    const result = sortedGroups.map(key => ({
      period: key,
      transactions: grouped[key]
    }));
    
    console.log('Final grouped result:', result);
    return result;
  }, [filteredTransactions, timeframeFilter]);

  // Flatten grouped transactions for pagination
  const flattenedTransactions = useMemo(() => {
    return groupedTransactions.reduce((flat, group) => {
      return [...flat, ...group.transactions];
    }, []);
  }, [groupedTransactions]);

  // Pagination calculations - paginate flattened transactions
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedTransactions = flattenedTransactions.slice(indexOfFirstRow, indexOfLastRow);
  
  // Re-group the paginated transactions for display
  const currentRows = useMemo(() => {
    const grouped = {};
    
    paginatedTransactions.forEach(item => {
      let key = '';
      
      if (timeframeFilter === 'All') {
        key = 'All Transactions';
      } else {
        let date;
        if (typeof item.date === 'string') {
          date = new Date(item.date);
        } else {
          date = new Date();
        }
        
        if (timeframeFilter === 'Day') {
          key = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        } else if (timeframeFilter === 'Month') {
          key = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        } else if (timeframeFilter === 'Year') {
          key = date.getFullYear().toString();
        }
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    
    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      if (timeframeFilter === 'All') return 0;
      const dateA = new Date(grouped[a][0].date);
      const dateB = new Date(grouped[b][0].date);
      return dateB - dateA;
    });
    
    return sortedGroups.map(key => ({
      period: key,
      transactions: grouped[key]
    }));
  }, [paginatedTransactions, timeframeFilter]);
  
  const totalResults = flattenedTransactions.length;
  const showingCount = paginatedTransactions.length;

  const openDrawer = (type) => {
    setEditingItem(null);
    setActiveType(type);
    setIsDrawerOpen(true);
  };
// delete from dtabse
  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction permanently from the database?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api-delete-transaction/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh data from server to ensure UI matches Database
          fetchTransactions();         
          window.dispatchEvent(new Event("balanceUpdated"));
        }
      } catch (err) {
        console.error("Delete Operation Failed:", err);
      }
    }
  };

  
  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveType(item.type || 'expense');
    setIsDrawerOpen(true);
  };

  // sucess callback from drawer
  const handleSaveSuccess = () => {
    fetchTransactions();
    setIsDrawerOpen(false);
    setEditingItem(null);
    window.dispatchEvent(new Event("balanceUpdated"));
  };

  return (
    <div className="transactionsContainer">
      <div className="transactionsHeader">
        <h1 className="pageTitle">Transactions</h1>
        <div className="actionButtons">
          <button className="addBtn syncBtn" onClick={handleAutomatedSync} style={{ backgroundColor: '#0f172a', color: 'white' }}>
        Auto-Sync MoMo
    </button>
          <button className="addBtn incomeBtn" onClick={() => openDrawer('income')}>
            Add Income
          </button>
          <button className="addBtn expenseBtn" onClick={() => openDrawer('expense')}>
            Add Expenses
          </button>
        </div>
      </div>

      <div className="filterSection">
        <select className="filterDropdown" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <select className="filterDropdown" onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">Category: All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Internet">Internet</option>
          <option value="Salary">Salary</option>
        </select>

        <select className="filterDropdown" onChange={(e) => setMethodFilter(e.target.value)}>
          <option value="All">Account: All</option>
          <option value="Cash in Hand">Cash in Hand</option>
          <option value="MTN Momo">MTN Momo</option>
          <option value="OM">OM</option>
        </select>

        <select className="filterDropdown" onChange={(e) => setTimeframeFilter(e.target.value)}>
          <option value="All">Show All</option>
          <option value="Month">Group By: Month</option>
          <option value="Day">Group By: Day</option>
          <option value="Year">Group By: Year</option>
        </select>

        {/* <div className="dateFilter">
          <input type="date" className="filterInput" />
          <input type="date" className="filterInput" />
        </div> */}
      </div>
        
      <div className="tableWrapper">
        <TransactionTable 
          groupedTransactions={currentRows} 
          onDelete={handleDelete} 
          onEdit={handleEdit}
          isMobile={window.innerWidth <= 768}
        />
      </div>

      <TransactionDrawer 
        isOpen={isDrawerOpen} 
        type={activeType} 
        userId={user?.id}
        editData={editingItem} 
        onSave={handleSaveSuccess}
        onClose={() => setIsDrawerOpen(false)} 
      />

      <div className="tableFooter">
        <p className="resultsCount">
          Showing {showingCount} of {totalResults} Transactions
        </p>
        
        <div className="paginationControls">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
          > Previous </button>
          <span className="pageNumber">{currentPage}</span>
          <button 
            disabled={indexOfLastRow >= totalResults} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          > Next </button>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
// windows.dispatchevent is used to alert all the pages of the app in casw of any changes 
//  the order in declarinf ur fxns matters greatly
//  by using displayData as a usetate we simply use it to filter the status from the users
//  -usage of localstorage to store dynamic data on the webserver and not the compuetr memory
// cus i had issues of filling informations on my table and once refresh the data wasnot stored inthe webserver but in the ram so the stored data was static 

