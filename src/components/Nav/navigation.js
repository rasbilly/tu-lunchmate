import React from 'react';

import {AuthUserContext} from '../Session';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AppBar, Toolbar, Typography, Button, MenuItem, Menu, IconButton, ListItemIcon} from "@material-ui/core";
import { Route } from 'react-router-dom'
import {AccountCircle, ExitToApp, AccessibilityNew} from '@material-ui/icons'
import {withFirebase} from "../Firebase";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));


function Navigation (props) {
    const classes = useStyles();
    const {firebase} = props;
    return(
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? (<NavigationAuth authUser={authUser} classes={classes} firebase={firebase}/>) : (<NavigationNonAuth classes={classes}/>)
            }
        </AuthUserContext.Consumer>
    );
};

function NavigationAuth ({authUser, classes, firebase}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    function handleMenu(event) {
        setAnchorEl(event.currentTarget);
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Lunchmate
                    </Typography>
                    <div>
                        {authUser.isAdmin && (
                            <AdminBtn className={classes.menuButton}/>
                        )}
                        <IconButton
                            aria-label="Account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            edge="end"
                            onClick={handleMenu}
                            color="inherit">
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={()=>setAnchorEl(null)}>
                            <Route render={({history}) => (
                                <MenuItem onClick={() => {
                                    setAnchorEl(null);
                                    history.push('/profile')
                                }}>
                                    <ListItemIcon> <AccessibilityNew/> </ListItemIcon>
                                    Profile
                                </MenuItem>
                            )} />
                            <Route render={({history}) => (
                                <MenuItem onClick={()=>{
                                    setAnchorEl(null);
                                    firebase.signOut();
                                    history.push('/');
                                }}>
                                    <ListItemIcon> <ExitToApp/> </ListItemIcon>
                                    Sign out
                                </MenuItem>
                            )} />
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

const NavigationNonAuth = ({classes}) => (
    <div className={classes.root}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" edge='start' className={classes.title }>
                    Lunchmate
                </Typography>
                <LoginBtn/>
            </Toolbar>
        </AppBar>
    </div>
);

const LoginBtn = () => (
    <Route render={({history}) => (
        <Button
            color="inherit"
            onClick={() => {history.push('/login')}}>
            Login
        </Button>
    )} />
);

const AdminBtn = () => (
    <Route render={({history}) => (
        <Button
            color="inherit"
            onClick={() => {history.push('/admin')}}>
            Admin Dashboard
        </Button>
    )} />
);

export default withFirebase(Navigation);