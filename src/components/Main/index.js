import React, { useEffect, useState } from 'react';
import withAuthorization from '../Session/authorization';
import { compose } from 'recompose';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Paper,
  Card,
  CardActions,
  CardContent,
  Chip,
  Fab,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CreateLunch from '../CreateLunch/CreateLunch';

const authenticated = (authUser) => !!authUser;

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 20,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
    padding: theme.spacing(1, 3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    margin: `${theme.spacing(1)}px auto`,
  },
  card: {
    maxWidth: 345,
    marginRight: 10,
    marginBottom: 20,
  },
  media: {
    height: 140,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
  },
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  fab: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
}));

const LunchesGrid = (props) => {
  const classes = useStyles();
  const { firebase } = props;
  const [lunches, setlunches] = useState([]);
  const [createdLunch, setCreatedLunch] = useState(false);

  useEffect(() => {
    const fetchLunchData = async () => {
      let newLunch = [];
      const querySnapshot = await firebase.getFreeLunches();
      querySnapshot.forEach((doc) => {
          console.log(doc)
        newLunch.push(doc);
      });
      setlunches(newLunch);
    };
    fetchLunchData();
  }, [createdLunch]);

  //Zählt meine Lunches durch und gibt sie summiert als Zahl aus
  const [count, setCount] = useState('');
  function countMyLunches() {
    firebase.auth.onAuthStateChanged(function(user) {
      if (user) {
        const fetchOwnLunches = async () => {
          let z = 0;
          const qs = await firebase.getOwnLunches();
          qs.forEach(() => {
            z += 1;
          });
          setCount(z);
        };
        fetchOwnLunches();
      }
    });
    return count > 0;
  }

  //onclick openProfile

  //onclick joinLunch

  const ShowMyLunches = () => {
    if (countMyLunches()) {
      return (
        <div>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            You have created
          </Typography>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            {count}
            <small> Lunches.</small>
          </Typography>
        </div>
      );
    } else {
      return <div className="hello">You have not created any Lunches.</div>;
    }
  };

  const lunchItems = lunches.map((lunch, index) => {
    const {
      description,
      title,
      mensa,
      interests,
      endTimeStamp,
      startTimeStamp,
      memberCount,
      maxMembers,
    } = lunch;

    const startTime = startTimeStamp
      .toDate()
      .toLocaleTimeString()
      .slice(0, -3);
    const date = startTimeStamp
      .toDate()
      .toLocaleDateString()
      .replace('/', '.')
      .replace('/', '.'); //too lazy to write a proper replaceAll, sorry
    const endTime = endTimeStamp
      .toDate()
      .toLocaleTimeString()
      .slice(0, -3);

    const chips = interests.map((interest, index) => (
      <Chip
        key={index}
        size="small"
        label={interest}
        color="primary"
        className={classes.chip}
      />
    ));

    return (
      <Grid key={index} item xs={12} sm={6}>
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography color="textSecondary" component="p">
              {description}
            </Typography>

            <Typography variant="body2" color="textSecondary" component="p">
              {startTime} - {endTime} on {date}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Mensa: {mensa}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {memberCount}/{maxMembers} have joined
            </Typography>
            {chips}
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              size="small"
            >
              Join
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  const [createLunchOpen, setCreateLunchOpen] = useState(false);

  function handleClickOpen() {
    setCreateLunchOpen(!createLunchOpen);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <Grid container direction="column" wrap="nowrap" spacing={3}>
            <Grid item xs={6}>
              <Paper classname={classes.paper}>
                <Typography variant="h6" style={{ textAlign: 'center' }}>
                  <ShowMyLunches />
                </Typography>
                <Button
                  onClick={handleClickOpen}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ position: 'center' }}
                >
                  Create Lunch
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper classname={classes.paper}>
                <Typography variant="h6" style={{ textAlign: 'center' }}>
                  You have joined
                </Typography>
                <Typography variant="h5" style={{ textAlign: 'center' }}>
                  2 <small>Lunches</small>
                </Typography>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  style={{ position: 'center' }}
                >
                  Show
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Typography component="h1" variant="h2">
            Available Lunches
          </Typography>
          <Grid container>
            {lunchItems ? (
              lunchItems
            ) : (
              <Typography variant="h4">
                Looks like there aren't any free lunches :(
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Fab
        color="secondary"
        aria-label="Add"
        className={classes.fab}
        onClick={() => setCreateLunchOpen(true)}
      >
        <AddIcon />
      </Fab>
      <CreateLunch
        firebase={firebase}
        active={createLunchOpen}
        setCreatedLunch={setCreatedLunch}
      />
    </div>
  );
};

export default compose(withAuthorization(authenticated))(LunchesGrid);
