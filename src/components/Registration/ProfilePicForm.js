import React, { useState, useEffect } from 'react';
import {
  Container,
  CssBaseline,
  Grid,
  makeStyles,
  Avatar,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { withFirebase } from '../Firebase';

const useStyles = makeStyles({
  bigAvatar: {
    margin: 10,
    width: 75,
    height: 75,
  },
  formControl: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
});

const ProfilePicForm = (props) => {
  const { firebase } = props;
  const [majors, setMajors] = useState([]);
  const [major, setMajor] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let majors = [];
      const querySnapshot = await firebase.majors();
      querySnapshot.forEach((doc) => {
        majors.push({ id: doc.id, title: doc.data().title });
      });
      setMajors(majors);
    };
    fetchData();
  }, []);

  const classes = useStyles();

  const handleChange = (event) => {
    setMajor(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const majorOptions = majors.map((major) => (
    <MenuItem key={major.id} value={major.title}>
      {major.title}
    </MenuItem>
  ));

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <form autoComplete="off">
            <Avatar className={classes.bigAvatar}>
              <PhotoCamera />
            </Avatar>
            <input
              accept="image/*"
              className={classes.input}
              id="raised-button-file"
              multiple
              type="file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" color="primary">
                Upload
              </Button>
            </label>
          </form>
        </Grid>
        <Grid item xs={6}>
          <form autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="demo-controlled-open-select">
                Major
              </InputLabel>
              <Select
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                value={major}
                onChange={handleChange}
                inputProps={{
                  name: 'major',
                  id: 'demo-controlled-open-select',
                }}
              >
                {majorOptions}
              </Select>
            </FormControl>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withFirebase(ProfilePicForm);
