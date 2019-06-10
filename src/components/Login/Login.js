import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container, CssBaseline, Button, Typography,
    TextField, Grid, Link, Avatar} from "@material-ui/core";
import icon from "../../img/roundedicon.png";

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
    bigAvatar: {
        width: 60,
        height: 60,
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function SignIn(props) {
    const { firebase, history } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setalertMessage] = useState('');
    const classes = useStyles();

    const handleSubmit = (event) => {
        event.preventDefault();
        firebase
            .signIn(email, password)
            .then(() => {
                history.push('/main');
            })
            .catch((error) => {
                setalertMessage(error.message);
            });
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.bigAvatar} alt="Lunchmate Icon" src={icon} />
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Sign In
                    </Button>
                    <Grid container alignItems='center' direction='column'>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password? Click here
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
export default withFirebase(SignIn);
