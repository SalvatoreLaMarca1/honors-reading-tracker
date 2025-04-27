
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      console.log('User logged out successfully');
      navigate("/")
    }
  };

  return (
    <div className="bar">
      <div onClick={() => {navigate("/dashboard")}} className="logo">
        <u>Read Now</u>
      </div>

      <div className="right-cluster">
        <div onClick={() => {navigate("/read")}} className="nav-btn">Read</div>
        <div onClick={() => {navigate("/my-books")}} className="nav-btn">My Books</div>
        <button onClick={handleLogout} className="nav-btn">Log Out</button>
      </div>
    </div>
  );
};

export default Navbar;