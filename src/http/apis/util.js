import express      from 'express';
import jwt          from 'jsonwebtoken';
import asyncWrapper from '../utils/asyncWrapper.js';
import pgdb         from '../../pgdb/pgdb.config.js';
import {
    userAction,
    aiAction,
} from '../../action/action.config.js';
import env from '../../../config/env-initiator.js';

const utilRouter = express.Router();

utilRouter.post('/search', asyncWrapper(async (req, res) => {
    if (req.body.companyName.length < 1 || req.body.companyName.length > 100 || req.user.cid !== env.guestCid) {
        throw new Error('Invalid request body');
    } else {
        const result = await aiAction.getSimilarity('company', req.body.companyName);
        if (result[0]['similarity'] > 0.42) {
            delete result[0]['similarity'];
            delete result[0]['id'];
            res.status(200).json(result[0]);
        } else {
            res.status(404).end();
        };
    }
}));

utilRouter.post('/register', asyncWrapper(async (req, res) => {
    if (req.body.key.length !== 55 || req.body.name.length > 100 || req.user.cid !== env.guestCid) {
        throw new Error('Invalid request body');
    } else {
        if (req.body.name !== env.companyList.get(req.body.key)) {
            res.status(404).end();
        } else {
            await pgdb.pool.query(`
                UPDATE public.user
                SET company = $1, cid = $2
                WHERE id = $3
                RETURNING *
            `, [req.body.name, req.body.key, req.user.uid]);

            const newUserJwtPayload = {
                cid: req.body.key,
                uid: req.user.uid,
            };
    
            const newUserJwt = jwt.sign(newUserJwtPayload, env.jwt_signature_user, { expiresIn: '15d' });
    
            res.status(200).cookie('user', newUserJwt, env.user_cookie_option).end();
        };
    };
}));

utilRouter.post('/email', asyncWrapper(async (req, res) => {
    if (!req.body.body) throw new Error('Invalid request body');
    const result = await userAction.sendEmail(req.user.uid, req.user.company, req.body.body);
    result
        ? res.status(200).send('success')
        : res.status(400).send('waiting');
}));

utilRouter.post('/report', asyncWrapper(async (req, res) => {
    const stringified = JSON.stringify({location: req.body.location, content: req.body.content});
    const result = await userAction.reportError(req.user.uid, req.user.company, stringified);
    result
        ? res.status(200).send('reported')
        : res.status(400).send('already reported');
}));

utilRouter.post('/question', asyncWrapper(async (req, res) => {
    const infoQuestions = {
        en: [
            'What is the purpose of this portfolio website?',
            'What technologies were used to create this portfolio website?',
            'Who is Juyeon Kim?',
            'Tell me about Juyeon Kim\'s technology stack.',
            'Describe Juyeon Kim\'s language skills.',
            'Is Juyeon Kim a college student?',
            'What career does Juyeon Kim have?',
            // '',
            // '',
            // '',
        ],
        ko: [
            '이 포트폴리오 웹 사이트는 어떠한 목적으로 만들어졌나요?',
            '이 포트폴리오 웹 사이트는 어떤 기술로 만들어졌나요?',
            '김주연은 어떤 사람인가요?',
            '김주연의 기술 스택에 대해서 알려주세요.',
            '김주연의 언어적 능력에 대해서 서술해주세요.',
            '김주연은 대학생인가요?',
            '김주연은 어떤 경력을 가지고 있나요?',
            // '',
            // '',
            // '',
        ],
        ja: [
            'このポートフォリオウェブサイトの目的は何ですか？',
            'このポートフォリオウェブサイトを作成するために使用された技術は何ですか？',
            'Juyeon Kimは誰ですか？',
            'Juyeon Kimの技術スタックについて説明してください。',
            'Juyeon Kimの言語スキルについて説明してください。',
            'Juyeon Kimは大学生ですか？',
            'Juyeon Kimはどのようなキャリアを持っていますか？',
            // '',
            // '',
            // '',
        ],
    };

    const randomIndex = Math.floor(Math.random() * infoQuestions[req.body.lang].length);
    const randomQuestion = infoQuestions[req.body.lang][randomIndex];
    
    res.status(200).json({question: randomQuestion});

}));

export default utilRouter;