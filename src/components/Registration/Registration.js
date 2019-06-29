import React, {useEffect, useState} from 'react';
import {
    makeStyles,
    Typography,
    Paper,
    Step,
    Stepper,
    Button,
    StepLabel, CircularProgress,
    Container
} from '@material-ui/core';
import RegistrationForm from './RegistrationForm';
import ProfilePicForm from './ProfilePicForm';
import InterestsForm from './InterestsForm';
import {withSnackbar} from "notistack";
import {withFirebase} from "../Firebase";

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
  },
  appBar: {
    position: 'relative',
  },
  layout: {
    backgroundColor: '#ffffff',
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Account', 'Profile Info', 'Interests'];

const Registration = (props) => {
    const { history, firebase} = props;
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [nextDisabled, setNextDisabled] = React.useState(true);
    //data vars
        //registration form
        const [password, setPassword] = useState('');
        const [password2, setPassword2] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('');
        //profile pic form
        const [major, setMajor] = useState('');
        const [croppedImage, setCroppedImage] = useState(null);
        //interests form
        const [clickedInterests, setClickedInterests] = useState([]);
        //submission
        const [finished, setFinished] = useState(false);


    function submitRegistration() {
        const name = lastName? firstName+' '+lastName : firstName;
        firebase.createUser(email, password).then(function () { //creates user in auth db
            const uid = firebase.auth.currentUser.uid;
            firebase.createUserInDB(uid, major, clickedInterests, name).then(async function () { //creates user in regular db
                let blob = await fetch(croppedImage).then(r => r.blob());
                firebase.uploadProfilePic(blob).then(function () { //uploads profile picture to storage
                    firebase.profilePicURL().then(function (url) { //gets the url of the profile picture
                        firebase.setProfile(name, url).then(function () { //sets the profile in the auth db
                            console.log("success");
                            setFinished(true);
                        })
                    }).catch(function (error) {
                        console.error("error getting profileurl:",error);
                    })
                }).catch(function (error) {
                    console.error("error uploading picture:",error);
                })
            })
        })
    }

    const handleNext = () => {
        switch (activeStep) {
            case 0: //clicked next on registrationform
                if (password !== password2) {
                    props.enqueueSnackbar("Passwords don't match",{
                        variant: 'warning',
                    });
                } else if (password.length < 6) {
                    props.enqueueSnackbar("Password should be at least 6 characters long", {
                        variant: 'warning'
                    });
                } else {
                    setActiveStep(activeStep + 1);
                }
                break;
            case 1: //-"- profilepicform
                if(!major) {
                    props.enqueueSnackbar('You forgot to select your major!',{
                        variant: 'warning',
                    })
                } else if (!croppedImage) {
                    props.enqueueSnackbar('You have to select a profile picture first',{
                        variant: 'warning',
                    })
                } else {
                    setActiveStep(activeStep+1);
                }
                break;
            case 2: //interestsform
                if(clickedInterests.length === 0) {
                    props.enqueueSnackbar('You have to select some interests first',{
                        variant: 'warning',
                    })
                } else {
                    setActiveStep(activeStep+1);
                    submitRegistration();
                }
                break;
            default:
                setActiveStep(activeStep + 1);
                break;
        }
    };

    const handleBack = () => {
    setActiveStep(activeStep - 1);
    };

    const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <RegistrationForm setNextDisabled={setNextDisabled}
                                 setEmail={setEmail}
                                 setFirstName={setFirstName}
                                 setLastName={setLastName}
                                 setPW={setPassword}
                                 setPW2={setPassword2}/>;
      case 1:
        return <ProfilePicForm  setMajor={setMajor} major={major} setCroppedImage={setCroppedImage} croppedImage={croppedImage}/>;
      case 2:
        return <InterestsForm setClickedInterests={setClickedInterests} clickedInterests={clickedInterests}/>;
      default:
        throw new Error('Unknown step');
    }
    };

    useEffect(() => {
        setNextDisabled(
            0===firstName.length||0===email.length||0===password.length||0===password2.length //registration form
        );
    });

    return (
    <main className={classes.layout}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          Register
        </Typography>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <React.Fragment>
                {finished ? (
                    <div className={classes.loading}>
                        <Typography variant="h5" gutterBottom>
                            Thank you for joining Lunchmate.
                        </Typography>
                        <Button variant="contained" color="primary" href='#' onClick={() => history.push('/main')}>
                            Go to main page
                        </Button>
                    </div>
                ): (
                    <div className={classes.loading}>
                        <CircularProgress/>
                        <Typography variant='h5' gutterBottom>Finishing up...</Typography>
                    </div>
                )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button} href='#'>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={nextDisabled}
                  className={classes.button} href='#'>
                  {activeStep === steps.length - 1 ? 'Complete ' : 'Next'}
                </Button>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </Paper>
    </main>
    );
};

export default withFirebase(withSnackbar(Registration));
