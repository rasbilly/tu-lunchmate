import React, { useEffect, useState } from 'react';
import { withFirebase } from '../Firebase';
import {
  Avatar,
  Typography,
  Grid,
  Container,
  CssBaseline,
  Card,
  CardHeader,
  CardContent,
  Chip,
} from '@material-ui/core';

const UserProfile = (props) => {
  const { firebase, history, uid } = props;
  const [userObj, setUserObj] = useState(null);

  const fetchUserData = () => {
    firebase.user(uid).then(function(doc) {
      console.log(
        doc.data().description !==
          "You don't have a description yet. Click here to change that",
      );
      if (doc.exists) setUserObj(doc.data());
      else history.push('/main');
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" src={userObj && userObj.photoURL} />
        }
        title={userObj && userObj.name}
        subheader={
          userObj &&
          userObj.description !==
            "You don't have a description yet. Click here to change that" &&
          userObj.description
        }
      />
      <CardContent>
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
            {userObj &&
              userObj.interests.map((interest) => (
                <Chip
                  key={interest}
                  style={{ marginRight: '0.2rem', marginBottom: '0.3rem' }}
                  size="small"
                  label={interest}
                  color="primary"
                  component={'div'}
                />
              ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ); //TODO: interests as chips, proper formatting, loading icon before loading infos
};

export default withFirebase(UserProfile);
