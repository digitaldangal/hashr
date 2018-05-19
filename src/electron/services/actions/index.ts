import { shell } from 'electron';

/**
 * Opens given URL in OS default browser.
 *
 * @export
 * @param {string} url the URL to open
 */
export function openInBrowser(url: string): void {
    shell.openExternal(url);
}
