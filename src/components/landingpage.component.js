import React, {Component} from 'react';
import logo from '../img/logo_lunchmate.png';
import './components.css';

{/*
TODO flex zentrieren vertikal
TODO Button selbe größe wie img
 */}
export default class LandingPage extends Component {
    render() {
        return (
            <div className="flex">
                <img src={logo} className="App-logo" alt="logo"/>
                <div>
                    <button type="button" className="btn btn-lg">log in</button>
                    <button type="button" className="btn btn-lg">register</button>
                </div>
            </div>
        )
    }
}