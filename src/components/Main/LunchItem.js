import React, { useState, useEffect } from 'react';
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
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

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
  members,
  firebase,
}) => {
  const classes = useStyles();
  const [membersAvatars, setMembersAvatars] = useState([]);
  useEffect(() => {
    firebase.users().then(function(querySnapshot) {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      members.forEach((member) => {
        users.filter((user) => {
          if (user.id === member) {
            setMembersAvatars([...membersAvatars, user]);
          }
        });
      });
    });
  }, []);

  return (
    // The grid breakpoints are for responsive Design, DO NOT CHANGE
    <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={3}>
      <Card>
        {/* No style needed, spacing of grid handles everything! */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography color="textSecondary" component="p">
            {description}
          </Typography>
          <div>
            {membersAvatars.map((avatar) => (
              <Link key={avatar.id} to={`profile/${avatar.id}`}>
                <Avatar align="right" src={avatar.photoURL} />
              </Link>
            ))}
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
        </CardContent>
      </Card>
    </Grid>
  );
};

export default withFirebase(LunchItem);
