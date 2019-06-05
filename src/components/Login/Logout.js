import React from 'react';

import { withFirebase } from '../Firebase';
import {Link} from "react-router-dom";

const LogoutLink = ({ firebase }) => (
    <Link className="nav-link" onClick={firebase.signOut} to="/">
        Log Out
    </Link>
);

export default withFirebase(LogoutLink);
