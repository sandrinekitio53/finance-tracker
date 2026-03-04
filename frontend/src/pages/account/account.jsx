import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, LogOut, ChevronRight, Camera, Mail,Lock,Eye,EyeOff } from 'lucide-react';
import axios from 'axios';
import './account.css';

const Account = ({ user, onProfileUpdate ,onLogout}) => {
  // --- 1. State Management ---
  const [activeSection, setActiveSection] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = React.useRef(null);
  
  // Local state for precision form control
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    profilePic: user?.profilePic || null
  });
const [securityData, setSecurityData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationConfig, setNotificationConfig] = useState({
    emailAlerts: true,
    securityLogs: true
  });
  // --- 2. Effects ---
  // Keeps form in sync if the parent 'user' object changes [cite: 2026-01-09]
  useEffect(() => {
  if (user) {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    });
  }
}, [user?.id]); // Only reset if the actual user changes, not every prop update.

  // --- 3. Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setIsUpdating(true);

  // 1. Create the package to send [cite: 2026-01-09]
  const updatedPayload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: user.email,
    profilePic: formData.profilePic || user.profilePic,
    profileBgColor: user.profileBgColor
  };

  try {
    const response = await axios.put(`http://localhost:8081/api-update-profile/${user.id}`, updatedPayload);

    if (response.status === 200) {
  setShowSuccess(true);
  
  // This tells App.jsx to run fetchUserData() immediately
  if (onProfileUpdate) {
    onProfileUpdate(response.data); 
  }
  
  // OPTIONAL: Force a local state update for the Sidebar if they share the same object
  setTimeout(() => setShowSuccess(false), 3000);
}
  } catch (err) {
    console.error("Vault Sync Failed:", err);
  } finally {
    setIsUpdating(false);
  }
};
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // This saves the image string to your local form state
      setFormData(prev => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  }
};

const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsUpdating(true);
    try {
      await axios.put(`http://localhost:8081/api-update-password/${user.id}`, {
        newPassword: securityData.newPassword
      });
      setShowSuccess(true);
      setSecurityData({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Security Update Failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 4. UI Config ---
  const navItems = [
    { id: 'profile', label: 'Personal Identity', icon: <User size={20} /> },
    { id: 'security', label: 'Vault Security', icon: <Shield size={20} /> },
    { id: 'appearance', label: 'Interface', icon: <Palette size={20} /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell size={20} /> },
  ];

  return (
    <div className="accountContainer animateFadeIn">
      <aside className="settingsSidebar">
        <div className="sidebarProfile">
          <div className="avatarWrapper">
            <div className="avatarCircle" style={{ backgroundColor: user?.profileBgColor || '#6366f1' }}>
  {user?.profilePic ? (
    <img src={user.profilePic} alt="Profile" className="avatarImg" />
  ) : (
    user?.firstName?.charAt(0)
  )}
</div>
            <button className="editAvatarBtn"><Camera size={14} /></button>
          </div>
          <h3>{user?.firstName} {user?.lastName}</h3>
          <p>{user?.email}</p>
        </div>

        <nav className="settingsNav">
          {navItems.map((item) => (
            <button 
              key={item.id}
              className={`navLink ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="iconBox">{item.icon}</span>
              {item.label}
              <ChevronRight className="arrow" size={16} />
            </button>
          ))}
        </nav>

       <button className="logoutButton" onClick={onLogout}>
  <LogOut size={18} /> <span>Sign Out</span>
</button>
      </aside>

      <main className="settingsMain">
        {activeSection === 'profile' && (
          <div className="settingsCard">
            <div className="cardHeader">
              <h2>Profile Information</h2>
              <p>Management of your personal vault credentials.</p>
            </div>
            
            <form className="settingsForm" onSubmit={handleUpdateProfile}>
              <div className="sectionBadge">Secure Identity Node</div>
              
              <div className="profileIdentityCard">
 <div className="avatarEditor" onClick={() => fileInputRef.current.click()}>
  <div className="avatarRing animateRotate"></div>
  <div className="avatarSquare" style={{ background: user?.profile_bg_color }}>
    {/* Show the new local pic OR the existing user pic OR the initial */}
    {formData.profilePic || user?.profilePic ? (
      <img src={formData.profilePic || user.profilePic} alt="Profile" className="avatarImg" />
    ) : (
      user?.firstName?.charAt(0)
    )}
  </div>
  <label className="imageOverlay">
    <Camera size={20} />
    <input 
      type="file" 
      ref={fileInputRef} 
      hidden 
      accept="image/*" 
      onChange={handleFileChange} 
    />
  </label>
</div>
                <div className="identityMeta">
                  <h4>System User ID</h4>
                  {/* <code>#USR-{user?.id || '0000'}</code> */}
                </div>
              </div>

              <div className="formGrid">
                <div className="detailInputWrapper">
                  <User className="inputIcon" size={18} />
                  <input 
                    name="firstName" 
                    type="text" 
                    placeholder=" " 
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required 
                  />
                  <label>Legal First Name</label>
                  <div className="focusIndicator"></div>
                </div>

                <div className="detailInputWrapper">
                  <User className="inputIcon" size={18} />
                  <input 
                    name="lastName" 
                    type="text" 
                    placeholder=" " 
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required 
                  />
                  <label>Legal Last Name</label>
                  <div className="focusIndicator"></div>
                </div>

                <div className="detailInputWrapper fullWidth readonly">
                  <Mail className="inputIcon" size={18} />
                  <input type="email" value={user?.email || ''} readOnly />
                  <label>Vault Access Email</label>
                  <div className="lockBadge">Verified Primary</div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`vibrantSubmit ${isUpdating ? 'syncing' : ''}`}
                disabled={isUpdating}
              >
                <span className="btnText">
                  {isUpdating ? "Synchronizing Vault..." : "Synchronize Changes"}
                </span>
                {!isUpdating && <div className="shimmerEffect"></div>}
              </button>
            </form>

            {showSuccess && (
              <div className="successToastMini">Vault Sync Successful!</div>
            )}
          </div>
        )}
        
        {/* Placeholder for future sections [cite: 2025-12-18] */}
      {/* SECTION: SECURITY */}
        {activeSection === 'security' && (
          <div className="settingsCard">
            <div className="cardHeader">
              <h2>Vault Security</h2>
              <p>Update your master authentication credentials.</p>
            </div>
            <form className="settingsForm" onSubmit={handleSecurityUpdate}>
              <div className="detailInputWrapper">
                <Lock className="inputIcon" size={18} />
                <input 
                  type="password" 
                  placeholder=" " 
                  value={securityData.newPassword} 
                  onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} 
                  required 
                />
                <label>New Password</label>
              </div>
              <div className="detailInputWrapper">
                <Lock className="inputIcon" size={18} />
                <input 
                  type="password" 
                  placeholder=" " 
                  value={securityData.confirmPassword} 
                  onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})} 
                  required 
                />
                <label>Confirm Password</label>
              </div>
              <button type="submit" className="vibrantSubmit">Update Security Node</button>
            </form>
          </div>
        )}
        {/* SECTION: INTERFACE */}
        {activeSection === 'appearance' && (
          <div className="settingsCard">
            <div className="cardHeader">
              <h2>Interface Settings</h2>
              <p>Switch between light and night mode visual themes.</p>
            </div>
            <div className="themeSelectionGrid">
              <button className="vibrantSubmit" onClick={() => document.body.className = 'light-mode'}>Enable Light Mode</button>
              <button className="vibrantSubmit" style={{background: '#1e1e2e'}} onClick={() => document.body.className = 'night-mode'}>Enable Night Mode</button>
            </div>
          </div>
        )}

        {/* SECTION: ALERTS */}
        {activeSection === 'notifications' && (
          <div className="settingsCard">
            <div className="cardHeader">
              <h2>Alert Configurations</h2>
              <p>Set your system notification preferences.</p>
            </div>
            <div className="toggleItem" style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0'}}>
              <span>Push Notifications</span>
              <input 
                type="checkbox" 
                checked={notificationConfig.emailAlerts} 
                onChange={() => setNotificationConfig({...notificationConfig, emailAlerts: !notificationConfig.emailAlerts})} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Account;