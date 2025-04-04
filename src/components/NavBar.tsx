// import React from 'react';
// import { Link } from 'react-router-dom';
// import { supabase } from '../supabase';

// const Navbar: React.FC = () => {

//     const handleLogout = async () => {
//         const { error } = await supabase.auth.signOut();
//         if (error) {
//           console.error('Error logging out:', error.message);
//         } else {
//           console.log('User logged out successfully');
//         }
//       };


//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 fixed-top">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/dashboard">Read Now</Link>
        
//         <button 
//           className="navbar-toggler" 
//           type="button" 
//           data-bs-toggle="collapse" 
//           data-bs-target="#navbarNav" 
//           aria-controls="navbarNav" 
//           aria-expanded="false" 
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
        
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
            
//             <li className="nav-item">
//               <Link className="nav-link" to="/read">Read</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/my-books">My Books</Link>
//             </li>
            
//           </ul>
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <Link className="nav-link" onClick={handleLogout} to="/">Log Out</Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


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
        Read Now
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