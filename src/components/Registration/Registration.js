import React from 'react';
import RegistratiomForm from '../RegistrationForm/RegistrationForm';

const Registration = (props) => {
  const { history } = props;

  return (
    <div className="container mt-5">
      <h2>Registration</h2>
      <RegistratiomForm history={history} />
    </div>
  );
};

export default Registration;
