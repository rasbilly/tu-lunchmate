import React, { useState } from 'react';
import {withFirebase} from "../Firebase";
import {
    Avatar,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";
import PhotoCamera from "@material-ui/core/SvgIcon/SvgIcon";
import ReactCrop from "react-image-crop";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    bigAvatar: {
        width: 60,
        height: 60,
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    }
}));

const ProfilePicSelecter = (props) => {
    const { firebase, setCroppedImage, croppedImage} = props;
    const [openDialog, setOpenDialog] = useState(false);
    const [imageRef, setImageRef] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [crop, setCrop] = useState({
        x: 10,
        y: 10,
        width: 80,
        height: 80,
        aspect: 1
    });
    const classes = useStyles();

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

    function handleOpenDialog() {
        setOpenDialog(true);
    }

    function handleCloseDialog() {
        setOpenDialog(false);
    }

    function handleUpload() {
        setUploading(true);
        uploadPicture();
    }

    async function uploadPicture() {
        let blob = await fetch(croppedImage).then(r => r.blob());
        firebase.uploadProfilePic(blob).then(function () {
            firebase.profilePicURL(null).then(function (url) { //gets the url of the profile picture
                firebase.updateProfilePic(url).then(function () { //sets the profile in the auth db
                    console.log("success");
                    setOpenDialog(false);
                })
            }).catch(function (error) {
                console.error("error getting profileurl:",error);
            })
        }).catch(function (error) {
            console.error("error uploading picture:",error);
        })
    }

    return (
        <div>
            <form autoComplete="off">
                <Avatar align='center' className={classes.bigAvatar} src={croppedImage}>
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
            <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Crop Image</DialogTitle>
                <DialogContent>
                    {uploading ? (<CircularProgress/>) :
                        (<div>
                            <DialogContentText>
                                Crop your profile image here. Make it look good!
                            </DialogContentText>
                            {image && <ReactCrop src={image} onChange={onCropChange} onImageLoaded={onImageLoaded} crop={crop} onComplete={onCropComplete}/>}
                        </div>)
                    }
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpload} color="primary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withFirebase(ProfilePicSelecter);
