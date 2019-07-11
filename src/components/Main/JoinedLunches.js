import React, { useState, useEffect, useRef } from 'react';
import { withFirebase } from '../Firebase';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Table,
} from '@material-ui/core';
import LunchItem from './LunchItem';

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  column: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 2,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
  },
}));

const JoinedLunches = (props) => {
  const classes = useStyles();
  const { firebase, setUpdateLunches, updateLunches } = props;
  const [joinedLunches, setJoinedLunches] = useState([]);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [updateLunchData, setUpdateLunchData] = useState();

  useEffect(() => {
    const fetchJoinedLunchData = async () => {
      let newJoinedLunches = [];
      const querySnapshot = await firebase.getJoinedLunches();
      querySnapshot.forEach((doc) => {
        newJoinedLunches.push({ id: doc.id, data: doc.data() });
      });
      console.log('joinedlunch');
      setJoinedLunches(newJoinedLunches);
    };
    fetchJoinedLunchData();
  }, [hasUpdated]);

  const leaveLunch = (id) => {
    firebase.leaveLunch(id).then(() => {
      setHasUpdated(!hasUpdated);
      setUpdateLunches(!updateLunches);
    });
  };

  const joinedLunchItems = joinedLunches.map((lunch, index) => {
    const {
      description,
      title,
      mensa,
      interests,
      endTimeStamp,
      startTimeStamp,
      members,
      owner,
    } = lunch.data;

    const allMembers = [...members, owner];
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
        component={'div'}
      />
    ));

    return (
      <LunchItem
        key={lunch.id}
        id={lunch.id}
        index={index}
        title={title}
        members={allMembers}
        description={description}
        chips={chips}
        mensa={mensa}
        date={date}
        startTime={startTime}
        endTime={endTime}
        leaveLunch={leaveLunch}
      />
    );
  });

  return (
    <Grid container spacing={3}>
      {joinedLunchItems}
    </Grid>
  );
};

export default withFirebase(JoinedLunches);
