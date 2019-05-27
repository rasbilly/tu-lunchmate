import React, { useState } from 'react';
import RegistratiomForm from '../RegistrationForm/RegistrationForm';
import { FirebaseContext } from '../Firebase';

const Registration = (props) => {
  return (
    <div className="container mt-5">
      <h2>Registration</h2>
      <FirebaseContext.Consumer>
        {(firebase) => <RegistratiomForm firebase={firebase} />}
      </FirebaseContext.Consumer>
    </div>
  );
};

export default Registration;
