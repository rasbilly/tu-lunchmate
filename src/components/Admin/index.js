import React, {useState} from 'react';
import {compose} from "recompose";
import withAuthorization from "../Session/authorization";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
    Button,
    CssBaseline, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import {withSnackbar} from "notistack";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: "#313131",
        },
    },

}));

const Admin = () => {
    const {firebase} = props;
    const [email, setEmail] = useState('');
    const [delDialogOpen, setDialogOpen] = useState(false);

    const classes = useStyles();

    function openDeleteUser() {
        setDialogOpen(true)
    }

    function deleteUser() {
        firebase.deleteUserByEmail(email).then(function () {
            console.log("user successfully deleted");
            setDialogOpen(false);
            props.enqueueSnackbar('Lunch created!', {
                variant: 'success',
            });
        }).catch(function (e) {
            console.log("deletion failed",e);
        })
    }

    function handleClose() {
        setDialogOpen(false)
    }

    return (
        <div>
            <CssBaseline/>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                autoComplete="email"
                autoFocus
            />
            <Button
                variant="contained"
                onClick={openDeleteUser}
                color="primary">
                Delete user
            </Button>

            <Dialog
                open={delDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Reset password"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You sure buddy?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Nah
                    </Button>
                    <Button onClick={deleteUser} color="primary" autoFocus>
                        Yup
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const authenticated = authUser => !!authUser;
export default compose(
    withSnackbar,
    withAuthorization(authenticated),
)(Admin);