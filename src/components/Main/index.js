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
  Collapse,
  SwipeableDrawer,
  Fab,
  Divider,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Table,
  Avatar,
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from '@date-io/date-fns';
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  TimePicker,
} from '@material-ui/pickers';
import AddIcon from '@material-ui/icons/Add';
import CreateLunch from '../CreateLunch/CreateLunch';
import Profile from '../Profile/Profile';
import InterestsForm from '../Registration/InterestsForm';
import OwnLunches from './OwnLunches';
import JoinedLunches from './JoinedLunches';
import { withSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircle } from '@material-ui/icons';
import FilterLunches from './FilterLunches';
import LunchItem from './LunchItem';

const authenticated = (authUser) => !!authUser;

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: '#eeeeee',
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
  media: {
    height: 0,
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
    backgroundColor: '#db4444',
    color: 'white',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  column: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 2,
  },
  drawer: {
    background: '#313131',
  },
}));

const LunchesGrid = (props) => {
  const classes = useStyles();
  const { firebase } = props;
  const [lunches, setlunches] = useState([]);
  const [createLunchOpen, setCreateLunchOpen] = useState(false);
  const [ownExpanded, setOwnExpanded] = useState(false);
  const [joinedExpanded, setJoinedExpanded] = useState(false);
  const [memberObj, setMemberObj] = useState(null);

  //create lunch attributes
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxMembers, setMaxmembers] = useState(2);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [clickedInterests, setClickedInterests] = useState([]);
  const [mensa, setMensa] = useState('');
  const [updateLunches, setUpdateLunches] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchLunchData = async () => {
      let newLunch = [];
      const querySnapshot = await firebase.getFreeLunches();
      const sortedSnapshot = await firebase.sortLunchesByInterests(
        querySnapshot,
      );
      sortedSnapshot.forEach((doc) => {
        console.log(doc);

        if (
          !doc.members.includes(firebase.auth.currentUser.uid) &&
          !(doc.owner == firebase.auth.currentUser.uid)
        ) {
          newLunch.push(doc);
        }
      });
      setlunches(newLunch);
      countOwnLunches();
    };
    fetchLunchData();
  }, [updateLunches]);

  //Zählt meine Lunches durch und gibt sie summiert als Zahl aus
  const [count, setCount] = useState('');

  function countOwnLunches() {
    firebase.auth.onAuthStateChanged(function(user) {
      if (user) {
        const fetchOwnLunches = async () => {
          let z = 0;
          const qs = await firebase.getOwnLunches();
          qs.forEach((doc) => {
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
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  let showLunches = (
    <div className="hello">
      You haven't created any Lunches. See that red plus in the corner?
    </div>
  );
  if (countOwnLunches()) {
    showLunches = (
      <Card>
        <Typography variant="h5" style={{ textAlign: 'center' }}>
          <small>You have created </small>
          {count}
          <small> Lunch(es)</small>
        </Typography>
        <CardActions>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: ownExpanded,
            })}
            onClick={handleOwnExpandClick}
            aria-expanded={ownExpanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={ownExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <OwnLunches
              updateLunches={updateLunches}
              setUpdateLunches={setUpdateLunches}
            />
          </CardContent>
        </Collapse>
      </Card>
    );
  }

  function handleOwnExpandClick() {
    setOwnExpanded(!ownExpanded);
  }

  //do same with joined lunches
  const [num, setNum] = useState('');

  function countJoinedLunches() {
    firebase.auth.onAuthStateChanged(function(user) {
      if (user) {
        const fetchJoinedLunches = async () => {
          let y = 0;
          const queryS = await firebase.getJoinedLunches();
          queryS.forEach((doc) => {
            y += 1;
          });
          setNum(y);
        };
        fetchJoinedLunches();
      }
    });
    return num > 0;
  }

  const ShowJoinedLunches = () => {
    if (countJoinedLunches()) {
      return (
        <Card>
          <Typography variant="h5" style={{ textAlign: 'center' }}>
            <small>You have joined </small>
            {num}
            <small> Lunch(es)</small>
          </Typography>
          <CardActions>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: joinedExpanded,
              })}
              onClick={handleJoinedExpandClick}
              aria-expanded={joinedExpanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={joinedExpanded} timeout="auto" unmountOnExit>
            <CardContent>
              <JoinedLunches
                updateLunches={updateLunches}
                setUpdateLunches={setUpdateLunches}
              />
            </CardContent>
          </Collapse>
        </Card>
      );
    } else {
      return <div className="hello">You haven't joined any Lunches.</div>;
    }
  };

  function handleJoinedExpandClick() {
    setJoinedExpanded(!joinedExpanded);
  }

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
      id,
      members,
      owner,
    } = lunch;

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
        members={allMembers}
        id={id}
        index={index}
        title={title}
        description={description}
        chips={chips}
        mensa={mensa}
        date={date}
        startTime={startTime}
        endTime={endTime}
        memberCount={memberCount}
        maxMembers={maxMembers}
        onJoinLunch={onJoinLunch}
      />
    );
  });

  function onJoinLunch(id) {
    const props1 = props;
    firebase
      .joinLunch(id)
      .then(function() {
        props1.enqueueSnackbar('Lunch joined!', {
          variant: 'success',
        });
        setCreateLunchOpen(false);
        setUpdateLunches(!updateLunches);
        countJoinedLunches();
      })
      .catch();
  }

  function onCreateLunch() {
    const props1 = props;
    endDate.setDate(startDate.getDate());
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    firebase
      .createLunch(
        title,
        desc,
        clickedInterests,
        startDate,
        endDate,
        maxMembers,
        mensa,
      )
      .then(function() {
        props1.enqueueSnackbar('Lunch created!', {
          variant: 'success',
        });
        setCreateLunchOpen(false);
        setUpdateLunches(!updateLunches);
      })
      .catch();
  }

  function handleCloseCreateLunch() {
    setCreateLunchOpen(false);
  }

  const handleStartTimeChange = (date) => setStartDate(date);
  const handleEndTimeChange = (date) => setEndDate(date);

  const menuItems = () => {
    let its = [];
    for (let i = 2; i < 7; i++) its.push(<MenuItem value={i}>{i}</MenuItem>);
    return its;
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <IconButton
                aria-label="Account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                edge="end"
                onClick={toggleDrawer(true)}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Grid>
            <Grid item xs={6}>
              <Typography
                component="h1"
                variant="h3"
                style={{ marginBottom: 16 }}
              >
                Your Lunches
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {showLunches}
            </Grid>
            <Grid item xs={12} sm={6}>
              <ShowJoinedLunches />
            </Grid>
          </Grid>
          <Typography
            component="h1"
            variant="h3"
            style={{ marginBottom: 16, marginTop: 32 }}
          >
            Available Lunches
          </Typography>
          <FilterLunches setlunches={setlunches} />
          <Grid container spacing={3}>
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
        aria-label="Add"
        className={classes.fab}
        onClick={() => setCreateLunchOpen(true)}
      >
        <AddIcon />
      </Fab>
      <Dialog
        open={createLunchOpen}
        onClose={handleCloseCreateLunch}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Lunch</DialogTitle>
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
              onChange={handleStartTimeChange}
              value={startDate}
              ampm={false}
              margin="dense"
            />
            <TimePicker
              label="Lunch end time"
              onChange={handleEndTimeChange}
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
          <Button onClick={handleCloseCreateLunch} color="primary">
            Cancel
          </Button>
          <Button onClick={onCreateLunch} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <SwipeableDrawer
        open={drawerOpen}
        classes={{ paper: classes.drawer }}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Profile />
      </SwipeableDrawer>
    </div>
  );
};
export default compose(
  withSnackbar,
  withAuthorization(authenticated),
)(LunchesGrid);
