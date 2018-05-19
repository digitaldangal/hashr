import 'react-toastify/dist/ReactToastify.min.css';

import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { Events, Toasts } from '../../../models';
import { EventService } from '../../../services';
import * as styles from './Messager.css';

/**
 * Messaging service displaying given message in a toast.
 *
 * @export
 * @class Messager
 */
export default class Messager extends React.Component {

    /**
     * Creates an instance of Messager.
     *
     * @param {{}} props
     * @memberof Messager
     */
    constructor(props: {}) {
        super(props);
        this.popup = this.popup.bind(this);
        EventService.subscribe(Events.SHOW_MESSAGE, (message, options) => this.popup(message, options.type, options.duration));
    }

    /**
     * ComponentWillUnmount lifecycle override.
     *
     * @memberof Messager
     */
    public componentWillUnmount(): void {
        EventService.unsubscribe(Events.SHOW_MESSAGE, this.popup);
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element}
     * @memberof Messager
     */
    public render(): JSX.Element {
        const CustomCloseButton = ({ closeToast }) => (
            <CloseIcon onClick={closeToast} />
        );

        return (
            <div>
                <ToastContainer className={styles.messageContainer} closeButton={<CustomCloseButton closeToast={true} />} />
            </div >
        );
    }

    /**
     * Displays a toast with given message.
     *
     * @private
     * @param {string} message the message to display
     * @param {Toasts} type the type of toast that sets background color
     * @param {number} [duration=5000] the toast display duration
     * @memberof Messager
     */
    private popup(message: string, type: Toasts, duration: number = 5000): void {
        let colorClass;

        switch (type) {
            case Toasts.ERROR:
                colorClass = styles.messagerError;
                break;
            case Toasts.INFO:
                colorClass = styles.messagerInfo;
                break;
            case Toasts.MISC:
                colorClass = styles.messagerMisc;
                break;
            case Toasts.SUCCESS:
                colorClass = styles.messagerSuccess;
                break;
            case Toasts.WARN:
                colorClass = styles.messagerWarn;
                break;
            default:
                colorClass = styles.messagerMisc;
        }

        toast(message, {
            autoClose: duration,
            position: toast.POSITION.BOTTOM_LEFT,
            className: `${styles.messagerToastContainer} ${colorClass}`,
            progressClassName: styles.messagerToastProgress,
        });
    }

}
