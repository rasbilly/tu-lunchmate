import React, { useState } from 'react';
import { withFirebase } from '../Firebase';

const RegistrationForm = (props) => {
  const { firebase, history } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [alertMessage, setalertMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== password2) {
      setalertMessage('Passwörter stimmen nicht überein');
    }
    firebase.createUser(email, password).then(() => {
      const user = firebase.auth.currentUser;
      user.updateProfile({ displayName: name });
      history.push('/');
    });
  };

  firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      history.push('/');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          required="required"
          placeholder="Namen eingeben"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <div className="form-group">
        <label htmlFor="password2">Password</label>
        <input
          type="password"
          className="form-control"
          id="password2"
          required
          placeholder="Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
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
  );
};

export default withFirebase(RegistrationForm);
