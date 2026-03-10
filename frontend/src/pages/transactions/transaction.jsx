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

  const rowsPerPage = 9;
  const API_BASE_URL = "http://localhost:8081";

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

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalResults = filteredTransactions.length;
  const showingCount = currentRows.length;

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

        {/* <div className="dateFilter">
          <input type="date" className="filterInput" />
          <input type="date" className="filterInput" />
        </div> */}
      </div>
        
      <div className="tableWrapper">
        <TransactionTable 
          transactions={currentRows} 
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
          {showingCount} Out of {totalResults}
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

