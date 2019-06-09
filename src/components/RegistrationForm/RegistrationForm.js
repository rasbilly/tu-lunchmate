import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import {makeStyles, Grid, TextField, CssBaseline, Container} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const RegistrationForm = (props) => {
  const { firebase, history } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [alertMessage, setalertMessage] = useState('');
  const classes = useStyles();
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== password2) {
      setalertMessage('Passwörter stimmen nicht überein');
    }
    firebase.createUser(email, password).then(() => {
      const user = firebase.auth.currentUser;
      firebase.createUserInDB(user.uid);
      user.updateProfile({ displayName: name });
      history.push('/');
    });
  };

  firebase.auth.onAuthStateChanged((user) => {
    if (user) {
      history.push('/');
    }
  });

  return (
      <Container component="main" maxWidth="xs">
          <CssBaseline />
              <form className={classes.form} noValidate>
                  <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              autoComplete="fname"
                              name="firstName"
                              variant="outlined"
                              required
                              fullWidth
                              id="firstName"
                              label="First Name"
                              autoFocus
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              variant="outlined"
                              required
                              fullWidth
                              id="lastName"
                              label="Last Name"
                              name="lastName"
                              autoComplete="lname"
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              variant="outlined"
                              required
                              fullWidth
                              id="email"
                              label="Email Address"
                              name="email"
                              autoComplete="email"
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              variant="outlined"
                              required
                              fullWidth
                              name="password"
                              label="Password"
                              type="password"
                              id="password"
                              autoComplete="current-password"
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              variant="outlined"
                              required
                              fullWidth
                              name="repeatpassword"
                              label="Repeat password"
                              type="password"
                              id="repeat-password"
                          />
                      </Grid>
                  </Grid>
              </form>
      </Container>

  );
};

export default withFirebase(RegistrationForm);
