import { stat } from 'fs';
import { promisify } from 'util';

const statAsync = promisify(stat);

/**
 * Determines whether given path is a file or not.
 *
 * @export
 * @param {string} path the path to verify
 * @returns {Promise<boolean>} true if is a file, false otherwise
 */
export async function isFile(path: string): Promise<boolean> {
    const stats = await statAsync(path);
    return stats.isFile();
}
