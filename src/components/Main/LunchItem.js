import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Dialog,
  Table,
  Avatar,
} from '@material-ui/core';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import UserProfile from '../Profile/UserProfile';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

const LunchItem = ({
  id,
  index,
  title,
  description,
  chips,
  mensa,
  date,
  startTime,
  endTime,
  memberCount,
  maxMembers,
  onJoinLunch,
  leaveLunch,
  members,
  firebase,
  updateLunch,
  lunch,
  deleteLunch,
}) => {
  const classes = useStyles();
  const [membersAvatars, setMembersAvatars] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [userID, setUserID] = useState();

  useEffect(() => {
    firebase.users().then(function(querySnapshot) {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      const allMembers = [];

      members.forEach((member) => {
        users.filter((user) => {
          if (user.id === member) {
            allMembers.push(user);
          }
        });
      });

      setMembersAvatars(allMembers);
    });
  }, []);

  function handleClick(id) {
    setUserID(id);
    console.log(id);
    setIsActive(true);
  }

  return (
    <>
      <Grid key={index} item xs={12} sm={6} md={6} lg={6} xl={6}>
        <Card key={index}>
          {/* No style needed, spacing of grid handles everything! */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography color="textSecondary" component="p">
              {description}
            </Typography>
            <div>
              {console.log(membersAvatars)}
              {membersAvatars.map((avatar) => {
                return (
                  <Avatar
                    onClick={() => handleClick(avatar.id)}
                    style={{
                      display: 'inline-flex',
                      marginRight: '0.5rem',
                      cursor: 'pointer',
                    }}
                    align="right"
                    src={avatar.photoURL}
                  />
                );
              })}
            </div>
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
            <br />
            {onJoinLunch ? (
              <Button
                variant="outlined"
                className={classes.button}
                size="small"
                style={{
                  color: '#DB4444',
                  borderColor: '#DB4444',
                  marginBottom: '-8px',
                }}
                href="#"
                onClick={() => onJoinLunch(id)}
              >
                Join ({memberCount}/{maxMembers}) {/* Brackets for context */}
              </Button>
            ) : null}
            {leaveLunch ? (
              <Button
                color="primary"
                variant="contained"
                onClick={() => leaveLunch(id)}
              >
                Leave
              </Button>
            ) : null}
          </CardContent>
          {updateLunch ? (
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
                onClick={() => deleteLunch(id)}
              >
                Delete
                <DeleteIcon className={classes.rightIcon} />
              </Button>
            </CardActions>
          ) : null}
        </Card>
      </Grid>
      <Dialog open={isActive} onClose={() => setIsActive(false)}>
        <UserProfile uid={userID} />
      </Dialog>
    </>
  );
};

export default withFirebase(LunchItem);
