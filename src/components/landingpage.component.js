import React, {Component} from 'react';
import logo from '../img/logo_lunchmate.png';
import './components.css';
import {Link} from "react-router-dom";

{/*
TODO flex zentrieren vertikal
TODO Button selbe größe wie img
 */
}
export default class LandingPage extends Component {
    render() {
        return (
            <div className="flex text-center">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    <Link to="/login">
                        <button type="button" className="btn btn-lg mr-1">log in</button>
                    </Link>
                    <Link to="/register">
                        <button type="button" className="btn btn-lg ml-1">register</button>
                    </Link>
                </div>
            </div>
        )
    }
}