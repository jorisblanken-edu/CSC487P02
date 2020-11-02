
// Emily Crumpler and Joris Blanken
// CSC487 Project 2
// This program contains a suite of functions that will perform RSA
// encryption, generate rsa certificates, determine their validity, 
// and generate rsa keys. See readme.txt for more information
//
// All functions within this program were created by Emily Crumpler
// and Joris Blanken and were not obtained from other sources, 
// with the exception of the hashing function

import * as modular from './modular.js';
import * as primes from './primes.js';

export function apply(key, data) {
    const transformed = [];
    for (let d of data) {
        const m = modular.pow(d, key[0], key[1]);
        transformed.push(m);
    }
    return transformed;
}

export function gen_keys() {
    const [p, q] = primes.pick();
    const n = p * q;
    const totient_n = (p - 1) * (q - 1);

    const e = 65537;
    const d = modular.inverse(e, totient_n);

    return [
        [e, n],
        [d, n]
    ];
}
