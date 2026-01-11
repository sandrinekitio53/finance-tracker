import React, { useState, useEffect } from "react";
import "./transac.css";

const TransactionDrawer = ({ isOpen, onClose, type, editData }) => {

  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().slice(0, 16),
    category: "",
    paymentMethod: "",
    amount: "",
    status: "Complete",
  });


  // if the edit exist add it in the form
  useEffect(() => {
    if (editData) {
      setFormData({
        transactionDate: editData.date || new Date().toISOString().slice(0, 16),
        category: editData.category || '',
        paymentMethod: editData.method || '',
        amount: editData.amount || '',
        status: editData.status || 'Complete'
      });
    } else {
      // Reset to default for "Add Mode"
      setFormData({
        transactionDate: new Date().toISOString().slice(0, 16),
        category: '',
        paymentMethod: '',
        amount: '',
        status: 'Complete'
      });
    }
  }, [editData, isOpen]);

  // choose if it is income or expense
  const categorySuggestions =
    type === "income"
      ? ["Salary", "Gift", "Business"]
      : ["Transport", "Food", "Internet", "Rent", "Photocopies"];

  const methodSuggestions = [
    "Cash in Hand",
    "MTN Momo",
    "Orange Money",
    "Bank Card",
  ];
  const statusSuggestions = ["Complete", "Pending", "Failed"];

  // Reset category when the type changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      category: categorySuggestions[0] || "",
    }));
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Saving ${type}:`, formData);
    // Here we will eventually add the fetch request to your database
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`drawerOverlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div className="drawerContent" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
         <h2>{editData ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}</h2>
          <button onClick={onClose} className="closeButton">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawerForm">
      {/* the amount input */}
          <div className="formGroup">
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
          {/* date selection  */}
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
            <label>Category (Type or Select)</label>
            <input
              name="category"
              list="categoryOptions"
              placeholder="e.g. Cinema"
              value={formData.category}
              onChange={handleInputChange}
            />
            <datalist id="categoryOptions">
              {categorySuggestions.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          {/* method selesction code */}
          <div className="formGroup">
            <label>Method</label>
            <input
              name="paymentMethod"
              list="methodOptions"
              placeholder="How did you pay?"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            />
            <datalist id="methodOptions">
              {methodSuggestions.map((met) => (
                <option key={met} value={met} />
              ))}
            </datalist>
          </div>

          {/* Status Select */}
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
