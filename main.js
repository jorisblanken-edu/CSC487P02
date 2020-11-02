// Emily Crumpler and Joris Blanken
// CSC487 Project 2
// This program links to the html page to give it funcitonality
//
// All functions within this program were created by Emily Crumpler
// and Joris Blanken and were not obtained from other sources, 
// with the exception of the hashing function

import * as rsa from './rsa.js';
import * as certificate from './certificate.js';

const genKeyButton = document.querySelector('#genKeyButton');
const rsaPublicKey = document.querySelector('#rsaPublicKey');
const rsaPrivateKey = document.querySelector('#rsaPrivateKey');

genKeyButton.onclick = () => {
    const [publ, priv] = rsa.gen_keys();

    rsaPublicKey.textContent = JSON.stringify(publ);
    rsaPrivateKey.textContent = JSON.stringify(priv);
}

const genCertButton = document.querySelector('#genCertButton');
const certificateArea = document.querySelector('#certificate');
const issuer = document.querySelector('#issuer');
const startDate = document.querySelector('#startDate');
const endDate = document.querySelector('#endDate');
const certificatePublicKey = document.querySelector('#certificatePublicKey');
const downloadCert = document.querySelector('#downloadCert');

genCertButton.onclick = () => {
    const config = {
        issuer: issuer.value,
        notBefore: startDate.value,
        notAfter: endDate.value,
        publicKey: JSON.parse(certificatePublicKey.value)
    };

    const cert = certificate.generate(config);
    certificateArea.textContent = JSON.stringify(cert, null, 4);
    downloadCert.href = 'data:application/octet-stream;charset=utf-16le;base64,' + btoa(JSON.stringify(cert, null, 4));
}

const documentFile = document.querySelector("#documentFile");
const selectedCertificate = document.querySelector("#selectedCertificate");
const documentKey = document.querySelector("#documentKey");
const signDocButton = document.querySelector("#signDocButton");
const signedCertificate = document.querySelector("#signedCertificate");
const downloadSignedCert = document.querySelector("#downloadSignedCert");

documentFile.onchange = () => {
    const doc = documentFile.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        selectedCertificate.textContent = reader.result;
    }
    reader.readAsText(doc);
}

signDocButton.onclick = () => {
    const cert = selectedCertificate.textContent;
    const key = JSON.parse(documentKey.value);
    const signed = certificate.sign(cert, key);

    const base64 = btoa(JSON.stringify(signed));
    signedCertificate.textContent = base64;
    downloadSignedCert.href = 'data:application/octet-stream;charset=utf-16le;base64,' + base64;
}


const certificateFile = document.querySelector("#certificateFile");
const selectedSignedCertificate = document.querySelector("#selectedSignedCertificate");
const validationKey = document.querySelector("#validationKey");
const validate = document.querySelector("#validate");
const validity = document.querySelector("#validity");

certificateFile.onchange = () => {
    const doc = certificateFile.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        selectedSignedCertificate.textContent = btoa(reader.result);
    }
    reader.readAsText(doc);
}

validate.onclick = () => {
    const doc = JSON.parse(atob(selectedSignedCertificate.textContent));
    const key = JSON.parse(validationKey.value);
    const blocks = rsa.apply(key, doc);
    const decoder = new TextDecoder();
    const json = decoder.decode(new Uint8Array(blocks));
    let cert;

    try {
        cert = JSON.parse(JSON.parse(json));
    } catch {
        validity.textContent = 'Invalid public key';
        return;
    }

    const now = new Date();
    const notBefore = new Date(cert.validity.notBefore);
    const notAfter = new Date(cert.validity.notAfter);
    if (now.getTime() < notBefore.getTime()) {
        validity.textContent = 'Certificate is not yet valid';
    } else if (now.getTime() > notAfter.getTime()) {
        validity.textContent = 'Certificate is no longer valid';
    } else {
        validity.textContent = 'Certificate is valid';
    }
}