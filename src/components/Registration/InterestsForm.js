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
  const { firebase , setClickedInterests, clickedInterests} = props;
  const [interests, setinterests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let newInterests = [];
      const querySnapshot = await firebase.interests();
      querySnapshot.forEach((doc) => {
        newInterests.push({ id: doc.id, title: doc.data().title });
      });
      setinterests(newInterests);
    };
    fetchData();
  }, []);

  const handleClick = (clickedInterest) => {
    const newClickedInterest = interests.find(
      (item) => item.id === clickedInterest.id,
    );
    const newInterests = interests.filter(
      (item) => item.id !== clickedInterest.id,
    );

    setinterests(newInterests);
    setClickedInterests([...clickedInterests, newClickedInterest]);
  };

  const handleUnClick = (clickedInterest) => {
    const newInterest = clickedInterests.find(
      (item) => item.id === clickedInterest.id,
    );
    const newClickedInterests = clickedInterests.filter(
      (item) => item.id !== clickedInterest.id,
    );

    setinterests([...interests, newInterest]);
    setClickedInterests(newClickedInterests);
  };

  const interestsItems = interests.map((interest) => {
    return (
      <Chip
        className={classes.chip}
        label={interest.title}
        key={interest.id}
        clickable
        onClick={() => handleClick(interest)}
      />
    );
  });

  const clickedInterestsItems = clickedInterests.map((interest) => {
    return (
      <Chip
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
      <Typography className={classes.subtitle}>
        Select your Interests
      </Typography>
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
