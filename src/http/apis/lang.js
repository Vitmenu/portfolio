import path                                                from 'node:path';
import express                                             from 'express';
import asyncWrapper                                        from '../utils/asyncWrapper.js';

const langRouter = express.Router();

langRouter.get('/get/:lang', asyncWrapper(async (req, res, next) => {
    const lang = req.params.lang;

    const sendFileOptions = {
        root: path.resolve('src', 'http', 'static-private', 'langs'),
        headers: {
            'Content-Type': 'application/json',
            // 'Cache-Control': 'public, max-age=300',
            'Cache-Control': 'no-store',
        },
        dotfiles: 'deny',
        // cacheControl: true,
    };
    const sendFileError = (err) => {
        err && console.log(`   -   sendFileError ${err}   -   `);
        err && next(err);
    };
    res.status(200).sendFile(lang + '.json', sendFileOptions, sendFileError);
}));

export default langRouter;