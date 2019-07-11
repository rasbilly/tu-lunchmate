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
  InputLabel, FormControl,
  Dialog, DialogTitle, DialogContentText, DialogActions, DialogContent
} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { withFirebase } from '../Firebase';
import ReactCrop from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css'

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
  const { firebase, setCroppedImage, major, setMajor, croppedImage} = props;
  const [majors, setMajors] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageRef, setImageRef] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
    aspect: 1
  });

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => (setImage(reader.result)));
      reader.readAsDataURL(e.target.files[0]);
      handleOpenDialog();
    }
  };

  const onImageLoaded = img => {
    setImageRef(img);
  };

  const onCropComplete = crop => {
    makeClientCrop(crop)
  };

  function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(blob.fileUrl);
        blob.fileUrl = window.URL.createObjectURL(blob);
        resolve(blob.fileUrl);
      }, "image/jpeg");
    });
  }

  async function makeClientCrop(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
          imageRef,
          crop,
          "profilepic.jpeg"
      );
      setCroppedImage(croppedImageUrl);
    }
  }

  const onCropChange = crop => {
    setCrop(crop);
  };

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }
  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

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
  }, [firebase]);

  const classes = useStyles();

  const handleChange = (event) => {
    setMajor(event.target.value);
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
            <Avatar className={classes.bigAvatar} src={croppedImage}>
              {!croppedImage && <PhotoCamera />}
            </Avatar>
            <input
              accept="image/x-png,image/gif,image/jpeg"
              className={classes.input}
              onChange={onSelectFile}
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
                onOpen={handleClickOpen}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Crop Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Crop your profile image here. Make it look good!
          </DialogContentText>
          {image && <ReactCrop src={image} onChange={onCropChange} onImageLoaded={onImageLoaded} crop={crop} onComplete={onCropComplete}/>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default withFirebase(ProfilePicForm);
