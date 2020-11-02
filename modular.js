
// Emily Crumpler and Joris Blanken
// CSC487 Project 2
// This program contains a suite of functions that perform
// various modular arithmetic operations. See function headers
// for more information.
//
// All functions within this program were created by Emily Crumpler
// and Joris Blanken and were not obtained from other sources, 
// with the exception of the hashing function

/**
 * Performs mod while accounting for negative numbers
 * @param {*} a 
 * @param {*} b 
 */
export function mod(a, b) {
    return ((a % b) + b) % b;
}

/**
 * Multiply integers and mod them safely
 * @param {*} a 
 * @param {*} b 
 * @param {*} modulo 
 */
export function mul(a, b, modulo) {
    [a, b] = [Math.max(a, b), Math.min(a, b)];
    let result = 0;
    for (let i = 0; i < b; i++) {
        result = mod(result + a, modulo);
    }
    return result;
}

/**
 * Powermod function
 * @param {*} base 
 * @param {*} exp 
 * @param {*} modulo 
 */
export function pow(base, exp, modulo) {
    let result = 1;
    while (exp > 0) {
        if (exp & 1) {
            result = mod(result * base, modulo);
        }
        base = mod(base ** 2, modulo);
        exp >>= 1;
    }
    return result;
}

/**
 * Gets the inverse of a given number using extended euclidian 
 * @param {*} n 
 * @param {*} modulo 
 */
export function inverse(n, modulo) {
    let [r1, r] = [n, modulo];
    let [s1, s] = [1, 0];

    while (r != 0) {
        let q = Math.floor(r1 / r);
        [r1, r] = [r, r1 - q * r];
        [s1, s] = [s, s1 - q * s];
    }

    return mod(s1, modulo);
}
