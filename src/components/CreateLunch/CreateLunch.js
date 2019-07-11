import React, { useState, useEffect } from 'react';
import {
  makeStyles,
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
import { withSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
  margin: {
    marginTop: 8,
    marginBottom: 4,
  },
  select: {
    marginBottom: 12,
  },
}));

const CreateLunch = (props) => {
  const classes = useStyles();
  const { firebase, active, setCreatedLunch } = props;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxMembers, setMaxMembers] = useState(2);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [clickedInterests, setClickedInterests] = useState([]);
  const [mensa, setMensa] = useState('');
  const [handleOpen, setHandleOpen] = useState(false);

  useEffect(() => {
    return () => {
      setHandleOpen(true);
    };
  }, [active]);

  const handleClose = () => {
    setHandleOpen(false);
  };

  const clearState = () => {
    setMaxMembers(2);
    setTitle('');
    setDesc('');
    setClickedInterests([]);
    setMensa('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const handleCreateLunch = () => {
    endDate.setDate(startDate.getDate());
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    if (title === '') {
      props.enqueueSnackbar('Missing Title!', {
        variant: 'error',
      });
    } else {
      firebase
        .createLunch(
          title,
          desc,
          clickedInterests.map((interest) => interest.title),
          startDate,
          endDate,
          maxMembers,
          mensa,
        )
        .then(function() {
          props.enqueueSnackbar('Lunch created!', {
            variant: 'success',
          });
          setCreatedLunch(true);
          setHandleOpen(false);
          clearState();
        })
        .catch();
    }
  };

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" onClose={handleClose}>
        Create Lunch
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          required
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
        <MuiPickersUtilsProvider
          className={classes.margin}
          utils={DateFnsUtils}
        >
          <DateTimePicker
            label="Lunch start time"
            onChange={setStartDate}
            value={startDate}
            ampm={false}
            margin="dense"
          />
          <TimePicker
            label="Lunch end time"
            onChange={setEndDate}
            value={endDate}
            ampm={false}
            margin="dense"
          />
        </MuiPickersUtilsProvider>
        <InputLabel htmlFor="maxMembers-select" className={classes.margin}>
          Max amount of members
        </InputLabel>
        <Select
          value={maxMembers}
          onChange={(e) => {
            setMaxMembers(e.target.value);
          }}
          inputProps={{
            name: 'maxMembers',
            id: 'maxMembers-select',
          }}
          className={classes.select}
        >
          <MenuItem value={2}>Two</MenuItem>
          <MenuItem value={3}>Three</MenuItem>
          <MenuItem value={4}>Four</MenuItem>
          <MenuItem value={5}>Five</MenuItem>
          <MenuItem value={6}>Six</MenuItem>
        </Select>
        <InterestsForm
          setClickedInterests={setClickedInterests}
          clickedInterests={clickedInterests}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreateLunch} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withSnackbar(CreateLunch);
