import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { User, Mail, Lock, Camera, LogOut, FileText } from 'lucide-react';
import './account.css';

const Account = ({ user, onProfileUpdate, onLogout }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Unified state for all fields
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '', // Added bio support
    profilePic: user?.profilePic || null,
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

// Account.jsx
const handleGlobalUpdate = async (e) => {
    e.preventDefault();
    
    // Safety check: Don't even hit the API if passwords don't match
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert("Validation Error: Passwords do not match!");
        return;
    }

    setIsUpdating(true);

    try {
        const response = await axios.put(
            `http://localhost:8081/api-update-full-account/${user.id}`, 
            formData, // Send the whole formData object
            { withCredentials: true }
        );

        if (response.status === 200) {
            // Update the parent state immediately
            onProfileUpdate(response.data.user); 
            setShowSuccess(true);
            
            // Clear passwords from form
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
            setTimeout(() => setShowSuccess(false), 3000);
        }
    } catch (err) {
        console.error("Sync Error:", err.response?.data || err.message);
        alert("Vault Error: Check console for details.");
    } finally {
        setIsUpdating(false);
    }
};

  return (
    <div className="unifiedAccountWrapper">
      <div className="accountHeader">
        <h1>Account Settings</h1>
        <button className="logoutBtn" onClick={onLogout}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <form className="accountMainForm" onSubmit={handleGlobalUpdate}>
        {/* --- IDENTITY SECTION --- */}
        <section className="accountSection">
          <div className="sectionTitle">
            <User size={20} /> <span>Personal Identity</span>
          </div>

          <div className="avatarCenter">
            <div className="avatarEditor" onClick={() => fileInputRef.current.click()}>
              <div className="avatarSquare" style={{ background: user?.profileBgColor || '#2D31FA' }}>
                {formData.profilePic || user?.profilePic ? (
                  <img src={formData.profilePic || user.profilePic} alt="Profile" className="avatarImg" />
                ) : (
                  user?.firstName?.charAt(0)
                )}
              </div>
              <div className="cameraOverlay"><Camera size={16} /></div>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="formRow">
            <div className="inputGroup">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="inputGroup">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="inputGroup">
            <label>Email Address</label>
            <input type="email" value={user?.email || ''} readOnly className="readonlyInput" />
          </div>

          <div className="inputGroup">
            <label>Profile Description / Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleInputChange} 
              placeholder="Tell us about yourself..."
              rows="3"
            />
          </div>
        </section>

        {/* --- SECURITY SECTION --- */}
        <section className="accountSection">
          <div className="sectionTitle">
            <Lock size={20} /> <span>Security check</span>
          </div>
          <p className="sectionHint">Leave blank if you don't want to change your password.</p>
          
          <div className="formRow">
            <div className="inputGroup">
              <label>New Master Password</label>
              <input 
                name="newPassword" 
                type="password" 
                value={formData.newPassword} 
                onChange={handleInputChange} 
                autoComplete="new-password"
              />
            </div>
            <div className="inputGroup">
              <label>Confirm Password</label>
              <input 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </section>

        <button type="submit" className="saveChangesBtn" disabled={isUpdating}>
          {isUpdating ? "Saving to Database..." : "Update All Information"}
        </button>

        {showSuccess && <div className="successBanner">Account updated successfully!</div>}
      </form>
    </div>
  );
};

export default Account;