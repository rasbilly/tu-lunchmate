import React, {useEffect, useState} from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";
import {Container, Avatar, TextField, Grid, Button, Typography, CssBaseline, DialogContent, DialogTitle, DialogActions, Dialog, DialogContentText} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InterestsForm from "../Registration/InterestsForm";
import {withSnackbar} from "notistack";
import ProfilePicSelecter from "../ProfilePic/ProfilePicSelecter";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: "#313131",
        },
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
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
    const [croppedImage, setCroppedImage] = useState(null);

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
        if (clickedInterests && clickedInterests.length > 0) {
            firebase.updateUserInterests(clickedInterests);
        }
    }, [clickedInterests]);

    useEffect(()=>{
        if (userInfo != null) {
            if (userInfo.major&&userInfo.description) {
                firebase.updateUserBio(userInfo.major, userInfo.description);
            }
        }
    }, [userInfo]);

    const fetchUserData = (uid) => {
        firebase.user(uid).then(function (snapshot) {
            const data = snapshot.data();
            setUserInfo(data);
            setCroppedImage(data.photoURL);
            setClickedInterests(data.interests);
        })
    };

    function handleDescChange(text) {
        setUserInfo({...userInfo, description: text});
        console.log(userInfo);
    }

    //dialog
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleCloseAndSend() {
        setOpen(false);
        if (userObj)  {
            firebase.resetPassword(userObj.email).then(function () {
                props.enqueueSnackbar("We sent you an email with instructions :)",{
                    variant: 'info',
                });
            });
        }
    }

    function resetPw() {
        handleClickOpen();
    }

    return (
        <div>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Grid justify="center" direction="column" alignItems="center" container spacing={2}>
                    <Grid item xs={12}>
                        <ProfilePicSelecter croppedImage={croppedImage} setCroppedImage={setCroppedImage}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography className={classes.text} variant='h3' align='center'>{userInfo && userInfo.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth={true}
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
                            inputStyle={{ textAlign: 'center' }}
                            inputProps={{
                                maxLength: 70,
                                textAlign: "center"
                            }}
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
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
                    </Grid>
                </Grid>
            <Grid item xs={12}>
                <InterestsForm
                setClickedInterests={setClickedInterests}
                clickedInterests={clickedInterests}/>
            </Grid>
            <Grid item xs={12}>
                <Button  className={classes.btn} variant="outlined" onClick={resetPw}>Reset Password</Button>
            </Grid>
        </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Reset password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You sure buddy?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Nah
                    </Button>
                    <Button onClick={handleCloseAndSend} color="primary" autoFocus>
                        Yup
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const authenticated = authUser => !!authUser;
export default compose(
    withSnackbar,
    withAuthorization(authenticated),
)(Profile);