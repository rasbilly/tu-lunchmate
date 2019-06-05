import React from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";

const Admin = () => (
    <div>
        <h1>Admin</h1>
    </div>
);

const authenticated = authUser => !!authUser;
export default compose(
    withAuthorization(authenticated),
)(Admin);