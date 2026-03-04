import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './profile.css';

const ProfilePage = ({ user, onUpdateUser }) => {
    
const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',  lastName: '', email: '', password: '',
    bio: '', profilePic: '', profileBgColor: '#ffffff'
  });
  useEffect(() => {
    if (user) {
     setFormData({
      firstName: user.first_name || user.firstName || '',
      lastName: user.last_name || user.lastName || '',
      email: user.email || '', password: '', 
      bio: user.bio || '', profilePic: user.profile_pic || user.profilePic || '' ,
      profileBgColor: user?.profile_bg_color || '#ffffff'
    });
    }
  }, [user]);
  if (!user) { return <div className="loading-screen">Loading Profile Data...</div>;}

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {setFormData({ ...formData, profilePic: reader.result });
   };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    console.log("Sending data to server:", formData);
    try {
      const response = await axios.put(`http://localhost:8081/api-update-profile/${user.id}`, formData, {
        withCredentials: true
      });
      
      if (response.status === 200) {
       const updatedUserForDashboard = {
        ...user, ...formData,
        profile_bg_color: formData.profileBgColor 
    };
      onUpdateUser(updatedUserForDashboard); 
      setIsEditing(false);  alert("Profile and Vibe updated! 🎨");
    }
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="profileContainer">
      <div className="profileCard">
        <div className="profileHead">
          <div className="profileCircle">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="profileAvatar" />
            ) : (
              <div className="profileInitial" style={{ backgroundColor: formData.profileBgColor || '#6366f1',
              color: '#ffffff' }}> 
              {formData.firstName.charAt(0)}</div>
            )}
            {isEditing && (
              <label className="upload-badge">
                <input type="file" onChange={handleImageChange} hidden /> 📷
              </label>              
            )}
          </div>
          {!isEditing && (
            <button className="editBtn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-details">
          <div className="inputS">
            <label>First Name</label>
            <input type="text" value={formData.firstName} 
              disabled={!isEditing} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
          </div>
          <div className="inputS">
            <label>Last Name</label>
            <input type="text" value={formData.lastName} 
              disabled={!isEditing} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          <div className="inputS">
            <label>Email Address</label>
            <input type="email" value={formData.email} 
              disabled={!isEditing} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {isEditing && (
            <div className="inputS">
              <label>New Password</label>
              <input type="password" placeholder="Leave blank to keep current"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          )}
          <div className="inputS">
            <label>Bio</label>
            <textarea className="bioTextarea" value={formData.bio} 
              disabled={!isEditing} placeholder="Tell us a bit about your financial goals..."
              onChange={(e) => setFormData({...formData, bio: e.target.value})}  rows="4"
            />
            {isEditing && (
              <small className="xterCount">{formData.bio.length} characters</small>
            )}
          </div>
        </div>
        <div className="inputS">
          <label className="theme-label">Profile Theme Vibe</label>
          <div className="colorPickerCont">
          <div className="pickerWrapper">
          <input type="color"   value={formData.profileBgColor || "#ffffff"} 
            disabled={!isEditing} onChange={(e) => setFormData({ ...formData, profileBgColor: e.target.value })}
            className="hidden-color-input"
          />
          <div className="colorCircle" style={{ backgroundColor: formData.profileBgColor }}></div>
        </div>
        <div className="hexDisplay">
          <span className="hexLabel">Selected Color:</span>
          <span className="hexValue">{formData.profileBgColor ? formData.profileBgColor.toUpperCase() : '#FFFFFF'}</span>
        </div>
  </div>
  <small className="colorHint">This color will reflect as your profile background color 🎨</small>
</div>

        {isEditing && (
          <div className="profileActions">
            <button className="cancelBtn" onClick={() => setIsEditing(false)}>Cancel</button>
            <button className="saveBtn" onClick={handleSave}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;