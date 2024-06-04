import cookie                                    from 'cookie';
import cookieSignature                           from 'cookie-signature';
import env                                       from '../../../config/env-initiator.js';

const extractCookie = (req, cookieName) => {
    try {
        const parsed = cookie.parse(req.headers.cookie);
        if (parsed[cookieName]) {
            try {
                const unsigned = cookieSignature.unsign(parsed[cookieName].slice(2), env.cookie_signature);
                return unsigned;
            } catch(err) {
                console.log(`   -   extract${cookieName}Cookie() error   ${err.message ? err.message : err}  -`);
                return false;
            };
        } else {
            return false
        };
    } catch(err) {
        console.log(`   -   extract${cookieName}Cookie() error   ${err.message ? err.message : err}  -`);
        return false
    };
};

const extract = {
    cookie: extractCookie,
};

export default extract;