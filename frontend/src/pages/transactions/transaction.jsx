import React, {useEffect, useMemo, useState } from 'react';
import TransactionTable from './transacTable';
import TransactionDrawer from './transacDrawer';
import './transac.css';
import {transactionHistory} from '../../assets/assets';

const Transactions = () => {

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('myTransactions');
    return saved ? JSON.parse(saved) : (transactionHistory || []);
  });
 // Declare data first!
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeType, setActiveType] = useState('expense');
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  

  const rowsPerPage = 9;

  // useMemo react hook mainly for  memorization and may be calculation but has to crosscheck ont that
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

  // Delete from table
 const handleDelete = (id) => {
  if (window.confirm("Delete this transaction?")) {
    // 1. Update the UI screen immediately
    const updatedData = data.filter(item => String(item.id) !== String(id));
    setData(updatedData);

    // 2. RECTIFICATION: Update the permanent storage [cite: 2026-02-15]
    localStorage.setItem('userTransactions', JSON.stringify(updatedData));

    // 3. RECTIFICATION: Tell the Budget page to shrink its bars [cite: 2026-02-15]
    window.dispatchEvent(new Event("balanceUpdated"));
    
    console.log("Transaction removed and Budget notified.");
  }
};

  // edit from table 
  const handleEdit = (item) => {
    setEditingItem(item);
    setActiveType(item.type || 'expense'); // Set type based on the item
    setIsDrawerOpen(true);
  };

  const handleSaveTransaction = (updatedFields) => {
  if (editingItem) {
    // 1. EDIT MODE: Find the old item and merge the new fields
    setData((prevData) =>
      prevData.map((item) =>
        item.id === editingItem.id ? { ...item, ...updatedFields } : item
      )
    );
  } else {
    // 2. ADD MODE: Create a completely new entry [cite: 2026-01-09]
    const newItem = {
      ...updatedFields,
      id: Date.now(), // Unique ID generation
    };
    setData((prevData) => [newItem, ...prevData]);
  }
  
  // Close and Cleanup
  setIsDrawerOpen(false);
  setEditingItem(null);
};

// 2. Auto-save to LocalStorage whenever 'data' changes [cite: 2026-01-09]
  useEffect(() => {
    localStorage.setItem('myTransactions', JSON.stringify(data));
  }, [data]);
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

        <div className="dateFilter">
          <input type="date" placeholder="From:" className="filterInput" />
          <input type="date" placeholder="To:" className="filterInput" />
        </div>
        {/*  absolutely needs to add the from and to as pacholders while keeping the date input type */}
      </div>
       
           {/*  the tabls section  */}
      <div className="tableWrapper">
        <TransactionTable transactions={currentRows} onDelete={handleDelete} onEdit={handleEdit}/>
      </div>

         {/*  the drawer form  */}
      <TransactionDrawer isOpen={isDrawerOpen} type={activeType} onSave ={handleSaveTransaction}
        editData={editingItem} onClose={() => setIsDrawerOpen(false)} 
        // Pass the item to the drawer for editing        
      />

      <div className="tableFooter">
        <p className="resultsCount">
          {showingCount} Out of {totalResults}
        </p>
        
        <div className="paginationControls">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}> Previous </button>
          <span className="pageNumber">{currentPage}</span>
          <button disabled={indexOfLastRow >= totalResults} onClick={() => setCurrentPage(prev => prev + 1)}> Next</button>
        </div>
      </div>
      
    </div>
  );
}

export default Transactions;
//  the order in declarinf ur fxns matters greatly
//  by using displayData as a usetate we simply use it to filter the status from the users
