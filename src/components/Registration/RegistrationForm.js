import React, {} from 'react';
import {makeStyles, Grid, TextField, CssBaseline, Container} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
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
  const {setPW, setPW2, setFirstName, setLastName, setEmail} = props;
  const classes = useStyles();

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
                              onChange={(e) => {setFirstName(e.target.value)}}
                              label="First Name"
                              autoFocus
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              variant="outlined"
                              fullWidth
                              id="lastName"
                              label="Last Name"
                              name="lastName"
                              onChange={(e) => setLastName(e.target.value)}
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
                              onChange={(e) => {setEmail(e.target.value)}}
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
                              onChange={(e) => {
                                  setPW(e.target.value)}}
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
                              onChange={(e) => {setPW2(e.target.value)}}
                              id="repeat-password"
                          />
                      </Grid>
                  </Grid>
              </form>
      </Container>
  );
};

export default RegistrationForm;
