import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import LandingPage from './components/landingpage.component';
import Registration from './components/Registration/Registration';
import { withFirebase } from './components/Firebase';
import Login from './components/Login/Login';

const App = (props) => {
  const { firebase } = props;
  const [isAuthenticated, setisAuthenticated] = useState(false);

  const logout = () => {
    firebase.signOut();
    window.location.reload();
  };

  firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      setisAuthenticated(true);
    }
  });

  let registerLink;
  let loginLink;

  if (!isAuthenticated) {
    registerLink = (
      <li className="navbar-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
    );
    loginLink = (
      <li className="navbar-item">
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
    );
  } else {
    registerLink = (
      <li className="navbar-item">
        <Link to="/" className="btn" onClick={logout}>
          Logout
        </Link>
      </li>
    );
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg">
          <Link to="/" className="navbar-brand">
            Lunchmate
          </Link>
          <div className="navbar-collapse collapse justify-content-end">
            <ul className="navbar-nav navbar-right">
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  How It Works
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/" className="nav-link">
                  Help
                </Link>
              </li>
              {registerLink}
              {loginLink}
            </ul>
          </div>
        </nav>
        <main>
          <Route path="/" exact component={LandingPage} />
          <Route path="/register" exact component={Registration} />
          <Route path="/login" exact component={Login} />
        </main>
      </div>
    </Router>
  );
};

export default withFirebase(App);
