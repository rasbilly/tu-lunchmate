import React, {useEffect, useState} from 'react';
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
    AppBar,
    Tab,
    Tabs,
    TextField,
    Typography, Paper, CircularProgress
} from "@material-ui/core";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {withSnackbar} from "notistack";
import useTheme from "@material-ui/core/styles/useTheme";
import BanHammerIcon from "@material-ui/icons/Gavel"

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: "#ffffff",
        },
    },
    root: {
        backgroundColor: theme.palette.common.white,
    },
    appBarPaper : {
        flexGrow: 1,
    },
    deleteUserRoot: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    textField : {
        maxWidth: 500
    }
}));

const Admin = (props) => {
    const {firebase} = props;
    const [email, setEmail] = useState('');
    const [delDialogOpen, setDialogOpen] = useState(false);
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [deleteDisabled, setDeleteDisabled] = React.useState(true);

    useEffect(() => {
        setDeleteDisabled(
            0===email.length //email not empty
        );
    });

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function handleChangeIndex(index) {
        setValue(index);
    }

    const classes = useStyles();
    const theme = useTheme();

    function openDeleteUser() {
        setDialogOpen(true)
    }

    function deleteUser() {
        setLoading(true);
        firebase.deleteUserByEmail(email).then(function () {
            console.log("user successfully deleted");
            setDialogOpen(false);
            setLoading(false);
            props.enqueueSnackbar('User deleted!', {
                variant: 'success',
            });
        }).catch(function (e) {
            console.log("deletion failed",e);
            setDialogOpen(false);
            setLoading(false);
            props.enqueueSnackbar('Something went wrong :(', {
                variant: 'error',
            });
        })
    }

    function handleClose() {
        setDialogOpen(false)
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <Paper className={classes.appBarPaper}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Reported Lunches" />
                        <Tab label="Interests" />
                        <Tab label="Delete User" />
                    </Tabs>
                </AppBar>
            </Paper>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabContainer dir={theme.direction}></TabContainer>
                <TabContainer dir={theme.direction}>Interests</TabContainer>
                <TabContainer dir={theme.direction}>
                    <div className={classes.deleteUserRoot}>
                        <TextField
                            variant="outlined"
                            className={classes.textField}
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
                            disabled={deleteDisabled}
                            variant="contained"
                            onClick={openDeleteUser}
                            color="primary">
                            Delete user
                            <BanHammerIcon className={classes.rightIcon} />
                        </Button>
                    </div>
                </TabContainer>
            </SwipeableViews>

            <Dialog
                open={delDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Reset password"}</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress/>
                    ) : (
                        <DialogContentText id="alert-dialog-description">
                        You sure boss?
                        </DialogContentText>
                    )}
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