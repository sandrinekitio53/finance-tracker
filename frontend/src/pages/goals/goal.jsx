import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Target, Trash2, Edit3, MoreVertical, X } from 'lucide-react'; 
import GoalDrawer from './goalDrawer'; 
import './goal.css';

const Goals = ({ userId }) => {
    // --- State Management ---
    const [goalsList, setGoalsList] = useState([]);
    const [availableBalance, setAvailableBalance] = useState(0);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null); 
    const [activeMenu, setActiveMenu] = useState(null); 

    // --- Data Fetching Logic (XAMPP Sync) ---
    const fetchGoalsData = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`http://localhost:8081/api-goals/${userId}`);
            setGoalsList(response.data);
        } catch (error) {
            console.error("Error fetching goals:", error);
        }
    }, [userId]);

    const calculateLiveBalance = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`http://localhost:8081/api-transactions/${userId}`);
            const transactions = response.data;
            const total = transactions.reduce((acc, item) => {
                const amt = Number(item.amount);
                return item.type === 'income' ? acc + amt : acc - amt;
            }, 0);
            setAvailableBalance(total);
        } catch (error) {
            console.error("Balance Sync Error:", error);
        }
    }, [userId]);

    // --- Action Handlers ---
    const handleEditClick = (goal) => {
        setEditingGoal(goal);
        setShowGoalModal(true);
        setActiveMenu(null); // Close the menu after clicking 
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm("Move this goal to the archives (Delete)?")) return;
        try {
            await axios.delete(`http://localhost:8081/api-goals/delete/${goalId}`);
            fetchGoalsData(); 
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleCloseModal = () => {
        setShowGoalModal(false);
        setEditingGoal(null); 
    };

    useEffect(() => {
        fetchGoalsData();
        calculateLiveBalance();
        
        window.addEventListener('balanceUpdated', calculateLiveBalance);
        return () => window.removeEventListener('balanceUpdated', calculateLiveBalance);
    }, [userId, fetchGoalsData, calculateLiveBalance]);

    return (
        <div className="goalsContainer">
            {/* The Unified Modal for Adding & Editing  */}
            <GoalDrawer 
                isOpen={showGoalModal} 
                onClose={handleCloseModal} 
                onSave={fetchGoalsData} 
                userId={userId}
                initialData={editingGoal} 
            />

            <div className="goalsHeader">
                <div className="headerText">
                    <h1>Goals</h1>
                    <p>Track your savings targets</p>
                </div>
                
                <div className="balanceSection">
                    <span className="balanceLabel">Available Balance</span>
                    <h2 className="balanceValue">{availableBalance.toLocaleString()} <small>FCFA</small></h2>
                </div>

                <button className="setNewBtn" onClick={() => setShowGoalModal(true)}>
                    <Target size={18} /> Set New
                </button>
            </div>

            <div className="goalsGrid">
                {goalsList.map((goal) => {
                    const target = Number(goal.target_amount || 0);
                    const saved = Number(goal.current_saved || 0);
                    const remaining = target - saved;
                    const progressPercent = Math.min(Math.round((saved / target) * 100), 100);

                    return (
                        <div key={goal.id} className="goalCard">
                            <div className="cardHeader">
                                <h4>{goal.title || goal.goal_name}</h4>
                                <div className="menuWrapper">
                                    <button 
                                        className="cardMenuBtn" 
                                        onClick={() => setActiveMenu(activeMenu === goal.id ? null : goal.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    
                                    {activeMenu === goal.id && (
                                        <div className="actionDropdown">
                                            <button onClick={() => handleEditClick(goal)}>
                                                <Edit3 size={14} /> Edit
                                            </button>
                                            <button className="deleteOption" onClick={() => handleDeleteGoal(goal.id)}>
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="cardMainAmount">{target.toLocaleString()} <small>FCFA</small></h3>
                            
                            <div className="progressContainer">
                                <div className="progressInfo">
                                    <div className="savedInfo">
                                        <span>{saved.toLocaleString()} FCFA</span>
                                        <small>Saved</small>
                                    </div>
                                    <span className="percentLabel">{progressPercent}%</span>
                                </div>
                                <div className="progressBarBase">
                                    <div 
                                        className="progressBarFill" 
                                        style={{ width: `${progressPercent}%`, background: progressPercent >= 100 ? '#10b981' : '#2D31FA' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="cardFooterDetails">
                                <div className="footerRow">
                                    <span>Target Date</span>
                                    <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                                </div>
                                <div className="footerRow">
                                    <span>Remaining</span>
                                    <span className={remaining <= 0 ? "successText" : ""}>
                                        {remaining <= 0 ? "Goal Met!" : `${remaining.toLocaleString()} FCFA`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Goals;
// console.log is used to show the logic goes perfectly well cause i had issues with the gaolDrawer
// code due to the fact that it wasnot showing bcs it was overshadowed by css and the naming conflict😞