import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";

const Login = (props) => {
  const { firebase, history } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setalertMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    firebase
      .signIn(email, password)
      .then(() => {
        this.history.push('/');
      })
      .catch((error) => {
        setalertMessage(error.message);
      });
  };

  firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      history.push('/');
    }
  });
  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-Mail Adresse</label>
          <input
            type="email"
            className="form-control"
            id="email"
            required="required"
            placeholder="E-Mail eingeben"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div
          className={`alert alert-danger ${alertMessage ? '' : 'd-none'}`}
          role="alert"
        >
          {alertMessage}
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default withFirebase(Login);
