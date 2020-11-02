// Emily Crumpler and Joris Blanken
// CSC487 Project 2
// This program contains a suite of functions that generate,
// sign, and validate certificates
//
// All functions within this program were created by Emily Crumpler
// and Joris Blanken and were not obtained from other sources, 
// with the exception of the hashing function

import * as rsa from './rsa.js';

export function generate(config) {
    let serialNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    let serialNumberHex = serialNumber.toString(16).padStart(14, '0');
    return {
        version: 'v1988',
        serialNumber: serialNumberHex,
        signature: {
            algorithm: 'RSA'
        },
        issuer: config.issuer,
        validity: {
            notBefore: config.notBefore,
            notAfter: config.notAfter
        },
        subject: {
            algorithm: {
                algorithm: 'RSA'
            }
        },
        subjectPublicKey: config.publicKey
    }
}

export function sign(doc, key) {
    const json = JSON.stringify(doc);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(json);
    const blocks = new Uint32Array(bytes);

    const signed = rsa.apply(key, blocks);
    return signed;
}