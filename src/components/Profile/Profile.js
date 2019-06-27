import React, {useEffect, useState} from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";
import {Avatar, TextField, Grid, Button, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InterestsForm from "../Registration/InterestsForm";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: "#313131",
        },
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
        color: 'white'
    },
    text: {
        color: 'white'
    },
    btn: {
        color: '#ffffff',
        borderColor: '#ffffff'
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
    const [userInfo, setUserInfo] = useState(null);
    const [clickedInterests, setClickedInterests] = useState([]);
    const [interests, setinterests] = useState([]);

    useEffect(() => {
        firebase.auth.onAuthStateChanged(function(user) {
            if (user) {
                setUserObj(firebase.auth.currentUser);
                fetchUserData(firebase.auth.currentUser.uid);
            } else {
            }
        });
    }, []);

    useEffect(() => {
        if (interests!==[] && userInfo!==[]) {
            console.log(clickedInterests);
            setinterests(interests.filter(x => !clickedInterests.includes(x)));
            setUserInfo({...userInfo, interests: clickedInterests})
        }
    }, [clickedInterests]);

    const fetchUserData = (uid) => {
        firebase.user(uid).then(function (snapshot) {
            console.log(snapshot.data());
            setUserInfo(snapshot.data());
            setClickedInterests(snapshot.data().interests);
        })
    };

    function resetPw() {
        if (userObj)  {
            firebase.resetPassword(userObj.email);
        }
    }

    function handleDescChange(text) {
        setUserInfo({...userInfo, description: text});
        console.log(userInfo);
    }

    return (
        <div>
            <Avatar align='center' className={classes.bigAvatar} src={userObj && userObj.photoURL}/>
            <Typography className={classes.text} variant='h3' align='center'>{userObj && userObj.displayName}</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        id="standard-multiline-flexible"
                        multiline
                        rowsMax="3"
                        value={userInfo && userInfo.description}
                        onChange={(e) => handleDescChange(e.target.value)}
                        className={classes.textField}
                        InputProps={{
                            classes: {
                                input: classes.textField
                            }
                        }}
                        inputProps={{
                            maxLength: 70
                        }}
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.text}>Email: </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.text}>{userObj && userObj.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.text}>Major: </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography className={classes.text}>{userInfo && userInfo.major}</Typography>
                </Grid>
            </Grid>
            <InterestsForm
                setClickedInterests={setClickedInterests}
                clickedInterests={clickedInterests}
                interests={interests}
                setinterests={setinterests}
            />
            <Button className={classes.btn} variant="outlined" onClick={resetPw}>Reset Password</Button>
        </div>
    );
};

const authenticated = authUser => !!authUser;
export default compose(
    withAuthorization(authenticated),
)(Profile);