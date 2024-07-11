import path             from 'node:path';
import express          from 'express';
import cors             from 'cors';
import helmet           from 'helmet';
import cookieParser     from 'cookie-parser';
import authenticator    from './middlewares/authenticator.js';
import apiRouter        from './apis/route.js';
import flowEnd          from './endpoints/flowEnd.js';
import env              from '../../config/env.js';

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cookieParser([env.cookie_signature]));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(helmet({
    contentSecurityPolicy: env.production ? {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: [
                `${env.siteUrl}`,
                `wss://${env.siteUrl}`,
            ],
            scriptSrc: [
                `${env.siteUrl}`,
            ],
            imgSrc: [
                `self`,
                env.cloudfront_dist_domain,
                `blob:`,
                `data:`,
            ],
            mediaSrc: [
                env.cloudfront_dist_domain,
            ],
        }
    } : false,
}));
app.use(cors({
    credentials: true,
    origin: env.production ? [
            `https://${env.siteUrl}`,
            `wss://${env.siteUrl}`,
        ] : [
            '*',
            'http://localhost:5173',
            'http://localhost:14001',
        ],
    optionsSuccessStatus: 200
}));

app.use(authenticator);

app.use('/api', apiRouter);
app.use('/public', express.static(path.resolve('src', 'http', 'static', 'public')));
app.use(express.static(path.resolve('src', 'http', 'static', 'app'), {
    index: 'index.html',
}));
app.use(flowEnd);

export default app;