import React from 'react';
import logo from '../img/logo_lunchmate.png';
import './components.css';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Container, Typography, Grid, Button, CssBaseline} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    heroContent: {
        backgroundImage: 'url(https://i.imgur.com/tNyLbzJ.png)',
        backgroundPosition: "center center",
        backgroundSize: "cover",
        padding: theme.spacing(8, 0,20),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    signInButton: {
        color: '#ffffff',
        borderColor: '#ffffff'
    },
    text: {
        color: '#ffffff'
    }
}));

export default function LandingPage (props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <CssBaseline/>
            <div className={classes.heroContent}>
                <Grid container alignItems='center' direction='column'>
                    <img src={logo} className="App-logo" alt="logo" style={
                        {
                            resizeMode: 'center',
                            width: 'auto',
                        }
                    }/>
                </Grid>
                <Container maxWidth="sm">
                    <Typography component="h1"  className={classes.text} variant="h3" align="center" color="textPrimary" gutterBottom>
                        Lunch with your classmates.
                    </Typography>
                    <Typography variant="h5" align="center" className={classes.text} color="textSecondary" paragraph>
                        Eat and talk about common interests. <br/> I have no idea what else to put in here.
                    </Typography>
                    <div className={classes.heroButtons}>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                    <Button variant="contained" color="primary" onClick={() => props.history.push('/register')}>
                                        Register now
                                    </Button>
                            </Grid>
                            <Grid item>
                                <Button className={classes.signInButton} variant="outlined"  onClick={() => props.history.push('/login')}>
                                    Sign in
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>

            <footer className={classes.footer}>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Skalierbare Systeme 2019
                </Typography>
            </footer>
        </React.Fragment>
    );
}