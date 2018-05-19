import { Input, InputLabel } from '@material-ui/core';
import * as bytes from 'bytes';
import * as React from 'react';

import { CommonTypes } from '../../../models';
import * as styles from './FileChooser.css';

type Props = {
    chosenFile: CommonTypes.File;
    compareTo: (comparison: string) => void;
    initialValue: string;
};

type State = {
};

/**
 * Allows selection of the file to hash.
 *
 * @export
 * @class FileChooser
 * @extends {React.Component<Props, State>}
 */
export default class FileChooser extends React.Component<Props, State> {

    public state: State;

    /**
     * Creates an instance of FileChooser.
     *
     * @param {Props} props
     * @memberof FileChooser
     */
    constructor(props: Props) {
        super(props);
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element} the component JSX
     * @memberof FileChooser
     */
    public render(): JSX.Element {
        return (
            <div
                className={styles.container}
            >
                <InputLabel>Compare to</InputLabel>
                <Input
                    id="comparison"
                    onChange={e => this.props.compareTo(e.target.value)}
                    value={this.props.initialValue ? this.props.initialValue : ''}
                />
                <InputLabel>Name</InputLabel>
                <Input
                    id="filename"
                    disabled={this.props.chosenFile ? false : true}
                    value={this.props.chosenFile ? this.props.chosenFile.name : ''}
                />
                <InputLabel>Path</InputLabel>
                <Input
                    id="filepath"
                    disabled={this.props.chosenFile ? false : true}
                    value={this.props.chosenFile ? this.props.chosenFile.path : ''}
                />
                <InputLabel>Size</InputLabel>
                <Input
                    id="filesize"
                    disabled={this.props.chosenFile ? false : true}
                    value={this.props.chosenFile ? bytes(this.props.chosenFile.size) : ''}
                />
                <InputLabel>Mimetype</InputLabel>
                <Input
                    id="filetype"
                    disabled={this.props.chosenFile ? false : true}
                    value={this.props.chosenFile ? this.props.chosenFile.type : ''}
                />
                <InputLabel>Last Modified</InputLabel>
                <Input
                    id="filelastmodified"
                    disabled={this.props.chosenFile ? false : true}
                    value={this.props.chosenFile ? this.props.chosenFile.lastModifiedDate.toUTCString() : ''}
                />
            </div>
        );
    }

}
