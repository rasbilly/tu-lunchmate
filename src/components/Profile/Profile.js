import React, {useState} from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";
import {Avatar, Grid, Button, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
}));

const Profile = (props) => {
    const {firebase} = props;
    const classes = useStyles();
    const [userObj, setUserObj] = useState(null);
    const [userInfo, setUserInfo] = useState();
    firebase.auth.onAuthStateChanged(function(user) {
        if (user) {
            setUserObj(user);
            fetchUserData(user.uid);
        } else {
        }
    });

    const fetchUserData = (uid) => {
        firebase.user(uid).then(function (snapshot) {
            setUserInfo(snapshot.data());
        })
    };

    function resetPw() {
        if (userObj)  {
            firebase.resetPassword(userObj.email);
        }
    }

    return (
        <div>
            <Avatar className={classes.bigAvatar} src={userObj && userObj.photoURL}/>
            <Typography variant='h3' align='center'>{userObj && userObj.displayName}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Typography>Email: </Typography>
                </Grid>
                <Grid item xs={6}>
                    {userObj && userObj.email}
                </Grid>
                <Grid item xs={6}>
                    <Typography>Major: </Typography>
                </Grid>
                <Grid item xs={6}>
                    {userInfo && userInfo.major}
                </Grid>
            </Grid>
            <Button onClick={resetPw}>Reset Password</Button>
        </div>
    );
};

const authenticated = authUser => !!authUser;
export default compose(
    withAuthorization(authenticated),
)(Profile);