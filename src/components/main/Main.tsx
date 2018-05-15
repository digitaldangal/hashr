import { Button, Step, StepContent, StepLabel, Stepper } from '@material-ui/core';
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
            'Confirm',
            'Process',
        ];
        this.changeStep = this.changeStep.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    componentDidMount(): void {
        window.addEventListener('dragover', e => this.handleDrag(e, true), false);
        window.addEventListener('dragleave', e => this.handleDrag(e, false), false);
        window.addEventListener('drop', e => this.handleDrag(e, false), false);
    }

    /**
     * Changes the active step to given value or resets it if undefined.
     *
     * @param {React.MouseEvent<HTMLElement>} event the mouse event
     * @param {('+' | '-')} [selector] + for next step or - for previous one
     * @memberof Main
     */
    public changeStep(event: React.MouseEvent<HTMLElement>, selector?: '+' | '-'): void {
        event.stopPropagation();

        const newStep = selector
            ? selector === '+'
                ? ++this.state.activeStep
                : --this.state.activeStep
            : 0;

        this.setState({
            activeStep: newStep,
            isFinished: false,
        });
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
                <Stepper activeStep={activeStep} orientation="vertical">
                    {this.titles.map((label, index) => {
                        const attributes = index + 1 === this.titles.length
                            ? { completed: this.state.isFinished }
                            : {};

                        return (
                            <Step
                                key={label}
                                {...attributes}
                            >
                                <StepLabel>{label}</StepLabel>
                                <StepContent
                                    className={this.state.isDragged ? styles.ondrag : styles.nodrag}
                                    onDrop={this.handleDrop}
                                >
                                    <div className={styles.stepContent}>
                                        {this.getStepContent(index)}
                                    </div>
                                    <div>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={e => this.changeStep(e, '-')}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                variant="raised"
                                                color="primary"
                                                onClick={e => !this.state.isFinished ? this.changeStep(e, '+') : this.changeStep(e)}
                                                disabled={this.state.canContinue ? false : true}
                                            >
                                                {
                                                    activeStep === this.titles.length - 2
                                                        ? 'Start'
                                                        : this.state.isFinished
                                                            ? 'Reset'
                                                            : activeStep === this.titles.length - 1
                                                                ? 'Finish'
                                                                : 'Next'
                                                }
                                            </Button>
                                        </div>
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
     * @param {DragEvent} event the drag event
     * @param {boolean} isDragged true if is dragged, false otherwise
     * @memberof Main
     */
    private handleDrag(event: DragEvent, isDragged: boolean): void {
        event.preventDefault();
        this.setState({ isDragged: isDragged });
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
                    <div>Proceed with hashing of file <strong>{this.state.chosenFile ? this.state.chosenFile.name : ''}</strong>?</div>
                );
                break;
            case 3:
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
