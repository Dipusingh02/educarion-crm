import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);  // Use context to manage user data

  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {user.role === 'admin' && <li><Link to="/admin/manage-users">Manage Users</Link></li>}
        {user.role === 'faculty' && <li><Link to="/faculty/manage-courses">Manage Courses</Link></li>}
        {user.role === 'student' && <li><Link to="/student/view-courses">View Courses</Link></li>}
        {user.role === 'parent' && <li><Link to="/parent/view-child-progress">View Progress</Link></li>}
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
