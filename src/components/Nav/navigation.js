import React from 'react';
import { Link } from 'react-router-dom';

import AuthUserContext from '../Session/context';

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser} />
            ) : (
                <NavigationNonAuth />
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <nav className="navbar navbar-expand-lg">
        <Link to="/" className="navbar-brand">Lunchmate</Link>
        <div className="navbar-collapse collapse justify-content-end">
            <ul className="navbar-nav navbar-right">
                <li className="navbar-item">
                    <Link to="/main" className="nav-link">
                        Main Page
                    </Link>
                </li>
                {authUser.isAdmin && (
                    <li>
                        <Link to="/admin">Admin</Link>
                    </li>
                )}
                <li className="navbar-item">
                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/login" className="nav-link">
                        Log out
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
);

const NavigationNonAuth = () => (
    <nav className="navbar navbar-expand-lg">
        <Link to="/" className="navbar-brand">Lunchmate</Link>
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
                <li className="navbar-item">
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
            </ul>
        </div>
    </nav>
);

export default Navigation;
