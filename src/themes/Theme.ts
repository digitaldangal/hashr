import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            default: '#21252b',
            paper: '#21252b',
        },
        primary: {
            main: '#0D47A1',
        },
        secondary: {
            main: '#009688',
        },
        error: {
            main: '#F44336',
        },
    },
});
