import React from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";

const Profile = () => (
    <div>
        <h1>Profile Page</h1>
    </div>
);

const authenticated = authUser => !!authUser;
export default compose(
    withAuthorization(authenticated),
)(Profile);