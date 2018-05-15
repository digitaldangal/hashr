import * as React from 'react';

import * as styles from './App.css';
import Main from './main/Main';

/**
 * Prevents default drag & drop events.
 *
 * @param {React.DragEvent<any>} event
 * @returns {boolean}
 */
function handleDrag(event: React.DragEvent<any>): boolean {
    event.preventDefault();
    return false;
}

export default () => (
    <div
        className={styles.app}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDragEnd={handleDrag}
        onDrop={handleDrag}
    >
        <Main />
    </div>
);
