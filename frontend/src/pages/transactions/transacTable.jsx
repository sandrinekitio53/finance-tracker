import React from 'react'
import './transac.css';

const TransacTable = ({transactions, onDelete, onEdit}) => {

    if (!transactions || transactions.length === 0) {
    return <div className="no-data">No transactions found.</div>;
  }
  return (
    <div className="tableContainer">
      <table className="financeTable">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Date</th>
            <th>Category</th>
            <th>Method</th>
            <th>Amount</th>
            <th>Statues</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td><input type="checkbox" /></td>
              <td>{item.date}</td>
              <td>{item.category}</td>
              <td>{item.method}</td>
              <td className="amountCell">{item.amount}</td>
              <td>
                <span className={`statusBadge ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
              <td className="actionsCell">
              <button className="actionBtn edit" onClick={() => onEdit(item)}>
                ✎
              </button>
              <button className="actionBtn delete" onClick={() => onDelete(item.id)}>
                🗑
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransacTable;
