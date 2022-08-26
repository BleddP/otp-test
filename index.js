const crypto = require('crypto')
const util = require('util')
const notp = require('notp')
const base32 = require('thirty-two')
const qr = require('qr-image')
var qrcode = require('qrcode-terminal');

const secret = 'POGKADU6MKX33UVX7EJOKGZVV75RHW5DSXRHEJ6DWE4PE2VGTHGA'

// Check TOTP is correct (HOTP if hotp pass type)
const verify = (input, secret) => { 
    const generate = notp.totp.gen(secret)
    const decodedSecret = base32.decode(secret)

    console.log({input, generate, secret, decodedSecret})

    const isValid = notp.totp.verify(input, secret, {
        window: 3,
        time: 30
    });

    // invalid token if login is null
    if (!isValid) {
        return console.log('❌ Token invalid');
    }

    // valid token
    console.log('✅ Token valid, sync value is %s', isValid.delta);
}


const generate = () => {
    var key = crypto.randomBytes(32)

    // encoded will be the secret key, base32 encoded
    var encoded = base32.encode(key);

    // Google authenticator doesn't like equal signs
    var encodedForGoogle = encoded.toString().replace(/=/g,'');

    // to create a URI for a qr code (change totp to hotp if using hotp)

    var authUrl = util.format('otpauth://totp/%s?secret=%s', 'NEW_TEST', encodedForGoogle);

    var renderQR = qr.imageSync(authUrl, { type: 'svg' });
    console.log({
        secret: encodedForGoogle,
    })
    qrcode.generate(authUrl, {small: true})
}

const args = process.argv.slice(2)[0]
const terminalInput = process.argv.slice(3)[0]
if (args === 'generate') generate()
if (args === 'verify') verify(terminalInput, secret)
