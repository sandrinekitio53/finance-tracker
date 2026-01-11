import React, { useMemo, useState } from 'react';
import TransactionTable from './transacTable';
import TransactionDrawer from './transacDrawer';
import './transac.css';
import {transactionHistory} from '../../assets/assets';

const Transactions = () => {
const [data, setData] = useState(transactionHistory || []); // Declare data first!
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeType, setActiveType] = useState('expense');
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const rowsPerPage = 9;

  // useMemo react hook for the calsulation and memoristion
  const filteredTransactions = useMemo(() => {
    
    return (data || []).filter(item => {
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchMethod = methodFilter === 'All' || item.method === methodFilter;
      return matchStatus && matchCategory && matchMethod;
    });
  }, [statusFilter, categoryFilter, methodFilter, data]);

  // pageup and down calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalResults = filteredTransactions.length;
  const showingCount = currentRows.length;

  //  helping fxns 
  const openDrawer = (type) => {
    setEditingItem(null); //to reset the  edit mode
    setActiveType(type);
    setIsDrawerOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveType(item.type || 'expense'); // Set type based on the item
    setIsDrawerOpen(true);
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
          <option value="All">Statues: All</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <select className="filterDropdown" onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">Category: All</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Internet">Internet</option>
        </select>

        <select className="filterDropdown" onChange={(e) => setMethodFilter(e.target.value)}>
          <option value="All">Account: All</option>
          <option value="Cash in Hand">Cash in Hand</option>
          <option value="MTN Momo">MTN Momo</option>
          <option value="OM">OM</option>
        </select>
      </div>
        <div className="dateFilter">
          <input type="text" placeholder="From:" className="filterInput" />
          <input type="text" placeholder="To:" className="filterInput" />
        </div>
{/*  the tabls section  */}
      <div className="tableWrapper">
        <TransactionTable transactions={currentRows} onDelete={handleDelete} 
        onEdit={handleEdit}/>
      </div>
      {/*  the drawer form  */}
            <TransactionDrawer 
        isOpen={isDrawerOpen} 
        type={activeType} 
        editData={editingItem} // Pass the item to the drawer for editing
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
          >
            Previous
          </button>
          <span className="pageNumber">{currentPage}</span>
          <button 
            disabled={indexOfLastRow >= totalResults} 
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      
    </div>
  );
}

export default Transactions;
//  the order in declarinf ur fxns matters greatly
//  by using displayData as a usetate we simply use it to filter the status from the users
