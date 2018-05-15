import { Input, InputLabel, LinearProgress } from '@material-ui/core';
import * as bytes from 'bytes';
import * as React from 'react';

import CryptoService from '../../../electron/services/CryptoService';
import { File } from '../../../models/CommonTypes';
import Events from '../../../models/Events';
import { HashResult } from '../../../models/HashingTypes';
import EventService from '../../../services/EventService';
import * as styles from './HashingProcess.css';

type Props = {
    comparison?: string;
    file: File;
    hashingAlgorithm: string;
    onProcess: (processing: boolean) => void;
};

type State = {
    hashResult?: HashResult;
    isError: boolean;
    progress: number;
};

/**
 * Shows ongoing hashing process.
 *
 * @export
 * @class HashingProcess
 * @extends {React.Component<Props, State>}
 */
export default class HashingProcess extends React.Component<Props, State> {

    public state: State;

    private cryptoService: CryptoService;

    /**
     * Creates an instance of HashingProcess.
     *
     * @param {Props} props
     * @memberof HashingProcess
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            isError: false,
            progress: 0,
        };
        this.cryptoService = CryptoService.Instance;
        this.doComparison = this.doComparison.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
    }

    /**
     * ComponentDidMount lifecycle override.
     *
     * @memberof HashingProcess
     */
    public componentDidMount(): void {
        EventService.subscribe(Events.UPDATE_PROGRESS, this.updateProgress);
        this.props.onProcess(true);
        this.cryptoService
            .hashFile(this.props.file.path, this.props.hashingAlgorithm, this.props.comparison)
            .then(res => {
                this.setState({ hashResult: res });
                this.props.onProcess(false);
            })
            .catch(err => this.setState({ isError: true }));
    }

    /**
     * ComponentWillUnmount lifecycle override.
     *
     * @memberof HashingProcess
     */
    public componentWillUnmount(): void {
        EventService.unsubscribe(Events.UPDATE_PROGRESS, this.updateProgress);
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element} the component JSX
     * @memberof HashingProcess
     */
    public render(): JSX.Element {
        return (
            <div>
                <div className={styles.progressBar}>
                    <LinearProgress
                        color={this.state.isError ? 'secondary' : 'primary'}
                        variant="determinate"
                        value={this.state.progress}
                    />
                </div>
                <div className={styles.results}>
                    <div>
                        <InputLabel>Algorithm</InputLabel>
                        <Input
                            value={this.props.hashingAlgorithm}
                        />
                    </div>
                    <div>
                        <InputLabel>File</InputLabel>
                        <Input
                            value={this.props.file.name}
                        />
                    </div >
                    <div>
                        <InputLabel>Size</InputLabel>
                        <Input
                            value={bytes(this.props.file.size)}
                        />
                    </div >
                    <div>
                        <InputLabel>Duration</InputLabel>
                        <Input
                            disabled={this.state.hashResult ? false : true}
                            value={this.state.hashResult ? this.state.hashResult.duration : ''}
                        />
                    </div >
                    <div>
                        <InputLabel>Hash</InputLabel>
                        <Input
                            className={
                                this.props.comparison && this.state.hashResult
                                    ? this.doComparison()
                                        ? styles.sameHashes
                                        : styles.differentHashes
                                    : ''
                            }
                            disabled={this.state.hashResult ? false : true}
                            value={this.state.hashResult ? this.state.hashResult.hash : ''}
                        />
                    </div >
                    {this.props.comparison && <div>
                        <InputLabel>Comparison</InputLabel>
                        <Input
                            value={this.props.comparison ? this.props.comparison : ''}
                        />
                    </div>
                    }
                </div >
            </div >
        );
    }

    /**
     * Compares resulting hash to provided hash.
     *
     * @private
     * @returns {boolean} true if equal, false otherwise
     * @memberof HashingProcess
     */
    private doComparison(): boolean {
        return this.props.comparison === this.state.hashResult.hash;
    }

    /**
     * Updates the component's progress state.
     *
     * @private
     * @param {number} progress the updated progress status
     * @memberof HashingProcess
     */
    private updateProgress(progress: number): void {
        this.setState({
            progress: progress,
        });
    }

}
