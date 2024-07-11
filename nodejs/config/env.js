import fs         from "node:fs";
import path       from "node:path";

const companys = {
    companyList: new Map([
        [process.env.CID_COMPANY1, 'MyNavi'],
        [process.env.CID_GUEST, 'Guest'],
        [process.env.CID_PERSONAL, 'Personal'],
        [process.env.CID_MASTER, 'Master'],
    ]),
};

const env = process.env.NODE_ENV === 'production' ? {
    cookie_signature: process.env.COOKIE_SIGNATURE,
    cloudfront_pk_id: process.env.CLOUDFRONT_PK_ID,
    cloudfront_pk: fs.readFileSync(path.resolve('config', 'sslkeys', 'cloudfront', 'private_key.pem'), 'utf-8'),
    cloudfront_dist_id: process.env.CLOUDFRONT_DIST_ID,
    cloudfront_dist_domain: process.env.CLOUDFRONT_DIST_DOMAIN,
    emailaddress: process.env.EMAIL_ADDRESS,
    
    jwt_signature_user: process.env.JWT_SIGNATURE_USER,
    user_cookie_option: {
        maxAge: 1000 * 60 * 60 * 24 * 28,
        domain: 'portfolio.vitmenu.com',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        signed: true,
    },
    ...companys,
    masterUid: process.env.UID_MASTER,
    assistantUid: process.env.UID_ASSISTANT,
    masterCid: process.env.CID_MASTER,
    guestCid: process.env.CID_GUEST,
    siteUrl: 'portfolio.vitmenu.com',
    s3bucketName: process.env.S3BUCKETNAME,

    clientConfiguration: {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: fs.readFileSync(process.env.CREDENTIALS, { encoding: 'utf-8' }).match(/aws_access_key_id\s*=\s*(\S+)/)[1],
            secretAccessKey: fs.readFileSync(process.env.CREDENTIALS, { encoding: 'utf-8' }).match(/aws_secret_access_key\s*=\s*(\S+)/)[1],
        },
    },
    portfolio_port: process.env.PORTFOLIO_PORT,
    portfolio_host: process.env.PORTFOLIO_HOST,

} : {
    cookie_signature: 'secret-123124125',
    cloudfront_pk_id: process.env.CLOUDFRONT_PK_ID,
    cloudfront_pk: fs.readFileSync(path.resolve('config', 'sslkeys', 'cloudfront', 'private_key.pem'), 'utf-8'),
    cloudfront_dist_id: process.env.CLOUDFRONT_DIST_ID,
    cloudfront_dist_domain: process.env.CLOUDFRONT_DIST_DOMAIN,
    emailaddress: process.env.EMAIL_ADDRESS,
    
    jwt_signature_user: 'secret-aefhlaefafejklealkf',
    user_cookie_option: {
        maxAge: 1000 * 60 * 60 * 24 * 28,
        domain: 'localhost',
        httpOnly: false,
        secure: false,
        sameSite: 'strict',
        signed: true,
    },
    postgres_db: 'portfolio',
    ...companys,
    masterUid: process.env.UID_MASTER,
    assistantUid: process.env.UID_ASSISTANT,
    masterCid: process.env.CID_MASTER,
    guestCid: process.env.CID_GUEST,
    siteUrl: 'portfolio.vitmenu.com',
    s3bucketName: process.env.S3BUCKETNAME,

    clientConfiguration: {
        region: process.env.AWS_REGION,
    },

    portfolio_port: 14001,
    portfolio_host: 'localhost',
};

export default env;