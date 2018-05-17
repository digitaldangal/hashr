import { Button, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as React from 'react';

import { File } from '../../models/CommonTypes';
import { HashingAlgorithm } from '../../models/HashingTypes';
import AlgorithmChooser from './algorithm-chooser/AlgorithmChooser';
import FileChooser from './file-chooser/FileChooser';
import HashingProcess from './hashing-process/HashingProcess';
import * as styles from './Main.css';

type Props = {
};

type State = {
    activeStep: number;
    canContinue: boolean;
    chosenAlgorithm: string,
    chosenFile?: File;
    comparison?: string;
    isDragged: boolean;
    isFinished: boolean;
};

/**
 * Main component displaying a stepper.
 *
 * @export
 * @class Main
 * @extends {React.Component<Props, State>}
 */
export default class Main extends React.Component<Props, State> {

    public state: State;
    public titles: string[];

    private interval: NodeJS.Timer;

    /**
     * Creates an instance of Main.
     *
     * @param {Props} props
     * @memberof Main
     */
    constructor(props: Props) {
        super(props);
        this.state = {
            activeStep: 0,
            canContinue: false,
            chosenAlgorithm: HashingAlgorithm.SHA256,
            isDragged: false,
            isFinished: false,
        };
        this.titles = [
            'Drag & Drop File',
            'Select Hashing Algorithm',
            'Process',
        ];
        this.changeStep = this.changeStep.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    /**
     * ComponentDidMount lifecycle override.
     *
     * @memberof Main
     */
    public componentDidMount(): void {
        window.addEventListener('dragover', e => this.handleDrag(e, true), false);
        window.addEventListener('drop', e => this.handleDrag(e, false), false);
        window.addEventListener('dragleave', e => this.handleDrag(e, false), false);
        window.addEventListener('keydown', e => this.handleKeydown(e), false);
    }

    /**
     * Changes the active step to given value or resets it if undefined.
     *
     * @param {('+' | '-')} [selector] + for next step or - for previous one
     * @memberof Main
     */
    public changeStep(selector?: '+' | '-'): void {
        if (this.state.canContinue) {
            const newStep = selector === '+'
                ? this.state.activeStep < this.titles.length - 1
                    ? ++this.state.activeStep
                    : 0
                : this.state.activeStep === 0
                    ? 0
                    : --this.state.activeStep;

            this.setState({
                activeStep: newStep,
                isFinished: false,
            });
        }
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element} the component JSX
     * @memberof Main
     */
    public render(): JSX.Element {
        const { activeStep } = this.state;

        return (
            <div>
                <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                >
                    {this.titles.map((label, index) => {
                        const attributes = index + 1 === this.titles.length
                            ? { completed: this.state.isFinished }
                            : {};

                        return (
                            <Step
                                key={label}
                                className={styles.step}
                                {...attributes}
                            >
                                <StepLabel
                                    className={`${styles.stepTitle} ${index === activeStep ? styles.activeTitle : ''}`}
                                >
                                    {label}
                                </StepLabel>
                                <StepContent
                                    className={this.state.isDragged ? styles.ondrag : styles.nodrag}
                                    onDrop={this.handleDrop}
                                >
                                    <div className={styles.stepContent}>
                                        {this.getStepContent(index)}
                                    </div>
                                    <div
                                        className={styles.navigationButton}
                                    >
                                        <Button
                                            disabled={!this.state.canContinue ? true : false}
                                            className={this.state.canContinue && !this.state.isDragged ? styles.pulse : styles.faded}
                                            color="primary"
                                            variant="fab"
                                            mini={true}
                                            onClick={e => this.changeStep('+')}
                                        >
                                            {
                                                activeStep + 1 !== this.titles.length
                                                    ? <ArrowDownwardIcon />
                                                    : <RefreshIcon />
                                            }
                                        </Button>
                                    </div>
                                </StepContent>
                            </Step>
                        );
                    })}
                </Stepper>
            </div>
        );
    }

    /**
     * Handles drag events.
     *
     * @private
     * @param {(Event | React.SyntheticEvent<any>)} event the drag event
     * @param {boolean} isDragged true if is dragged, false otherwise
     * @memberof Main
     */
    private handleDrag(event: Event | React.SyntheticEvent<any>, isDragged: boolean): void {
        event.preventDefault();

        clearInterval(this.interval);
        if (!isDragged) {
            this.interval = setInterval(() => this.setState({ isDragged: isDragged }), 50);

        } else {
            this.setState({ isDragged: isDragged });
        }
    }

    /**
     * Handles keyboard events.
     *
     * @private
     * @param {KeyboardEvent} event the keydown event
     * @memberof Main
     */
    private handleKeydown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowDown':
                this.changeStep('+');
                break;
            case 'ArrowUp':
                this.changeStep('-');
                break;
            case 'Backspace':
                this.changeStep('-');
                break;
            case 'Enter':
                this.changeStep('+');
                break;
            default:
        }
    }

    /**
     * Handles drop events.
     *
     * @private
     * @param {React.DragEvent<any>} event the drop event
     * @memberof FileChooser
     */
    private handleDrop(event: React.DragEvent<any>): void {
        event.preventDefault();
        const dropped = event.dataTransfer.files[0];
        const file = {
            lastModifiedDate: dropped.lastModifiedDate,
            name: dropped.name,
            path: dropped.path,
            size: dropped.size,
            type: dropped.type,
        };

        if (file.type !== '') {
            this.setState({
                canContinue: true,
                chosenFile: file,
            });
        }
    }

    /**
     * Returns given step's content.
     *
     * @private
     * @param {number} step the step to get content of
     * @returns {*} the step content
     * @memberof Main
     */
    private getStepContent(step: number): any {
        let content;

        switch (step) {
            case 0:
                content = (
                    <FileChooser
                        chosenFile={this.state.chosenFile}
                        compareTo={val => this.setState({ comparison: val })}
                        initialValue={this.state.comparison}
                    />
                );
                break;
            case 1:
                content = (
                    <AlgorithmChooser
                        chosenAlgorithm={this.state.chosenAlgorithm}
                        onChange={val => this.setState({ chosenAlgorithm: val })}
                    />
                );
                break;
            case 2:
                content = (
                    <HashingProcess
                        file={this.state.chosenFile}
                        hashingAlgorithm={this.state.chosenAlgorithm}
                        onProcess={processing => this.setState({ canContinue: !processing, isFinished: !processing })}
                        comparison={this.state.comparison}
                    />
                );
                break;
            default:
        }

        return content;
    }

}
