import React from 'react';
import './transac.css';

const TransactionTable = ({ groupedTransactions, onDelete, onEdit }) => {
  if (!groupedTransactions || groupedTransactions.length === 0) {
    return <div className="no-data">No history found in database.</div>;
  }

  console.log('TransactionTable received groupedTransactions:', groupedTransactions);

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
          {groupedTransactions.map((group, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {/* Show group separator only if not showing "All Transactions" */}
              {group.period !== 'All Transactions' && (
                <tr className="groupSeparator">
                  <td colSpan="6"><span className="groupIndicator"></span>{group.period}</td>
                </tr>
              )}
              
              {/* Transactions in this group */}
              {group.transactions.map((item) => (
                <tr id='trInfos' key={item.id} className={item.type === 'income' ? 'trIncome' : 'trExpense'}>
                  <td className="colDate">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="colCategory">
                    {item.syncSource === 'automated' ? `${item.category}` : item.category}
                  </td>
                  <td className="colMethod">{item.method}</td>
                  <td className={`colAmount ${item.type === 'income' ? 'incomeText' : 'expenseText'}`}>
                    {item.type === 'income' ? '+' : '-'}{Number(item.amount).toLocaleString()} frs
                  </td>
                  
                  <td className="colStatus">
                    <span className={`statusBadge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="colActions">
                    {item.syncSource !== 'automated' && (
                        <button className="btnEdit" onClick={() => onEdit(item)}>✎</button>
                    )}
                    <button className="btnDelete" onClick={() => onDelete(item.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
