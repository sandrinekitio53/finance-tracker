import React from 'react';
import './transac.css';

const TransacTable = ({ transactions, onDelete, onEdit }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="no-data">No history found in database.</div>;
  }

  return (
    <div className="tableContainer">
      <table className="financeTable">
        <thead>
          <tr className='tableInfo'>
            <th>Date</th>
            <th>Category</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.category}</td>
              <td>{item.method}</td>
              <td className={`amountCell ${item.type === 'income' ? 'income-text' : 'expense-text'}`}>
                {Number(item.amount).toLocaleString()} F
              </td>
              <td><span className={`statusBadge ${item.status.toLowerCase()}`}>{item.status}</span></td>
              <td className="actionsCell">
                <button className="actionBtn edit" onClick={() => onEdit(item)}>✎</button>
                <button className="actionBtn delete" onClick={() => onDelete(item.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransacTable;
