import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import LandingPage from './components/landingpage.component';
import Registration from './components/Registration/Registration';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile';
import Admin from './components/Admin';
import Main from './components/Main';
import { withAuth } from './components/Session';
import Navigation from './components/Nav/navigation';
import { SnackbarProvider } from 'notistack';

const App = () => {
  return (
    <Router>
      <div className="App">
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <Navigation />
          <main>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={Registration} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/main" component={Main} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/admin" component={Admin} />
          </main>
        </SnackbarProvider>
      </div>
    </Router>
  );
};

export default withAuth(App);
