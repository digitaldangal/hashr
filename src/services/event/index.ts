import { EventEmitter } from 'events';

/**
 * Allows events emitting.
 *
 * @class EventService
 */
class EventService {

    private eventEmitter: EventEmitter;

    /**
     * Creates an instance of EventService.
     *
     * @memberof EventService
     */
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Emits an event.
     *
     * @param {string} event the event to publish to
     * @param {*} payload the payload to send along
     * @param {*} [options] the optional event options
     * @memberof EventService
     */
    public emit(event: string, payload: any, options?: any) {
        this.eventEmitter.emit(event, payload, options);
    }

    /**
     * Subscribes to an event.
     *
     * @param {string} event the event to subscribe to
     * @param {(...args: any[]) => void} listener the listener function
     * @memberof EventService
     */
    public subscribe(event: string, listener: (...args: any[]) => void): void {
        this.eventEmitter.on(event, listener);
    }

    /**
     * Unsubscribes from an event.
     *
     * @param {string} event the event to unsubscribe from
     * @param {(...args: any[]) => void} listener the listener function
     * @memberof EventService
     */
    public unsubscribe(event: string, listener: (...args: any[]) => void): void {
        this.eventEmitter.removeListener(event, listener);
    }

}

export default new EventService();
