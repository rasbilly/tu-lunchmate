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
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    IconButton,
    Typography, Paper, CircularProgress, Card, CardContent, CardActions, Grid
} from "@material-ui/core";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {withSnackbar} from "notistack";
import useTheme from "@material-ui/core/styles/useTheme";
import BanHammerIcon from "@material-ui/icons/Gavel"
import DeleteIcon from "@material-ui/icons/Delete"
import AddIcon from "@material-ui/icons/Add"

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
    reportedLunchesRoot : {
        backgroundColor: '#eeeeee',
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    textField : {
        maxWidth: 500
    },
    card: {
        minWidth: 275,
    },
}));

const Admin = (props) => {
    const {firebase, history} = props;
    const [email, setEmail] = useState('');
    const [delDialogOpen, setDialogOpen] = useState(false);
    const [createDialogOpen, setCreateOpen] = useState(false);

    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [deleteDisabled, setDeleteDisabled] = React.useState(true);
    const [reportedLunches, setReportedLunches] = React.useState([]);
    const [interests, setInterests] = React.useState([]);
    const [title, setTitle] = React.useState("");
    const [desc, setDesc] = React.useState("");

    useEffect(() => {
        setDeleteDisabled(
            0===email.length //email not empty
        );
    });

    async function fetchInterests() {
        let newInterests = [];
        const querySnapshot = await firebase.interests();
        querySnapshot.forEach((doc) => {
            console.log("interest: ", doc.data());
            const interest = doc.data();
            interest.id = doc.id;
            newInterests.push(interest);
        });
        setInterests(newInterests);
    }

    function onDeleteInterest(id) {
        console.log("Deleting item with id: ", id);
        //TODO: delete ALL instances where interest is present???
        firebase.deleteInterest(id).then(function () {
            props.enqueueSnackbar('Interest deleted!', {
                variant: 'success',
            });
            fetchInterests();
        }).catch(function (err) {
            console.error("Error deleting interest",err);
            props.enqueueSnackbar('Something went wrong :(', {
                variant: 'error',
            });
        })
    }

    const interestItems = interests.map((interest, index) => {
        const {title, description, id} = interest;
        return (
            <ListItem key={index}>
                <ListItemText
                    primary={title}
                    secondary={description}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={() => onDeleteInterest(id)} edge="end" aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    });

    function onDeleteReportedLunch(id) {
        firebase.deleteLunch(id).then(function () {
            props.enqueueSnackbar('Lunch deleted!', {
                variant: 'success',
            });
            fetchReportedLunches();
        }).catch(function (err) {
            console.error("Error deleting interest",err);
            props.enqueueSnackbar('Something went wrong :(', {
                variant: 'error',
            });
        })
    }

    function onClearReportedLunch(id) {
        firebase.removeReports(id).then(function () {
            props.enqueueSnackbar("Lunch doesn't have any reports now :)", {
                variant: 'success',
            });
            fetchReportedLunches();
        }).catch(function (err) {
            console.error("Error deleting interest",err);
            props.enqueueSnackbar('Something went wrong :(', {
                variant: 'error',
            });
        })
    }

    const lunchItems = reportedLunches.map((lunch, index) => {
        const {title, description, id} = lunch;
        return(
            <Grid key={index} item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h1" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h6" component="h2" color="textSecondary">
                            {description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={()=> onDeleteReportedLunch(id)}>Delete</Button>
                        <Button size="small" onClick={()=> onClearReportedLunch(id)}>Absolve from all sins</Button>
                    </CardActions>
                </Card>
            </Grid>
        );
    });

    async function fetchReportedLunches() {
        setLoading(true);
        let reportedLunches = [];
        const snapshot = await firebase.getReportedLunches();
        snapshot.forEach((doc) => {
            console.log("lunch: ", doc.data());
            const lunch = doc.data();
            lunch.id = doc.id;
            reportedLunches.push(lunch);
        });
        setLoading(false);
        setReportedLunches(reportedLunches);
    }

    function checkUser() {
        firebase.auth.onAuthStateChanged(function (user) {
            firebase.user(user.uid).then(function (user) {
                if(!user.data().isAdmin) {
                    history.push("/main");
                }
            })
        });
    }

    useEffect(()=>{
        checkUser();
        fetchInterests();
        fetchReportedLunches();
    },[]);

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

    function addInterest() {
        setCreateOpen(true);
    }

    function createInterest() {
        setLoading(true);
        firebase.addInterest(title,desc).then(function () {
            setLoading(false);
            props.enqueueSnackbar('Interest created!', {
                variant: 'success',
            });
            fetchInterests();
            setCreateOpen(false);
        }).catch(function (err) {
            setLoading(false);
            console.error("Error creating interest",err);
            props.enqueueSnackbar('Something went wrong :(', {
                variant: 'error',
            });
            setCreateOpen(false);
        });
    }

    function handleCreateClose() {
        setCreateOpen(false);
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
                        <Tab value={0} label="Reported Lunches" />
                        <Tab value={1} label="Interests" />
                        <Tab value={2} label="Delete User" />
                    </Tabs>
                </AppBar>
            </Paper>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}>
                <TabContainer dir={theme.direction}>
                    <div>
                        <Grid container direction="column">
                            {loading ? (
                                <CircularProgress/>
                            ):(
                                <div>
                                    {lunchItems.length === 0 ? (
                                        <Typography variant='h4'>Looks like your job is done for today :)</Typography>
                                    ) : (
                                        <Grid container direction="column" spacing={3}>
                                            {lunchItems}
                                        </Grid>
                                    )}
                                </div>
                            )}
                        </Grid>
                    </div>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                    <div>
                        <List>
                            {interestItems}
                        </List>
                        <Button variant="contained" color='primary' onClick={addInterest}>
                            Create interest
                            <AddIcon className={classes.rightIcon}/>
                        </Button>
                    </div>
                </TabContainer>
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
                <DialogTitle id="alert-dialog-title">{"Delete user"}</DialogTitle>
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
            <Dialog
                open={createDialogOpen}
                onClose={handleCreateClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Create interest"}</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress/>
                    ) : (
                        <div>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                required
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                value={title}
                                label="Title"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="desc"
                                required
                                onChange={(e) => {
                                    setDesc(e.target.value);
                                }}
                                value={desc}
                                label="Description"
                                type="text"
                                fullWidth
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={createInterest} color="primary" autoFocus>
                        Create
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