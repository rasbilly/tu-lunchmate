import React, { useState, useEffect, useRef } from 'react';
import { withFirebase } from '../Firebase';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Table,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import UpdateLunchForm from './UpdateLunchForm';

const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  column: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 2,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  editButton: {
    backgroundColor: '#f0ad4e',
    color: '#ffffff',
  },
}));

const OwnLunches = (props) => {
  const classes = useStyles();
  const { firebase, setUpdateLunches, updateLunches, token} = props;
  const [ownLunches, setOwnLunches] = useState([]);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [updateLunchData, setUpdateLunchData] = useState();

  useEffect(() => {
    const fetchOwnLunchData = async () => {
      let newOwnLunches = [];
      const querySnapshot = await firebase.getOwnLunches();
      querySnapshot.forEach((doc) => {
        newOwnLunches.push({ id: doc.id, data: doc.data() });
      });
      console.log('ownlunch');

      setOwnLunches(newOwnLunches);
    };
    fetchOwnLunchData();
  }, [hasUpdated]);

  const deleteLunch = (id) => {
    firebase.deleteLunch(id).then(() => {
      //unsub from push messages after deleting
      firebase.unSubscribeFromLunch(id, token).catch((e)=>console.log(e));
      setHasUpdated(!hasUpdated);
      setUpdateLunches(!updateLunches);
    });
  };

  const updateLunch = (lunch) => {
    setUpdateLunchData(lunch);
    setActiveModal(true);
  };

  const ownLunchItems = ownLunches.map((lunch, index) => {
    const {
      description,
      title,
      mensa,
      interests,
      endTimeStamp,
      startTimeStamp,
    } = lunch.data;

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
      // The grid breakpoints are for responsive Design, DO NOT CHANGE
      <Grid key={index} item xs={12} sm={6} lg={4} xl={3}>
        <Card>
          {/* No style needed, spacing of grid handles everything! */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography color="textSecondary" component="p">
              {description}
            </Typography>
            <div>{chips}</div>
            <br />
            <Divider component="div" />
            <br />
            <Table>
              <tbody>
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
                  <td>
                    {startTime} - {endTime}
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardContent>
          <CardActions>
            <Button
              className={classes.editButton}
              variant="contained"
              onClick={() => updateLunch(lunch)}
            >
              Edit
              <EditIcon className={classes.rightIcon} />
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => deleteLunch(lunch.id)}
            >
              Delete
              <DeleteIcon className={classes.rightIcon} />
            </Button>
          </CardActions>
        </Card>
        <UpdateLunchForm
          dialogTitle="Edit Lunch"
          active={activeModal}
          setActive={setActiveModal}
          lunch={updateLunchData}
          hasUpdated={hasUpdated}
          updateLunches={updateLunches}
          setHasUpdated={setHasUpdated}
          setUpdateLunches={setUpdateLunches}
        />
      </Grid>
    );
  });

  return (
    <Grid container spacing={3}>
      {ownLunchItems}
    </Grid>
  );
};

export default withFirebase(OwnLunches);
