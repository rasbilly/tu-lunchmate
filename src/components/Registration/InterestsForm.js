import React, { useState, useEffect } from 'react';
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
  const { firebase , setClickedInterests, clickedInterests, interests, setinterests} = props;

  useEffect(() => {
    const fetchData = async () => {
      let newInterests = [];
      const querySnapshot = await firebase.interests();
      querySnapshot.forEach((doc) => {
        newInterests.push(doc.data().title);
      });
      setinterests(newInterests);
      console.log(newInterests);
    };
    fetchData();
  }, []);

  const handleClick = (clickedInterest) => {
    const newClickedInterest = interests.find(
      (item) => item === clickedInterest,
    );
    const newInterests = interests.filter(
      (item) => item !== clickedInterest,
    );

    setinterests(newInterests);
    setClickedInterests([...clickedInterests, newClickedInterest]);
    console.log(clickedInterests);
  };

  const handleUnClick = (clickedInterest) => {
    const newInterest = clickedInterests.find(
      (item) => item === clickedInterest,
    );
    const newClickedInterests = clickedInterests.filter(
      (item) => item !== clickedInterest,
    );

    setinterests([...interests, newInterest]);
    setClickedInterests(newClickedInterests);
  };

  const interestsItems = interests.map((interest) => {
    return (
      <Chip
        className={classes.chip}
        label={interest}
        key={interest}
        clickable
        onClick={() => handleClick(interest)}
      />
    );
  });

  const clickedInterestsItems = clickedInterests.map((interest) => {
    return (
      <Chip
        className={classes.chip}
        label={interest}
        key={interest}
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
