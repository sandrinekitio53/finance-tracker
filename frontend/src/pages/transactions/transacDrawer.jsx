import React, { useState, useEffect } from "react";
import "./transac.css";

/**
 * AI Version: TransactionDrawer
 * Purpose: Handles both creation and editing of transactions with 
 * automatic synchronization to the Budget and Analytics modules.
 */
const TransactionDrawer = ({ isOpen, onClose, type, editData, onSave }) => {
  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().slice(0, 16),
    category: "",
    paymentMethod: "",
    amount: "",
    status: "Complete",
  });

  // Predefined categories to help the user match Budget limits
  const categorySuggestions = type === "income"
    ? ["Salary", "Gift", "Business", "Freelance"]
    : ["Transport", "Food", "Internet", "Rent", "Photocopies", "Shopping"];

  const methodSuggestions = ["Cash in Hand", "MTN Momo", "Orange Money", "Bank Card"];
  const statusSuggestions = ["Complete", "Pending", "Failed"];

  // Effect: Load data for editing or reset for new entries
  useEffect(() => {
    if (editData) {
      setFormData({
        transactionDate: editData.date || new Date().toISOString().slice(0, 16),
        category: editData.category || "",
        paymentMethod: editData.method || "",
        amount: editData.amount || "",
        status: editData.status || "Complete",
      });
    } else {
      setFormData({
        transactionDate: new Date().toISOString().slice(0, 16),
        category: categorySuggestions[0], // Default to first suggestion
        paymentMethod: methodSuggestions[0],
        amount: "",
        status: "Complete",
      });
    }
  }, [editData, isOpen, type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * RECTIFICATION: Form Submission Logic
   * Ensures data is formatted correctly for the Budget calculation engine.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      id: editData ? editData.id : Date.now(),
      date: formData.transactionDate,
      category: formData.category.trim(), // Trim to prevent matching errors
      method: formData.paymentMethod,
      amount: Number(formData.amount),
      status: formData.status,
      type: type, // 'income' or 'expense'
    };

    const existingTransactions = JSON.parse(localStorage.getItem("userTransactions") || "[]");

    let updatedTransactions;
    if (editData) {
      updatedTransactions = existingTransactions.map((t) =>
        t.id === editData.id ? finalData : t
      );
    } else {
      updatedTransactions = [finalData, ...existingTransactions];
    }

    localStorage.setItem("userTransactions", JSON.stringify(updatedTransactions));

    // RECTIFICATION: Global Event Trigger
    // This wakes up the 'Budget' and 'Analytics' pages to show the new data.
    window.dispatchEvent(new Event("balanceUpdated"));

    if (onSave) onSave(finalData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`drawerOverlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="drawerContent" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <h2>{editData ? "Edit" : "Add"} {type === "income" ? "Income" : "Expense"}</h2>
          <button onClick={onClose} className="closeButton">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="drawerForm">
          <div className="formGroup formAmt">
            <label>Amount (frs)</label>
            <input
              name="amount"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="formGroup">
            <label>Date & Time</label>
            <input
              name="transactionDate"
              type="datetime-local"
              value={formData.transactionDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="formGroup">
            <label>Category</label>
            <input
              name="category"
              list="categoryOptions"
              value={formData.category}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Select or type category"
            />
            <datalist id="categoryOptions">
              {categorySuggestions.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="formGroup">
            <label>Method</label>
            <input
              name="paymentMethod"
              list="methodOptions"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            />
            <datalist id="methodOptions">
              {methodSuggestions.map((met) => (
                <option key={met} value={met} />
              ))}
            </datalist>
          </div>

          <div className="formGroup">
            <label>Status</label>
            <input
              name="status"
              list="statusOptions"
              value={formData.status}
              onChange={handleInputChange}
            />
            <datalist id="statusOptions">
              {statusSuggestions.map((stat) => (
                <option key={stat} value={stat} />
              ))}
            </datalist>
          </div>

          <button type="submit" className={`submitButton ${type}`}>
            Confirm {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionDrawer;
// window.dispatchEvent; Shout to the app that the balance has changed!