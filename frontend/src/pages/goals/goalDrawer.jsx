import React, { useState, useEffect } from 'react';
import './goalDrawer.css';
import axios from 'axios';

// 1. Added 'initialData' to the props 
const GoalDrawer = ({ isOpen, onClose, onSave, userId, initialData }) => {
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [alreadySaved, setAlreadySaved] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const goalData = {
      userId: userId,
      title: goalTitle,
      amount: Number(targetAmount),
      saved: Number(alreadySaved) || 0,
      date: targetDate
    };

    try {
     
      if (initialData?.id) {  
        await axios.put(`http://localhost:8081/api-goals/update/${initialData.id}`, goalData);
      } else {
        await axios.post('http://localhost:8081/api-goals/add', goalData);
      }

      onSave(); 
      onClose(); 
    } catch (error) {
      console.error("Goal Submission Failed:", error);
      alert("Error syncing with XAMPP vault. Check if your server is running.");
    }
  };
  
  useEffect(() => {
    if (initialData) {
      setGoalTitle(initialData.title || initialData.goal_name || '');
      setTargetAmount(initialData.target_amount || '');
      setAlreadySaved(initialData.current_saved || 0);
      // date for the input (YYYY-MM-DD)
      const formattedDate = initialData.target_date ? new Date(initialData.target_date).toISOString().split('T')[0] : '';
      setTargetDate(formattedDate);
    } else {
      // Clear fields for a "New Goal" 
      setGoalTitle('');
      setTargetAmount('');
      setAlreadySaved('');
      setTargetDate('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="goalModalWrapper" onClick={onClose} style={{ display: 'flex', zIndex: 9999 }}>
      <div className="goalPanelContent" onClick={(e) => e.stopPropagation()}>
        <div className="goalPanelHeader">
          <h2>{initialData ? 'Update Goal' : 'Create New Goal'}</h2>
          <button onClick={onClose} style={{ cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="goalEntryForm">
          <div className="goalInputBox">
            <label>Goal Name</label>
            <input type="text" value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} required />
          </div>

          <div className="goalInputBox">
            <label>Target Amount (FCFA)</label>
            <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
          </div>

          <div className="goalInputBox">
            <label>Amount Already Saved (FCFA)</label>
            <input type="number" value={alreadySaved} onChange={(e) => setAlreadySaved(e.target.value)} required />
          </div>

          <div className="goalInputBox">
            <label>Target Date</label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
          </div>

          <button type="submit" className="goalSubmitBtn">
            {initialData ? 'Save Changes' : 'Start Saving'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalDrawer;