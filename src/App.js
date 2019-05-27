import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './App.css';
import LandingPage from "./components/landingpage.component";


function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg">
                    <Link to="/" className="navbar-brand">Lunchmate</Link>
                    <div className="navbar-collapse collapse justify-content-end">
                        <ul className="navbar-nav navbar-right">
                            <li className="navbar-item">
                                <Link to="/" className="nav-link">How It Works</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/" className="nav-link">Help</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/" className="nav-link">Profile</Link>
                            </li>
                        </ul>

                    </div>
                </nav>
                <main>
                    <Route path="/" exact component={LandingPage} />
                </main>
            </div>
        </Router>
    );
}

export default App;
