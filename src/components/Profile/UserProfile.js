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
  const { firebase, match, history } = props;
  const [userObj, setUserObj] = useState(null);

  const fetchUserData = () => {
    firebase.user(match.params.id).then(function(doc) {
      if (doc.exists) setUserObj(doc.data());
      else history.push('/main');
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <CssBaseline />
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" src={userObj && userObj.photoURL} />
          }
          title={userObj && userObj.name}
          subheader={userObj && userObj.description}
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
              <Typography>
                {userObj &&
                  userObj.interests.map((interest) => (
                    <Chip
                      style={{ marginRight: '0.2rem' }}
                      size="small"
                      label={interest}
                      color="primary"
                      component={'div'}
                    />
                  ))}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  ); //TODO: interests as chips, proper formatting, loading icon before loading infos
};

export default withFirebase(UserProfile);
