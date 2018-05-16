import './index.css';

import { MuiThemeProvider } from '@material-ui/core/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import Theme from './themes/Theme';

ReactDOM.render(
    <MuiThemeProvider theme={Theme}>
        <App />
    </MuiThemeProvider>,
    document.getElementById('root') as HTMLElement
);
