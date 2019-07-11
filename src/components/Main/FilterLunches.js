import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Menu, MenuItem, Typography } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { withFirebase } from '../Firebase';
import InterestsForm from '../Registration/InterestsForm';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

function FilterLunches({ firebase, setlunches }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [clickedInterests, setClickedInterests] = useState([]);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);

  const handleStartTimeChange = (date) => setStartDate(date);
  const handleEndTimeChange = (date) => setEndDate(date);

  const [values, setValues] = useState({
    maxMembers: undefined,
  });

  function handleChange(event) {
    setValues((oldValues) => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick2(event) {
    setAnchorEl2(event.currentTarget);
  }

  function handleClose2() {
    setAnchorEl2(null);
  }

  function handleClick3(event) {
    setAnchorEl3(event.currentTarget);
    if (!startDate) {
      setStartDate(new Date());
      setEndDate(new Date());
    }
  }

  function handleClose3() {
    setAnchorEl3(null);
  }

  function handleAmountSubmit(e) {
    e.preventDefault();

    firebase
      .filter({ ...values, clickedInterests, startDate, endDate })
      .then((querySnapshot) => {
        let filteredLunches = [];
        let uid = firebase.auth.currentUser.uid;

        querySnapshot.forEach((doc) => {
          const { owner, maxMembers, memberCount, interests } = doc.data();
          const matchesInterests = clickedInterests.every((clickedInterest) =>
            interests.includes(clickedInterest),
          );

          if (owner !== uid && memberCount < maxMembers && matchesInterests) {
            filteredLunches.push(doc.data());
          }
        });
        setlunches(filteredLunches);
      });
  }

  function removeFilter(e) {
    firebase.getFreeLunches().then((querySnapshot) => {
      setClickedInterests([]);
      setStartDate(null);
      setEndDate(null);
      setValues({ maxMembers: '' });
      handleAmountSubmit(e);
    });
  }

  return (
    <div>
      <Typography component="h3" variant="h5" style={{ marginBottom: 16 }}>
        Filter
      </Typography>
      <div style={{ marginBottom: 16 }}>
        <Button
          aria-controls="simple-menu"
          variant="contained"
          color="primary"
          className={classes.button}
          aria-haspopup="true"
          style={{ marginRight: 16 }}
          onClick={handleClick}
        >
          Amount of People
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <form className={classes.root} autoComplete="off" style={{ marginLeft: "1em", marginRight:"1em"}}>
            <FormControl className={classes.formControl} >
              <InputLabel htmlFor="maxMembers">Amount</InputLabel>
              <Select
                value={values.maxMembers}
                onChange={handleChange}
                inputProps={{
                  name: 'maxMembers',
                  id: 'maxMembers',
                }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleAmountSubmit}
              color="primary"
              variant="contained"
              className={classes.root}
            >
              Save
            </Button>
          </form>
        </Menu>
        <Button
          aria-controls="simple-menu2"
          variant="contained"
          style={{ marginRight: 16 }}
          color="primary"
          className={classes.button}
          aria-haspopup="true"
          onClick={handleClick2}
        >
          Interests
        </Button>
        <Menu
          id="simple-menu2"
          anchorEl={anchorEl2}
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
        >
          <form className={classes.root} autoComplete="off" style={{ marginLeft: "1em", marginRight:"1em"}}>
            <InterestsForm
              clickedInterests={clickedInterests}
              setClickedInterests={setClickedInterests}
            />
            <Button
              onClick={handleAmountSubmit}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </form>
        </Menu>
        <Button
          aria-controls="simple-menu2"
          className={classes.button}
          variant="contained"
          style={{ marginRight: 16 }}
          color="primary"
          aria-haspopup="true"
          onClick={handleClick3}
        >
          Start Time
        </Button>
        <Menu
          id="simple-menu3"
          anchorEl={anchorEl3}
          keepMounted
          open={Boolean(anchorEl3)}
          onClose={handleClose3}
        >
          <form className={classes.root} autoComplete="off" style={{ marginLeft: "1em", marginRight:"1em"}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                label="From"
                onChange={handleStartTimeChange}
                value={startDate}
                ampm={false}
                margin="dense"
              />
              <TimePicker
                label="Till"
                onChange={handleEndTimeChange}
                value={endDate}
                ampm={false}
                margin="dense"
              />
            </MuiPickersUtilsProvider>
            <Button
              onClick={handleAmountSubmit}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </form>
        </Menu>
        <Button onClick={removeFilter} className={classes.button}>
          Remove Filters
        </Button>
      </div>
    </div>
  );
}

export default withFirebase(FilterLunches);
