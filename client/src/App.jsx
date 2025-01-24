import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/Admin/Dashboard';
import RegisterUser from './pages/Admin/RegisterUser';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/register-user" component={RegisterUser} />
        {/* Define other routes as needed */}
      </Switch>
    </Router>
  );
};

export default App;
