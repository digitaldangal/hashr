import { MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

import { HashingTypes } from '../../../models';

type Props = {
    chosenAlgorithm: string;
    onChange: ((val: string) => any);
};

type State = {
};

/**
 * Allows selection of the hashing algorithm.
 *
 * @export
 * @class AlgorithmChooser
 * @extends {React.Component<Props, State>}
 */
export default class AlgorithmChooser extends React.Component<Props, State> {

    public state: State;

    /**
     * Creates an instance of AlgorithmChooser.
     *
     * @param {Props} props
     * @memberof AlgorithmChooser
     */
    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element} the component JSX
     * @memberof AlgorithmChooser
     */
    public render(): JSX.Element {
        return (
            <div>
                <Select
                    value={this.props.chosenAlgorithm}
                    onChange={this.handleChange}
                >
                    {Object.keys(HashingTypes.Algorithm).map((alg, index) =>
                        <MenuItem
                            key={index}
                            value={alg}
                        >
                            {alg}
                        </MenuItem>
                    )}
                </Select>
            </div>
        );
    }

    /**
     * Changes the component state and returns its new value.
     *
     * @private
     * @param {React.ChangeEvent<any>} event
     * @memberof AlgorithmChooser
     */
    private handleChange(event: React.ChangeEvent<any>): void {
        const val = { chosenAlgorithm: event.target.value };
        this.props.onChange(val.chosenAlgorithm);
    }

}
