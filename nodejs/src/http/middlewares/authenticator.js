import jwt              from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pgdb             from "../../pgdb/pgdb.config.js";
import env              from '../../../config/env.js';

const validateUserCookie = (userCookie) => {
    try {
        const issuedJWT       = jwt.verify(userCookie, env.jwt_signature_user);
        const verifiedCompany = env.companyList.get(issuedJWT.cid);
        const reqUser = {
            ...issuedJWT,
            company: verifiedCompany,
        };
        return reqUser;
    } catch(err) {
        return;
    };
};

const authenticator = (req, res, next) => {
    const validatedUser = validateUserCookie(req.signedCookies.user);
    
    if (validatedUser) {
        // Authenticated
        
        req.user = validatedUser;
        next();

    } else {
        // Issue new user cookie
        
        const verifiedCompany = env.companyList.get(req.query.company_id);
        
        const isMaster = verifiedCompany === 'Master';
        
        const userJwtPayload = {
            cid: verifiedCompany ? req.query.company_id : env.guestCid,
            uid: isMaster ? pgdb.masterUid : uuidv4(),
        };

        const newUserJwt = jwt.sign(userJwtPayload, env.jwt_signature_user, { expiresIn: '15d' });

        res.status(301).cookie('user', newUserJwt, env.user_cookie_option).redirect('/');
        
    };
};

export default authenticator;