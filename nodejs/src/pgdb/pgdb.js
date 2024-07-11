import pg               from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { faker }        from '@faker-js/faker';
import {
    User,
    Conv,
    Mesg,
    MesgCheckedBy,
}                       from "./entities.js";
import env              from '../../config/env.js';

/*

delete from public.mesg_checked_by; delete from public.mesg; delete from public.conv_users; delete from public.conv; delete from public.user;

*/

class PostgresDB {
    constructor() {

        this.masterUid    = env.masterUid;
        this.assistantUid = env.assistantUid;
        this.masterCid    = env.masterCid;
        
        this.#configureDB();
    };

    
    pool = new pg.Pool({
        host: env.db_host,
        user: env.postgres_user,
        database: env.postgres_db,
        port: env.db_port,
        password: env.postgres_password,
    
        max: 16,
        idleTimeoutMillis: 1000 * 10,
        connectionTimeoutMillis: 0,
    });

    async #configureDB() {

        const selectedMaster = await this.pool.query(`SELECT * FROM public.user WHERE id = $1`, [this.masterUid]);
        const selectedAssistant = await this.pool.query(`SELECT * FROM public.user WHERE id = $1`, [this.assistantUid]);
        if (selectedMaster.rows.length < 1) {
            await this.pool.query(`
                INSERT INTO public.user
                    (id, name, image_key, company, cid, created)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
            `, [this.masterUid, 'Juyeon Kim', null, 'Master', this.masterCid, Date.now()]);
        };
        if (selectedAssistant.rows.length < 1) {
            await this.pool.query(`
                INSERT INTO public.user
                    (id, name, image_key, company, cid, created)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
            `, [this.assistantUid, "Juyeon's assistant", null, 'Master', this.masterCid, Date.now()]);
        };
    };

    async getAllEntities(reqUser) {
        try {
            const user = new User((await this.pool.query(`SELECT * FROM public.user WHERE id = $1`, [reqUser.uid])).rows[0]);
            const userConvs = (await this.pool.query(`SELECT * FROM public.conv_users WHERE user_id = $1`, [user.id])).rows;

            const convIds = userConvs.map(row => row.conv_id);

            const members = reqUser.uid === this.masterUid
                ? (await this.pool.query('SELECT * FROM public.user WHERE id != $1', [this.masterUid])).rows
                : (
                    reqUser.cid == env.guestCid ? [
                        ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1', [this.masterCid])).rows.map(member => ({...member, cid:user.cid, company: user.company})),
                    ] : [
                        ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1 AND id != $2', [user.cid, user.id])).rows,
                        ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1', [this.masterCid])).rows.map(member => ({...member, cid:user.cid, company: user.company})),
                    ]
                );
            
            let convs = [];
            let mesgs = [];
            let mesgCheckedBys = [];

            if (convIds.length > 0) {
                convs = (await this.pool.query(`SELECT * FROM public.conv WHERE id = ANY($1)`, [convIds])).rows.map(row => new Conv(row));
                mesgs = (await this.pool.query(`SELECT * FROM public.mesg WHERE conv_id = ANY($1)`, [convIds])).rows.map(row => new Mesg(row));
                
                const mesgIds = mesgs.map(row => row.id);

                mesgCheckedBys = (await this.pool.query(`SELECT * FROM public.mesg_checked_by WHERE mesg_id = ANY ($1)`, [mesgIds])).rows.map(row => new MesgCheckedBy(row));
            };

            const convUsers = (await this.pool.query(`SELECT * FROM public.conv_users WHERE conv_id = ANY ($1)`, [convIds])).rows;

            const result = {
                user,
                convUsers,
                members,
                convs,
                mesgs,
                mesgCheckedBys,
            };

            return result;

        } catch(err) {
            !err.message.includes('Invalid options for User') && console.log(`    -    error at async getAllEntities():  ${err}`);
            return;
        };
    };
    async getUserMembers(userId, userCid, userCompany) {
        try {
            const members = userCid == env.guestCid ? [
                ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1', [this.masterCid])).rows.map(member => ({...member, cid:userCid, company: userCompany})),
            ] : [
                ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1 AND id != $2', [userCid, userId])).rows,
                ...(await this.pool.query('SELECT * FROM public.user WHERE cid = $1', [this.masterCid])).rows.map(member => ({...member, cid:userCid, company: userCompany})),
            ];
            return members;
        } catch(err) {
            console.log(`    -    error at async getUserMembers():  ${err}`);
            return;
        };
    };
    async createUser(reqUser, reqParamLang) {
        const client = await this.pool.connect();
        try {
            await client.query(`BEGIN`);
            const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
            const newName = `${capitalizeFirstLetter(faker.word.adjective({ length: { min: 4, max: 8 }}))} ${capitalizeFirstLetter(faker.animal.type({ length: { min: 2, max: 12 }}))}`;
            const user = (await client.query(`
                INSERT INTO public.user
                    (id, name, image_key, company, cid, created)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [reqUser.uid, newName, null, reqUser.company, reqUser.cid, Date.now()])).rows[0];

            const members = await this.getUserMembers(user.id, user.cid, user.company);
            if (!members) throw new Error('Failed to get members');

            const newConvTemplate = {
                created: Date.now(),
                en: {
                    title: 'New Chat',
                    mesg1: `Welcome to my portfolio website. you must be here from ${env.companyList.get(reqUser.cid)} :)`,
                    mesg2: `Hello, it's Juyeon Kim's AI assistant. I will answer you on his behalf when he is absent. Ask me about Juyeon Kim.`,
                },
                ko: {
                    title: '새로운 채팅',
                    mesg1: `내 포트폴리오 웹사이트에 오신 것을 환영합니다. 당신은 ${env.companyList.get(reqUser.cid)}에서 여기에 오신 것 같아요 :)`,
                    mesg2: `안녕하세요, 김주연의 AI 어시스턴트입니다. 그가 부재중일 때 대신 답변해 드리겠습니다. 김주연에 대해 물어보세요.`,
                },
                ja: {
                    title: '新しいチャット',
                    mesg1: `私のポートフォリオウェブサイトへようこそ。あなたは${env.companyList.get(reqUser.cid)}からここに来たはずです :)`,
                    mesg2: `こんにちは、これはJuyeon KimのAIアシスタントです。彼が不在の場合は代わりにお答えします。Juyeon Kimについて質問してください。`,
                },
            };
            const newConvLang = newConvTemplate[reqParamLang];

            const convs = [
                new Conv((await client.query(`
                    INSERT INTO public.conv
                        (id, name, image_key, created)
                    VALUES
                        ($1, $2, $3, $4)
                    RETURNING *
                `, [uuidv4(), newConvLang.title, null, newConvTemplate.created])).rows[0])
            ];

            const convUsers = [
                (await client.query(`INSERT INTO conv_users (conv_id, user_id) VALUES ($1, $2) RETURNING *`, [convs[0].id, this.masterUid])).rows[0],
                (await client.query(`INSERT INTO conv_users (conv_id, user_id) VALUES ($1, $2) RETURNING *`, [convs[0].id, this.assistantUid])).rows[0],
                (await client.query(`INSERT INTO conv_users (conv_id, user_id) VALUES ($1, $2) RETURNING *`, [convs[0].id, user.id])).rows[0],
            ];

            const mesgs = [
                new Mesg((await client.query(`
                    INSERT INTO public.mesg
                        (id, conv_id, user_id, created, content, image_key)
                    VALUES
                        ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                `, [uuidv4(), convs[0].id, this.masterUid, Date.now(), newConvLang.mesg1, null])).rows[0]),
                new Mesg((await client.query(`
                    INSERT INTO public.mesg
                        (id, conv_id, user_id, created, content, image_key)
                    VALUES
                        ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                `, [uuidv4(), convs[0].id, this.assistantUid, Date.now(), newConvLang.mesg2, null])).rows[0]),
            ];

            const newMesgCheckedBy = async (mesgId, userId) => {
                return new MesgCheckedBy((await client.query(`
                    INSERT INTO public.mesg_checked_by
                        (mesg_id, user_id)
                    VALUES
                        ($1, $2)
                    RETURNING *
                `, [mesgId, userId])).rows[0]);
            };

            const mesgCheckedBys = [
                await newMesgCheckedBy(mesgs[0].id, this.masterUid),
                await newMesgCheckedBy(mesgs[0].id, this.assistantUid),
                await newMesgCheckedBy(mesgs[1].id, this.masterUid),
                await newMesgCheckedBy(mesgs[1].id, this.assistantUid),
            ];
    
            await client.query('COMMIT');

            const result = {
                user,
                convUsers,
                members,
                convs,
                mesgs,
                mesgCheckedBys,
            };

            return result;
    
        } catch(err) {
            await client.query(`ROLLBACK`);
            console.log(`    -    error at async createUser():  ${err}`);
            return;
        } finally {
            client.release();
        };
    };

    async createConv(convUserIds, lang='en') {
        const client = await this.pool.connect();
        try {
            await client.query(`BEGIN`);

            const newConvTemplate = {
                created: Date.now(),
                en: 'New Chat',
                ko: '새로운 채팅',
                ja: '新しいチャット',
            };

            const conv = (await client.query(`
                INSERT INTO public.conv
                    (id, name, image_key, created)
                VALUES
                    ($1, $2, $3, $4)
                RETURNING *
            `, [uuidv4(), newConvTemplate[lang], null, newConvTemplate.created])).rows[0];

            let convUsers;

            if (Array.isArray(convUserIds)) {
                convUsers = await Promise.all(convUserIds.map(async memberId => {
                    const result = await client.query(`
                        INSERT INTO public.conv_users
                            (conv_id, user_id)
                        VALUES
                            ($1, $2)
                        RETURNING *
                    `, [conv.id, memberId]);
                    return result.rows[0];
                }));
            } else {
                throw new Error('convUserIds must be an array');
            };

            await client.query('COMMIT');

            const result = {
                convs: [conv],
                convUsers,
            };

            return result;
        } catch(err) {
            await client.query(`ROLLBACK`);
            console.log(`    -    error at async createConv():  ${err}`);
            return;
        } finally {
            client.release();
        };
    };

    async get(entity, entityId) {
        try {
            switch(entity) {
                case 'user':
                case 'conv':
                case 'mesg':
                    const result = (await this.pool.query(`
                        SELECT * FROM ${entity == 'user' ? 'public.user' : entity} WHERE id = $1
                    `, [entityId])).rows;
                    return {
                        [entity + 's']: result,
                    };
                default:
                    throw new Error(`Invalid entity received ${entity}`);
            };
        } catch(err) {
            console.log(`    -    error at async get():  ${err}`);
            return;
        };
    };
    async getBridge(bridge, column, columnValues) {
        try {
            switch(bridge) {
                case 'conv_users':
                case 'mesg_checked_by':
                    if (!Array.isArray(columnValues)) throw new Error('Column values must be an array');
                    
                    const result = (await this.pool.query(`
                        SELECT * FROM ${bridge} WHERE ${column} = ANY($1)
                    `, [columnValues])).rows;

                    return {
                        [bridge === 'conv_users' ? 'convUsers' : 'mesgCheckedBy']: result,
                    };
                default:
                    throw new Error(`Invalid bridge received ${bridge}`);
            };
        } catch(err) {
            console.log(`    -    error at async getBridge():  ${err}`);
            return;
        };
    };

    async createMesg(userId, convId, option={content, image_key}) {
        try {
            if (option.content === undefined && option.image_key === undefined) throw new Error('Option must have either content or image_key');
            option.image_key = option.image_key ? option.image_key : null;
            const mesg = (await this.pool.query(`
                INSERT INTO public.mesg
                    (id, conv_id, user_id, created, content, image_key)
                VALUES
                    ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [uuidv4(), convId, userId, Date.now(), option.content, option.image_key])).rows;

            const result = {
                mesgs: mesg,
            };

            return result;
        } catch(err) {
            console.log(`    -    error at async createMesg():  ${err}`);
            return;
        };
    };
    
    async createMesgCheckedBys(userId, unreadMesgs) {
        try {
            const query = `
                INSERT INTO public.mesg_checked_by
                    (mesg_id, user_id)
                VALUES
                    ${unreadMesgs.map((_, i) => `($${2*i+1}, $${2*i+2})`).join(', ')}
                RETURNING *
            `;
            const values = unreadMesgs.map(unreadMesg => [unreadMesg.id, userId]).flat();

            const mesgCheckedBys = (await this.pool.query(query, values)).rows;

            const result = {
                mesgCheckedBys,
            };

            return result;
        } catch(err) {
            console.log(`    -    error at async createMesgCheckedBys():  ${err}`);
            return;
        };
    };

    async update(userId, entity, goalEntity) {
        try {
            switch(entity) {
                case 'conv':
                    const newConv = new Conv(goalEntity);
                    
                    const updatedConv = (await this.pool.query(`
                        UPDATE public.conv
                        SET name = $1, image_key = $2
                        WHERE id = $3 AND EXISTS (
                            SELECT 1 FROM conv_users
                            WHERE conv_id = $3 AND user_id = $4
                        )
                        RETURNING *
                    `, [newConv.name, newConv.image_key, newConv.id, userId])).rows;
                    
                    return {
                        convs: updatedConv,
                    };
                case 'user':
                    const newUser = new User(goalEntity);
                    
                    const updatedUser = (await this.pool.query(`
                        UPDATE public.user
                        SET name = $1, image_key = $2
                        WHERE id = $3
                        RETURNING *
                    `, [newUser.name, newUser.image_key, userId])).rows[0];

                    return {
                        user: updatedUser,
                    };
                default:
                    throw new Error(`Invalid entity received ${entity}`);
            };
        } catch(err) {
            console.log(`    -    error at async update():  ${err}`);
            return;
        };
    };
    
    async deleteConvUsers(userId, conv) {
        try {
            await this.pool.query(`
                DELETE FROM conv_users WHERE conv_id = $1 AND user_id = $2 RETURNING *
            `, [conv.id, userId]);
            return true;
        } catch(err) {
            console.log(`    -    error at async deleteConvUsers():  ${err}`);
            return;
        };
    };
    async createConvUsers(userId, conv) {
        try {
            const convUser = (await this.pool.query(`
                INSERT INTO conv_users
                    (conv_id, user_id)
                VALUES
                    ($1, $2)
            `, [conv.id, userId])).rows;
            const result = {
                convUsers: convUser
            };
            return result;
        } catch(err) {
            console.log(`    -    error at async createConvUsers():  ${err}`);
            return;
        };
    };
};


export default PostgresDB;