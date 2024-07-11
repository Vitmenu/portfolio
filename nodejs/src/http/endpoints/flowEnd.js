import path                                                from 'node:path';
import express                                             from 'express';

const flowEnd = express.Router();

flowEnd.use((req, res, next) => {
    const newErr = new Error('Not found');
    next(newErr);
});

flowEnd.use((err, req, res, next) => {
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
    
        console.log(`    -    flow end: "${err.message ? err.message : err}" req.accepts: "${specifiedAccepts}" req.originalUrl: "${req.originalUrl}" date: "${new Date()}"  -   `);
        // Content-Type
        switch(specifiedAccepts) {
            case 'text/html':
                res
                .status(200)
                .set('Content-Type', 'text/html')
                .sendFile('index.html', {
                    root: path.resolve('src', 'http', 'static', 'app'),
                });
                break;
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
        console.log(`    -    error caught at flowEnd error: ${err.message ? err.message : err}   -   `);
        res.status(404).end();
    };
});

export default flowEnd;