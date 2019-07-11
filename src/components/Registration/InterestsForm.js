import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase';
import { Chip, makeStyles, Grid } from '@material-ui/core';

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
    clickedInterests,
  } = props;
  const [interests, setInterests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let newInterests = [];
      const querySnapshot = await firebase.interests();
      querySnapshot.forEach((doc) => {
        newInterests.push(doc.data().title);
      });

      setInterests(newInterests.filter((i) => !clickedInterests.includes(i)));
    };
    fetchData();
  }, [clickedInterests, firebase]);

  useEffect(()=>{
    console.log("this has happened motherfucker");
    const newinterests = interests.filter(
        (element) => !clickedInterests.includes(element)
    );
    setInterests(newinterests);
  },[clickedInterests, interests]);

  const handleClick = (clickedInterest) => {
    console.log("click!");
    const newClickedInterest = interests.find(
      (item) => item === clickedInterest,
    );
    setClickedInterests([...clickedInterests, newClickedInterest]);
  };

  const handleUnClick = (clickedInterest) => {
    const newInterest = clickedInterests.find(
      (item) => item === clickedInterest
    );
    const newClickedInterests = clickedInterests.filter(
      (item) => item !== clickedInterest,
    );

    setInterests([...interests, newInterest]);
    setClickedInterests(newClickedInterests);
  };

  const interestsItems = interests.map((interest, index) => {
    return (
      <Chip
        key={index}
        className={classes.chip}
        label={interest}
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
        label={interest}
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
