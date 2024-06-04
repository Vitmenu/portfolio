import express    from 'express';
import langRouter from './lang.js';
import chatRouter from './chat.js';
import multRouter from './mult.js';
import utilRouter from './util.js';
import rateLimit  from '../middlewares/expressRateLimit.js';

const router = express.Router();


// this 'freezone' map has to be updated or replaced for better restful endpoints
const freezone = {
    '/mult/media': true,

    '/util/report': true,
    '/util/search': true,
    '/util/register': true,
    '/util/question': true,

    '/lang/get/en': true,
    '/lang/get/ko': true,
    '/lang/get/ja': true,

    '/chat/mesg-checked-by': true,
    '/chat/load/all/en': true,
    '/chat/load/all/ko': true,
    '/chat/load/all/ja': true,
};

router.use((req, res, next) => {
    if (freezone[req.path]) {
        next();
    } else {
        return rateLimit(req, res, next);
    };
});

router.use('/lang', langRouter);
router.use('/chat', chatRouter);
router.use('/mult', multRouter);
router.use('/util', utilRouter);

router.use((req, res, next) => {
    const newErr = new Error('Not found');
    next(newErr);
});

router.use((err, req, res, next) => {
    try {
        const specifiedAccepts = req.accepts([
            'application/json',
            'text/plain',
            'text/css',
            'text/javascript',
            'text/html',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/svg+xml',
        ]);
    
        console.log(
            `\n   -   error handler at the end of the api route  -   `,
            `\n   -   endpoint: "${req.originalUrl}", accepts: "${specifiedAccepts}"`,
            `\n   -   error message: "${err.message}"    -   `,
        );
    
        switch(specifiedAccepts) {
            case 'text/html':
            case 'application/json':
            case 'text/plain':
            case 'text/css':
            case 'text/javascript':
            case 'image/jpeg':
            case 'image/png':
            case 'image/gif':
            case 'image/svg+xml':
            default:
                res.status(404).end();
        };
    } catch(err) {
        console.log(`   -   error caught at flowEnd error: ${err.message ? err.message : err}   -   `);
        res.status(404).end();
    };
});

export default router;