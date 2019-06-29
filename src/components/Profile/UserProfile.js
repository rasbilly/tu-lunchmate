import React, {useEffect, useState} from 'react';
import {withFirebase} from "../Firebase";
import {Avatar, Typography, Grid, Container, CssBaseline} from "@material-ui/core";

const UserProfile = (props) => {
    const {firebase, uid} = props;
    const [userObj, setUserObj] = useState(null);

    const fetchUserData = () => {
        firebase.user(uid).then(function (doc) {
            setUserObj(doc.data());
        })
    };

    useEffect(()=> {
        fetchUserData();
    },[]);

    return (
        <Grid conatiner component="main" maxWidth="sm" direction="column">
            <CssBaseline/>
            <Grid item xs={12}>
                <Avatar align='center' src={userObj && userObj.photoURL}/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h3'>{userObj && userObj.name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h4'>{userObj && userObj.description}</Typography>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Typography>Major: </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{userObj && userObj.major}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>Interests: </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{userObj && userObj.interests.join()}</Typography>
                </Grid>
            </Grid>
        </Grid>
    ); //TODO: interests as chips, proper formatting, loading icon before loading infos
};

export default withFirebase(UserProfile);
