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
} from '@material-ui/core';

const authenticated = (authUser) => !!authUser;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    padding: 20,
    height: 900,
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
  },
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

const LunchesGrid = (props) => {
  const classes = useStyles();
  const { firebase } = props;
  const [lunches, setlunches] = useState([]);

  useEffect(() => {
    const fetchLunchData = async () => {
      let newLunch = [];
      const querySnapshot = await firebase.getFreeLunches();
      querySnapshot.forEach((doc) => {
        newLunch.push(doc);
      });
      setlunches(newLunch);
    };
    fetchLunchData();
  }, []);

  //onclick createLunches

  //onclick openProfile

  //onclick joinLunch

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
              {startTime} - {endTime}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {memberCount}/{maxMembers} are joining this lunch
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
              Request Join
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper classname={classes.paper}>
              <Paper classname={classes.paper}>
                <h3 style={{ textAlign: 'center' }}>
                  You have not created any groups.
                </h3>
                <Button
                  className="btn btn-outline-primary btn-block"
                  style={{ position: 'center' }}
                >
                  Create Group
                </Button>
              </Paper>
              <Paper classname={classes.paper}>
                <h2 style={{ textAlign: 'center' }}>
                  2 <small>Requests</small>
                </h2>
                <p style={{ textAlign: 'center' }}>are open at this time</p>
                <Button
                  className="btn btn-outline-primary btn-block"
                  style={{ position: 'center' }}
                >
                  Show
                </Button>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <h2 component="div">Available Lunches</h2>
            <Grid container>{lunchItems}</Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default compose(withAuthorization(authenticated))(LunchesGrid);