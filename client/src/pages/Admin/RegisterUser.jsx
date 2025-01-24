// Example: Register User (pages/Admin/RegisterUser.js)
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../../services/api';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, role };

    try {
      await registerUser(userData);
      history.push('/admin/manage-users');  // Redirect to Manage Users page
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h1>Register User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
