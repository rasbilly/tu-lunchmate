import {createMuiTheme} from "@material-ui/core";
import {blue} from "@material-ui/core/colors";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#e26969',
            main: '#db4444',
            dark: '#992f2f',
            contrastText: '#fff',
        },
        secondary: blue
    },
});

export default theme;