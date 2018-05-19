import { remote } from 'electron';

/**
 * Service used to retrieve application information using Electron & Node.js.
 *
 * @export
 * @class InfoService
 */
export default class InfoService {

    private static _instance: InfoService;

    /**
     * Creates an instance of InfoService.
     *
     * @memberof InfoService
     */
    private constructor() {
    }

    /**
     * Returns a singleton instance of the service.
     *
     * @readonly
     * @static
     * @type {InfoService}
     * @memberof InfoService
     */
    public static get Instance(): InfoService {
        return InfoService._instance || (InfoService._instance = new InfoService());
    }

    /**
     * Returns the application version.
     *
     * @returns {string} the application version
     * @memberof InfoService
     */
    public getAppVersion(): string {
        return remote.app.getVersion();
    }

}
