import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./transac.css";

const TransactionDrawer = ({ isOpen, onClose, type, editData, onSave, userId }) => {

  const [formData, setFormData] = useState({
    transactionDate: new Date().toISOString().slice(0, 16),
    category: "",
    paymentMethod: "",
    amount: "",
    status: "Complete",
  });

  const categorySuggestions = type === "income"
    ? ["Salary", "Gift", "Business", "Freelance"]
    : ["Transport", "Food", "Internet", "Rent", "Photocopies", "Shopping"];

  const methodSuggestions = ["Cash in Hand", "MTN Momo", "Orange Money", "Bank Card"];
  const statusSuggestions = ["Complete", "Pending", "Failed"];

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
        category: categorySuggestions[0],
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

const handleSubmit = async (e) => {
  e.preventDefault();

  const finalData = {
   user_id: userId, 
    title: formData.category || "New Transaction", 
    amount: Number(formData.amount) || 0,
    type: type, 
    category: formData.category || null,
    status: formData.status || 'Complete',
    method: formData.paymentMethod || null,
    date: formData.transactionDate || new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  try {
    const url = editData 
      ? `http://localhost:8081/api-update-transaction/${editData.id}` 
      : `http://localhost:8081/api-add-transaction`;

    const response = editData 
      ? await axios.put(url, finalData, { withCredentials: true }) 
      : await axios.post(url, finalData, { withCredentials: true });

    if (response.status === 200 || response.status === 201) {
     const updateEvent = new CustomEvent("balanceUpdated", { detail: finalData });
    window.dispatchEvent(updateEvent);
      if (onSave) onSave();
      onClose();
    }
  } catch (error) {
    console.error("Database Sync Error:", error.response?.data);
  }
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
            <input name="amount" type="number" placeholder="0.00" value={formData.amount} onChange={handleInputChange} required />
          </div>

          <div className="formGroup">
            <label>Date & Time</label>
            <input name="transactionDate" type="datetime-local" value={formData.transactionDate} onChange={handleInputChange} />
          </div>

          <div className="formGroup">
            <label>Category</label>
            <input name="category" list="categoryOptions" value={formData.category} onChange={handleInputChange} autoComplete="off" />
            <datalist id="categoryOptions">
              {categorySuggestions.map((cat) => <option key={cat} value={cat} />)}
            </datalist>
          </div>

          <div className="formGroup">
            <label>Method</label>
            <input name="paymentMethod" list="methodOptions" value={formData.paymentMethod} onChange={handleInputChange} />
            <datalist id="methodOptions">
              {methodSuggestions.map((met) => <option key={met} value={met} />)}
            </datalist>
          </div>

          <div className="formGroup">
            <label>Status</label>
            <input name="status" list="statusOptions" value={formData.status} onChange={handleInputChange} />
            <datalist id="statusOptions">
              {statusSuggestions.map((stat) => <option key={stat} value={stat} />)}
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
// Axios is for sql communication
// + window.dispatchEvent; Shout to the app that the balance has changed!
// + slice(start, end )is a safe method that returns a shallow copy ie keps a copy of the adat wout iinterfering with that o the transactionHistory
// so slice(0,16) is to show just the 1st 16 ids the rest goes to the next page 
// + spread operator  is letting all the data spread out so they can join and form an new set of data 
//  - it is all abt combining . if u have a list of old transactions and u get a new one , u "spread " the old ones into a new list
// [newTransaction, ...oldTransaction] meaning put the new elt 1st , then everyone follows