import React, {useEffect, useState} from 'react';
import withAuthorization from '../Session/authorization';
import {compose} from 'recompose';
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
  Fab,
  Divider,
  Dialog, DialogActions, DialogTitle, DialogContent,
  TextField,
  Select, MenuItem, InputLabel,
  Table
} from '@material-ui/core';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateFnsUtils from "@date-io/date-fns";
import {
  DateTimePicker, MuiPickersUtilsProvider, TimePicker
} from "@material-ui/pickers";
import AddIcon from '@material-ui/icons/Add';
import InterestsForm from "../Registration/InterestsForm";
import {withSnackbar} from "notistack";
import IconButton from "@material-ui/core/IconButton";


const authenticated = (authUser) => !!authUser;

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
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
  card: {
    maxWidth: 345,
    marginRight: 10,
    marginBottom: 20,
  },
  media: {
    height: 0,
  },
  button: {
    width: '100%',
    justifyContent: 'center'
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
  personal: {
    padding: 16,
    backgroundColor: '#DCDCDC',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
    borderRadius: 4,
    marginBottom: 30,
  },
  available: {
    padding: 16,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  column: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: 200,
    lineHeight: 2,
  }
}));

const LunchesGrid = (props) => {
  const classes = useStyles();
  const {firebase} = props;
  const [lunches, setlunches] = useState([]);
  const [createLunchOpen, setCreateLunchOpen] = useState(false);
  const [ownExpanded, setOwnExpanded] = useState(false);
  const [joinedExpanded, setJoinedExpanded] = useState(false);

  //create lunch attributes
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxMembers, setMaxmembers] = useState(2);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [clickedInterests, setClickedInterests] = useState([]);
  const [mensa, setMensa] = useState('');


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

  //Zählt meine Lunches durch und gibt sie summiert als Zahl aus
  const [count, setCount] = useState('');

  function countMyLunches() {
    firebase.auth.onAuthStateChanged(function (user) {
      if (user) {
        const fetchOwnLunches = async () => {
          let z = 0;
          const qs = await firebase.getOwnLunches();
          qs.forEach(() => {
            z += 1;
          });
          setCount(z);
        };
        fetchOwnLunches();
      }
    });
    return count > 0;
  }

  //counts joined lunches
  const [num, setNum] = useState('');

  function countJoinedLunches() {
    firebase.auth.onAuthStateChanged(function (user) {
      if (user) {
        const fetchJoinedLunches = async () => {
          let y = 0;
          const queryS = await firebase.getJoinedLunches();
          queryS.forEach(() => {
            y += 1;
          });
          setNum(y);
        };
        fetchJoinedLunches();
      }
    });
    return num > 0;
  }

  function handleOwnExpandClick() {
    setOwnExpanded(!ownExpanded);
  }

  function handleJoinedExpandClick() {
    setJoinedExpanded(!joinedExpanded);
  }

  const ShowMyLunches = () => {
    if (countMyLunches()) {
      return (
          <Card>
            <Typography variant='h5' style={{textAlign: 'center'}}>
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

              </CardContent>
            </Collapse>
          </Card>
      );
    } else {
      return (
          <div className="hello">You have not created any Lunches.</div>
      );
    }
  };

  const ShowJoinedLunches = () => {
    if (countJoinedLunches()) {
      return (
          <Card>
            <Typography variant='h5' style={{textAlign: 'center'}}>
              <small>You have joined </small>
              {count}
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

              </CardContent>
            </Collapse>
          </Card>
      );
    } else {
      return (
          <div className="hello">You have not created any Lunches.</div>
      );
    }
  };


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
    const date = startTimeStamp.toDate().toLocaleDateString()
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
        />
    ));

    return (
        <Grid key={index} item xs={8} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {title}
              </Typography>
              <Typography color="textSecondary" component="p">
                {description}
              </Typography>
              <div>{chips}</div>
              <br/><Divider component="div"/><br/>
              <Table>
                <tr>
                  <td className={classes.column}>Mensa</td>
                  <td>{mensa}</td>
                </tr>
                <tr>
                  <td className={classes.column}>Date</td>
                  <td>{date}</td>
                </tr>
                <tr>
                  <td className={classes.column}>Time</td>
                  <td>{startTime} - {endTime}</td>
                </tr>
              </Table>
            </CardContent>
            <CardActions>
              <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  style={{color: '#DB4444', border: '0.5px solid #DB4444', backgroundColor: 'white'}}>
                Join {memberCount}/{maxMembers}
              </Button>
            </CardActions>
          </Card>
        </Grid>
    );
  });

  function onCreateLunch() {
    const props1 = props;
    endDate.setDate(startDate.getDate());
    endDate.setFullYear(startDate.getFullYear());
    endDate.setMonth(startDate.getMonth());
    firebase.createLunch(
        title, desc,
        clickedInterests.map((interest) => interest.title),
        startDate, endDate,
        maxMembers,
        mensa
    ).then(function () {
      props1.enqueueSnackbar("Lunch created!", {
        variant: 'success'
      });
      setCreateLunchOpen(false);
    }).catch(
    )
  }

function handleCloseCreateLunch() {
  setCreateLunchOpen(false);
}

const handleStartTimeChange = date => setStartDate(date);
const handleEndTimeChange = date => setEndDate(date);

const menuItems = () => {
  let its = [];
  for (let i = 2; i < 7; i++) its.push(<MenuItem value={i}>{i}</MenuItem>);
  return its;
};

return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={4}>
          <Grid container direction='column' wrap="nowrap" spacing={3}>

          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container className={classes.personal}>
            <Grid item xs={8} sm={5} style={{marginRight: 16}}>
              <Paper classname={classes.paper}>
                <Typography variant='h5' style={{textAlign: 'center'}}>
                  <ShowMyLunches/>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={8} sm={5} style={{float: 'right'}}>
              <Paper classname={classes.paper}>
                <Typography variant='h5' style={{textAlign: 'center'}}>
                  <ShowJoinedLunches/>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Grid container className={classes.available}>
            <Typography component='h1' variant='h3' style={{marginBottom: 16}}>Available Lunches</Typography>
            <Grid container>
              {lunchItems ? lunchItems : (
                  <Typography variant='h4'>Looks like there aren't any free lunches :(</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Fab aria-label="Add" className={classes.fab} onClick={() => setCreateLunchOpen(true)}>
        <AddIcon/>
      </Fab>
      <Dialog open={createLunchOpen} onClose={handleCloseCreateLunch} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Lunch</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              id="title"
              onChange={(e) => {
                setTitle(e.target.value)
              }}
              value={title}
              label="Title"
              type="text"
              fullWidth
          />
          <TextField
              margin="dense"
              onChange={(e) => {
                setDesc(e.target.value)
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
                setMensa(e.target.value)
              }}
              value={mensa}
              id="mensa"
              label="Mensa"
              type="text"
              fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker label="Lunch start time" onChange={handleStartTimeChange} value={startDate}
                            ampm={false} margin="dense"/>
            <TimePicker label="Lunch end time" onChange={handleEndTimeChange} value={endDate} ampm={false}
                        margin="dense"/>
          </MuiPickersUtilsProvider>
          <InputLabel htmlFor="maxMembers-select">Max amount of members</InputLabel>
          <Select
              value={maxMembers}
              onChange={(e) => {
                setMaxmembers(e.target.value)
              }}
              inputProps={{
                name: 'maxMembers',
                id: 'maxMembers-select',
              }}>
            {menuItems()}
          </Select>
          <InterestsForm setClickedInterests={setClickedInterests} clickedInterests={clickedInterests}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateLunch} color='primary'>Cancel</Button>
          <Button onClick={onCreateLunch} color='primary'>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
);
};
export default compose(withSnackbar, (withAuthorization(authenticated)))(LunchesGrid);