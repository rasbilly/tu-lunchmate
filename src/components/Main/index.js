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
  CardContent,
  Chip,
  Fab,
  Dialog, DialogActions, DialogTitle, DialogContent,
  TextField,
  Divider,
  Select, MenuItem, InputLabel
} from '@material-ui/core';
import DateFnsUtils from "@date-io/date-fns";
import {
  DateTimePicker, MuiPickersUtilsProvider, TimePicker
} from "@material-ui/pickers";
import AddIcon from '@material-ui/icons/Add';
import InterestsForm from "../Registration/InterestsForm";
import {withSnackbar} from "notistack";


const authenticated = (authUser) => !!authUser;

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: "#eeeeee",
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
    height: 140,
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
  },
}));

const LunchesGrid = (props) => {
  const classes = useStyles();
  const {firebase} = props;
  const [lunches, setlunches] = useState([]);
  const [createLunchOpen, setCreateLunchOpen] = useState(false);

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

  //onclick createLunches

  //onclick openProfile

  //onclick joinLunch

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
          component="div"/>
    ));

    function DetailHorizontal(props) {
      return (
           <Grid container spacing={2} alignItems="flex-end">
             <Grid item xs={3}>
               <Typography variant="subtitle2" color="textSecondary">{props.n}</Typography>
             </Grid>
             <Grid item xs={9}>
               <Typography variant="subtitle1">{props.t}</Typography>
             </Grid>
           </Grid>
      );
    }

    const Title = (props) =>
         <Typography
              variant="h5"
              component="h2"
              style={{marginBottom: "0.3em"}}>
           {props.t}
         </Typography>;

    return (
         <Grid item key={index} xs={12} md={6} lg={4} xl={3}>
           <Card>
             <CardContent>
               <Title t={title}/>
               <Typography variant="subtitle1">{description}</Typography>
               <div>{chips}</div>
               <br/><Divider component="div"/><br/>
               <DetailHorizontal n="Mensa" t={mensa}/>
               <DetailHorizontal n="Date" t={date}/>
               <DetailHorizontal n="Time" t={startTime + " - " + endTime}/>
               <br/>
               <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    size="small"
                    href="#">
                 Join ({memberCount}/{maxMembers})
               </Button>
             </CardContent>
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
         <Grid container spacing={4}>
           <Grid item xs={12} sm={6} md={3}>
             <Grid container direction='column' wrap="nowrap" spacing={3}>
               <Grid item xs={12}>
                 <Paper classname={classes.paper}>
                   <Typography variant='h6' style={{textAlign: 'center'}}>
                     You have not created any Lunches.
                   </Typography>
                   <Button variant="contained" color="primary" className={classes.button}
                           style={{position: 'center'}} href="#">
                     Create Lunch
                   </Button>
                 </Paper>
               </Grid>
               <Grid item xs={12}>
                 <Paper classname={classes.paper}>
                   <Typography variant='h6' style={{textAlign: 'center'}}>You have joined</Typography>
                   <Typography variant='h5' style={{textAlign: 'center'}}>
                     2 <small>Lunches</small>
                   </Typography>
                   <Button className={classes.button}
                           variant="contained"
                           color="primary"
                           style={{position: 'center'}}
                           href="#">
                     Show
                   </Button>
                 </Paper>
               </Grid>
             </Grid>
           </Grid>
           <Grid item xs={12} sm={6} md={9}>
             <Typography component='h1' variant='h2'>Available Lunches</Typography>
             <br/>
             <Grid container spacing={4}>
               {lunchItems ? lunchItems : (
                    <Typography variant='h4'>Looks like there aren't any free lunches :(</Typography>
               )}
             </Grid>
           </Grid>
         </Grid>
         <Fab color="secondary" aria-label="Add" className={classes.fab} onClick={() => setCreateLunchOpen(true)}>
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
               <DateTimePicker label="Lunch start time" onChange={handleStartTimeChange} value={startDate} ampm={false}
                               margin="dense"/>
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
             <Button onClick={onCreateLunch} color='primary'>Create</Button>
           </DialogActions>
         </Dialog>
       </div>
  );
};

export default compose(withSnackbar, (withAuthorization(authenticated)))(LunchesGrid);