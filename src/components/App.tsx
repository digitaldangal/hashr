import '../themes/Variables.css';

import * as React from 'react';

import * as styles from './App.css';
import Footer from './footer/Footer';
import Main from './main/Main';
import Messager from './widgets/messager/Messager';

/**
 * Prevents default drag & drop events.
 *
 * @param {React.DragEvent<any>} event
 * @returns {boolean}
 */
function preventDragEvent(event: React.DragEvent<any>): boolean {
    event.preventDefault();
    return false;
}

export default () => (
    <div
        className={styles.app}
        onDragEnd={preventDragEvent}
        onDragLeave={preventDragEvent}
        onDragOver={preventDragEvent}
        onDragStart={preventDragEvent}
        onDrop={preventDragEvent}
    >
        <Main />
        <Footer />
        <Messager />
    </div>
);
