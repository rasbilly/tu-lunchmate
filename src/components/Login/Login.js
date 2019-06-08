import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import {Grid, CssBaseline,Link,Button,TextField,
  Typography,Avatar,Container} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleSubmit = e => {
    console.log("email: "+this.state.email);
    e.preventDefault();
    this.props.firebase
      .signIn(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/main');
      })
      .catch((error) => {
        console.error("error:",error);
      });
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div>
            <Avatar>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.onChange}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.onChange}
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary">
                Sign In
              </Button>
              <Grid container justify="center" direction="column" alignItems='center'>
                <Grid item  xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
    );
  }
}

export default withFirebase(Login);
