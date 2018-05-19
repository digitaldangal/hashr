/** Describes result of a hashing process. */
export type Result = {
    algorithm: string;
    comparison: boolean;
    duration: string;
    filepath: string;
    filesize: string;
    hash: string;
};

/** All available hashing algorithms. */
export const Algorithm = {
    MD4: 'MD4',
    MD5: 'MD5',
    RipeMD: 'RIPEMD',
    RipeMD160: 'RIPEMD160',
    SHA1: 'SHA1',
    SHA224: 'SHA224',
    SHA256: 'SHA256',
    SHA384: 'SHA384',
    SHA512: 'SHA512',
    Whirlpool: 'WHIRLPOOL',
};
