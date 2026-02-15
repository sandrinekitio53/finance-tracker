import React, { useState } from 'react';
import './goalDrawer.css';

const GoalDrawer = ({ isOpen, onClose, onSave }) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [alreadySaved, setAlreadySaved] = useState('');
  const [targetDate, setTargetDate] = useState('');

  // If this check fails, the drawer never renders
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      title: goalTitle, 
      amount: Number(targetAmount), 
      saved: Number(alreadySaved) || 0, 
      date: targetDate 
    });
    onClose();
  };

  return (
    <div className="goalModalWrapper" onClick={onClose} style={{display: 'flex', zIndex: 9999}}>
      <div className="goalPanelContent" onClick={(e) => e.stopPropagation()}>
        <div className="goalPanelHeader">
          <h2>Create New Goal</h2>
          <button onClick={onClose} style={{cursor: 'pointer'}}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="goalEntryForm">
          <div className="goalInputBox">
            <label>Goal Name</label>
            <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} required />
          </div>
          
          <div className="goalInputBox">
            <label>Target Amount (frs)</label>
            <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
          </div>

          <div className="goalInputBox">
            <label>Amount Already Saved (frs)</label>
            <input type="number" value={alreadySaved} onChange={(e) => setAlreadySaved(e.target.value)} required />
          </div>
          
          <div className="goalInputBox">
            <label>Target Date</label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
          </div>
          
          <button type="submit" className="goalSubmitBtn">Start Saving</button>
        </form>
      </div>
    </div>
  );
};

export default GoalDrawer;