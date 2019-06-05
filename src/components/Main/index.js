import React from 'react';
import withAuthorization from "../Session/authorization";
import {compose} from "recompose";

const Main = () => (
    <div>
        <h1>Main Page</h1>
    </div>
);

const authenticated = authUser => !!authUser;
export default compose(
    withAuthorization(authenticated),
)(Main);