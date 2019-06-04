import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuth = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                authUser: JSON.parse(localStorage.getItem('user')),
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    localStorage.setItem('user', JSON.stringify(authUser));
                    this.setState({ authUser });
                },
                () => {
                    localStorage.removeItem('user');
                    this.setState({ authUser: null });
                },
            );
        }

        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }
    return withFirebase(WithAuthentication);
};

export default withAuth;