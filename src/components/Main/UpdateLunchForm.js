import React, { useState, useEffect } from 'react';
import withAuthorization from '../Session/authorization';
import { withSnackbar } from 'notistack';
import { compose } from 'recompose';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from '@material-ui/pickers';
import InterestsForm from '../Registration/InterestsForm';

const authenticated = (authUser) => !!authUser;

const UpdateLunchForm = (props) => {
  const {
    firebase,
    dialogTitle,
    active,
    setActive,
    lunch,
    setHasUpdated,
    hasUpdated,
    setUpdateLunches,
    updateLunches,
  } = props;

  //create lunch attributes
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxMembers, setMaxmembers] = useState(2);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [clickedInterests, setClickedInterests] = useState([]);
  const [mensa, setMensa] = useState('');

  useEffect(() => {
    if (lunch) setData(lunch.data);
  }, [lunch]);

  const setData = (data) => {
    const start = data.startTimeStamp.toDate();
    const end = data.endTimeStamp.toDate();
    setTitle(data.title);
    setStartDate(start);
    setEndDate(end);
    setMensa(data.mensa);
    setDesc(data.description);
    setClickedInterests(data.interests);
    setMaxmembers(data.maxMembers);
  };

  const menuItems = () => {
    let its = [];
    for (let i = 2; i < 7; i++)
      its.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>,
      );
    return its;
  };

  const handleSubmit = () => {
    endDate.setDate(startDate.getDate());
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    firebase
      .updateLunch(
        title,
        desc,
        clickedInterests,
        startDate,
        endDate,
        maxMembers,
        mensa,
        lunch.id,
      )
      .then(function() {
        props.enqueueSnackbar('Lunch updated!', {
          variant: 'success',
        });
        setActive(false);
        console.log(clickedInterests);
        setHasUpdated(!hasUpdated);
        setUpdateLunches(!updateLunches);
      });
  };

  return (
    <Dialog
      open={active}
      onClose={() => setActive(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          label="Title"
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          onChange={(e) => {
            setDesc(e.target.value);
          }}
          value={desc}
          id="description"
          label="Description"
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          onChange={(e) => {
            setMensa(e.target.value);
          }}
          value={mensa}
          id="mensa"
          label="Mensa"
          type="text"
          fullWidth
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Lunch start time"
            onChange={(date) => setStartDate(date)}
            value={startDate}
            ampm={false}
            margin="dense"
          />
          <TimePicker
            label="Lunch end time"
            onChange={(date) => setEndDate(date)}
            value={endDate}
            ampm={false}
            margin="dense"
          />
        </MuiPickersUtilsProvider>
        <InputLabel htmlFor="maxMembers-select">
          Max amount of members
        </InputLabel>
        <Select
          value={maxMembers}
          onChange={(e) => {
            setMaxmembers(e.target.value);
          }}
          inputProps={{
            name: 'maxMembers',
            id: 'maxMembers-select',
          }}
        >
          {menuItems()}
        </Select>
        <InterestsForm
          setClickedInterests={setClickedInterests}
          clickedInterests={clickedInterests}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setActive(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withSnackbar,
  withAuthorization(authenticated),
)(UpdateLunchForm);
