import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { withFirebase } from '../Firebase';
import { Typography, Chip, makeStyles, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  subtitle: {
    marginBottom: theme.spacing(1),
  },
  chip: {
    margin: theme.spacing(1),
  },
}));

const InterestsForm = (props) => {
  const classes = useStyles();
  const {
    firebase,
    setClickedInterests,
    updatedInterests,
    clickedInterests,
  } = props;
  const [interests, setInterests] = useState([]);
  console.log(updatedInterests);
  useEffect(() => {
    const fetchData = async () => {
      let newInterests = [];
      const querySnapshot = await firebase.interests();
      querySnapshot.forEach((doc) => {
        newInterests.push({ id: doc.id, title: doc.data().title });
      });
      if (updatedInterests) setUpdateData(newInterests, updatedInterests);
      else setInterests(newInterests);
    };
    fetchData();
  }, []);

  const setUpdateData = (unClInterests, clInterests) => {
    const newClickedInterests = unClInterests.filter((element) =>
      clInterests.includes(element.title),
    );
    const newInterests = unClInterests.filter(
      (element) => !clInterests.includes(element.title),
    );
    setClickedInterests(newClickedInterests);
    setInterests(newInterests);
  };

  const handleClick = (clickedInterest) => {
    const newClickedInterest = interests.find(
      (item) => item.title === clickedInterest.title,
    );
    const newInterests = interests.filter(
      (item) => item.title !== clickedInterest.title,
    );

    setInterests(newInterests);
    setClickedInterests([...clickedInterests, newClickedInterest]);
  };

  const handleUnClick = (clickedInterest) => {
    const newInterest = clickedInterests.find(
      (item) => item.id === clickedInterest.id,
    );
    const newClickedInterests = clickedInterests.filter(
      (item) => item.id !== clickedInterest.id,
    );

    setInterests([...interests, newInterest]);
    setClickedInterests(newClickedInterests);
  };

  const interestsItems = interests.map((interest, index) => {
    return (
      <Chip
        key={index}
        className={classes.chip}
        label={interest.title}
        key={interest.id}
        clickable
        onClick={() => handleClick(interest)}
      />
    );
  });

  const clickedInterestsItems = clickedInterests.map((interest, index) => {
    return (
      <Chip
        key={index}
        className={classes.chip}
        label={interest.title}
        key={interest.id}
        color="primary"
        clickable
        onClick={() => handleUnClick(interest)}
      />
    );
  });

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {clickedInterestsItems}
        </Grid>
        <Grid item xs={12}>
          {interestsItems}
        </Grid>
      </Grid>
    </>
  );
};

export default withFirebase(InterestsForm);
