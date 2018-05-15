type States = {
    [key: string]: any
};

/**
 * The global state container used by components to retrieve their data.
 *
 * @class StateService
 */
class StateService {

    private states: States;

    /**
     * Creates an instance of StateService.
     *
     * @memberof StateService
     */
    constructor() {
        this.states = {};
    }

    /**
     * Loads a component state.
     *
     * @param {*} component the component to get state from
     * @returns {*}
     * @memberof StateService
     */
    public load(component: any): any {
        const index = component.constructor.name || component;
        return this.states[index];
    }

    /**
     * Sets a component state.
     *
     * @param {*} component the component to set state of
     * @param {*} value the value to save
     * @memberof StateService
     */
    public save(component: any, value: any): void {
        const index = component.constructor.name || component;
        this.states[index] = value;
    }

}

export default new StateService();
