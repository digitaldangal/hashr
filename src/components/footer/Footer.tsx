import { Divider } from '@material-ui/core';
import * as React from 'react';

import KobionicLogo from '../../assets/kobionic.svg';
import { ActionsService, InfoService } from '../../electron/services';
import * as styles from './Footer.css';

type Props = {
};

type State = {
    appVersion?: string,
};

type URLs = {
    [key: string]: string;
};

/**
 * Displays the footer.
 *
 * @export
 * @class Footer
 * @extends {React.Component<Props, State>}
 */
export default class Footer extends React.Component<Props, State> {

    private infoService: InfoService;
    private urls: URLs;

    /**
     * Creates an instance of Footer.
     *
     * @param {Props} props
     * @memberof Footer
     */
    constructor(props: Props) {
        super(props);
        this.infoService = InfoService.Instance;
        this.state = {};
        this.urls = {
            app: 'https://github.com/KoBionic/hashr',
            kobionic: 'https://github.com/KoBionic',
            version: 'https://github.com/KoBionic/hashr/releases/tag',
        };
        this.handleVersionClick = this.handleVersionClick.bind(this);
    }

    public componentDidMount(): void {
        this.setState({
            appVersion: this.infoService.getAppVersion(),
        });
    }

    /**
     * Renders the component.
     *
     * @returns {JSX.Element} the component JSX
     * @memberof Footer
     */
    public render(): JSX.Element {
        return (
            <div className={styles.footer}>
                <Divider />
                <span>
                    <div className={styles.appText}>
                        <a
                            href=""
                            className={styles.link}
                            onClick={e => this.handleVersionClick(e, this.urls.app)}
                        >
                            <span>
                                <span className={styles.appTextStart}>Hash</span>
                                <span className={styles.appTextEnd}>R</span>
                            </span>
                        </a>
                    </div>
                    <div className={styles.middleText}>is brought to you by</div>
                    <div>
                        <a
                            href=""
                            className={styles.link}
                            onClick={e => this.handleVersionClick(e, this.urls.kobionic)}
                        >
                            <span>
                                <img src={KobionicLogo} className={styles.kobionicLogo} />
                                <span className={styles.kobionicText}>KoBionic</span>
                            </span>
                        </a>
                    </div>
                    <div className={`${styles.appVersion} ${styles.middleText}`}>
                        <a
                            href=""
                            className={`${styles.link} ${styles.highlight}`}
                            onClick={e => this.handleVersionClick(e, `${this.urls.version}/${this.state.appVersion}`)}
                        >{this.state.appVersion}
                        </a>
                    </div>
                </span>
            </div>
        );
    }

    private handleVersionClick(event: React.MouseEvent<any>, link: string): void {
        event.preventDefault();
        ActionsService.openInBrowser(link);
    }

}
