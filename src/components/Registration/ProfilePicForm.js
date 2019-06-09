import React from "react";
import {Container, CssBaseline, Grid, makeStyles, Avatar, Button, List} from "@material-ui/core";
import PhotoCamera from '@material-ui/icons/PhotoCamera'
const useStyles = makeStyles({
    bigAvatar: {
        margin: 10,
        width: 75,
        height: 75,
    },
});


export default function ProfilePicForm() {
    const classes = useStyles();
    return(
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Container>
                        <Avatar className={classes.bigAvatar}>
                            <PhotoCamera/>
                        </Avatar>
                        <Button variant="outlined" color="primary">Upload</Button>
                    </Container>
                </Grid>
                <Grid item xs={6}>
                    <List dense>
                        TODO
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
}