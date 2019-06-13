import React, {useEffect, useState} from 'react';
//import withAuthorization from "../Session/authorization";
//import {compose} from "recompose";
import { withFirebase } from '../Firebase';
import {makeStyles, Grid, GridList, GridListTile, GridListTileBar, Button, Paper} from '@material-ui/core';
import * as firebase from "firebase";

// const Main = () => (
//     <div>
//         <h1>Main Page</h1>
//     </div>
// );
//
// const authenticated = authUser => !!authUser;
// export default compose(
//     withAuthorization(authenticated),
// )(Main);

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        padding: 20,
        height: 900
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
}));

const LunchesGrid = (props) => {
    const classes = useStyles();
    const { firebase } = props;
    const [lunches, setlunches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let newLunch = [];
            const querySnapshot = await firebase.getFreeLunches();
            querySnapshot.forEach((doc) => {
                newLunch.push({description: doc.description
                });
            });
            console.log((newLunch))
            setlunches(newLunch);
        };
        fetchData();
    }, []);

    //onclick createLunches

    //onclick openProfile

    //onclick joinLunch


    const lunchItems = lunches.map((lunch) => {
        return (
            <GridListTile key={lunch.description} style={{margin: '10'}}>
                <img src={'https://avitaltours.com/nyc-food-tours/wp-content/uploads/sites/5/2014/02/Avital-Private-Event-Icons.-Lunch-and-Learn-Event-Clear-300x239.jpg'} alt={lunch.description} />
                <GridListTileBar
                    title={lunch.description}
                    subtitle={<span>Location, Time: </span>}
                    actionIcon={
                        <Button>Request Join
                        </Button>
                    }
                />
            </GridListTile>
        )
    })

    return (
        <>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Paper classname={classes.paper}>
                            <Paper classname={classes.paper}>
                                <h3 style={{textAlign:"center"}}>You have not created any groups.</h3>
                                <Button className="btn btn-outline-primary btn-block" style={{position:"center"}}>Create Group</Button>
                            </Paper>
                            <Paper classname={classes.paper}>
                                <h2 style={{textAlign:"center"}}>2 <small>Requests</small></h2>
                                <p style={{textAlign:"center"}}>are open at this time</p>
                                <Button className="btn btn-outline-primary btn-block" style={{position:"center"}}>Show</Button>
                            </Paper>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                                <h2 component="div">Available Lunches</h2>
                        <Grid item xs={6}>
                            <Paper classname={classes.paper}>
                                {lunchItems}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default withFirebase(LunchesGrid);