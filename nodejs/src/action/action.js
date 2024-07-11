import fetch            from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import env              from "../../config/env.js";
import { gptAssistant } from '../gpt/gpt.config.js';
import pgdb             from "../pgdb/pgdb.config.js";
import awsClient        from "../aws-sdk/aws.config.js";
import userSession      from "../session/session.config.js";
import {
    limitStringByteLength,
}                       from "../utils/string.js";

class CommonAction {
    async updateEntity(userId, entityField, entity) {
        try {
            // update db
            const updated = await pgdb.update(userId, entityField, entity);
            
            // update state to related users
            switch(entityField) {
                case 'conv':
                    const updatedConvs = updated.convs[0];
                    const convUserIds = (await pgdb.getBridge('conv_users', 'conv_id', [updatedConvs.id])).convUsers.map(convUser => convUser.user_id);
                    await userSession.broadcast(convUserIds, updatedConvs);
                    break;
                case 'user':
                    const updatedUser = updated.user;
                    const userMembers = await pgdb.getUserMembers(updatedUser.id, updatedUser.cid, updatedUser.company);
                    
                    const userMemberIds = userMembers.map(userMember => userMember.id);
                    await userSession.broadcast(userMemberIds, updatedUser);
                    break;
            };

            return updated;
        } catch(err) {
            console.log(`    -    error at async updateEntity():  ${err}`);
            return false;
        };
    };
    async sendMesg(userId, convId, content) {
        try {
            
            const message = await pgdb.createMesg(userId, convId, {content});
            const convUsers = (await pgdb.getBridge('conv_users', 'conv_id', [convId])).convUsers;
            const convUserIds = convUsers.map(convUser => convUser.user_id);

            await userSession.broadcast(convUserIds, message.mesgs[0]);

            return {
                mesgs: message.mesgs,
                convUserIds: convUserIds,
            };
        } catch(err) {
            console.log(`    -    error at async sendMesg():  ${err}`);
            return false;
        };
    };
    async sendEmailToDeveloper(userId, userCompany, messages) {
        const result = await awsClient.sendEmail(userId, userCompany, messages);
        return result;
    };
};


export class AIAction extends CommonAction {
    constructor() {
        super();
        
        for (const actionId of Object.keys(this.#actionList)) {
            this.#setupActionEmbeddings(actionId);
        };

        env.companyList.forEach((val, key) => {
            if (val.toLowerCase() !== 'personal' && val.toLowerCase() !== 'master' && val.toLowerCase() !== 'guest') {
                this.#setupCompanyEmbeddings(val, key);
            };
        });
    };

    async getSimilarity(tableName, content) {
        try {
            if (tableName !== 'ai_action' && tableName !== 'company') throw new Error('Invalid table');
            const res = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                }, 
                body: JSON.stringify({
                    input: content,
                    model: "text-embedding-3-small",
                }),
            });
    
            const result = await res.json();
            const embedding = JSON.stringify(result.data[0].embedding);
            const rows = (await pgdb.pool.query(`SELECT *, 1 - (embedding <=> $1) as similarity FROM public.${tableName}`, [embedding])).rows.sort((a, b) => b.similarity - a.similarity);
            const results = rows.map(ele => {
                delete ele.embedding;
                return ele;
            });
            return results;
        } catch(err) {
            console.log(`    -    error "${err.message ? err.message : err}" at getSimilarity()     -`);
            return;
        };
    };

    #actionList = {
        '5a1e6760-0f4d-499e-9e06-99c8c516c3bf': {
            description: "Create schedule",
            action: () => console.log(this.description),
        },
        '65ed6473-2283-49f6-a28f-dbc8d7f9abdc': {
            description: "Read/Get schedule",
            action: () => console.log(this.description),
        },
        '1d7c48c4-7958-4fab-bbf7-5706b61e2efa': {
            description: "Update/Modify/Edit schedule",
            action: () => console.log(this.description),
        },
        '5e61b2d1-f9b0-4fda-9180-a174ac93d1e4': {
            description: "Delete schedule",
            action: () => console.log(this.description),
        },
        'ab6eb0c7-48d7-47b6-bad1-b0a108ff399a': {
            description: "Update/Modify/Edit user name",
            action: () => console.log(this.description),
        },
        '64205a6b-23c0-4ada-9f90-7eb6ae0c95ac': {
            description: "Update/Modify/Edit chat name",
            action: () => console.log(this.description),
        },
        '399e7a5c-5d25-455c-8f85-b88e3a6f622a': {
            description: "Summarise the conversation",
            action: () => console.log(this.description),
        },
        '69287cf4-7758-4abf-b786-766a269c23a3': {
            description: "Summarise someone's message",
            action: () => console.log(this.description),
        },
        'be5341c5-91d5-4ea4-8f6b-052c58f1c796': {
            description: "Remind me something later",
            action: () => console.log(this.description),
        },
        '511ccbd7-0e49-4755-a996-ce7ca018b451': {
            description: "Question",
            action: () => console.log(this.description),
        },
    };
    async #setupActionEmbeddings(actionId) {
        const rows = (await pgdb.pool.query(`SELECT * FROM ai_action WHERE action_id = $1`, [actionId])).rows;
        if (rows.length < 1) {
            const res = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                }, 
                body: JSON.stringify({
                    input: this.#actionList[actionId].description,
                    model: "text-embedding-3-small",
                }),
            });

            const result = await res.json();
            const embedding = JSON.stringify(result.data[0].embedding);
            const row = (await pgdb.pool.query(`
                INSERT INTO public.ai_action
                    (action_id, embedding)
                VALUES
                    ($1, $2)
                RETURNING *
            `, [actionId, embedding])).rows;
        };
    };
    async #setupCompanyEmbeddings(companyName, companyKey) {
        const rows = (await pgdb.pool.query(`SELECT * FROM public.company WHERE name = $1`, [companyName])).rows;
        if (rows.length < 1) {
            const res = await fetch('https://api.openai.com/v1/embeddings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                }, 
                body: JSON.stringify({
                    input: companyName,
                    model: "text-embedding-3-small",
                }),
            });

            const result = await res.json();
            const embedding = JSON.stringify(result.data[0].embedding);
            const row = (await pgdb.pool.query(`
                INSERT INTO public.company
                    (name, key, embedding)
                VALUES
                    ($1, $2, $3)
                RETURNING *
            `, [companyName, companyKey, embedding])).rows;
        };
    };

    #timeoutIds = {};
    #mesgAccumulator = {};

    async actionForMaster(userId, convId, messageContent) {
        try {

            const timer = 750;

            const runTimeout = async () => {
                const sessionUser = userSession.get(userId);
                if (!userSession.isTyping(userId) && sessionUser) {

                    if (!userSession.isActive(pgdb.masterUid)) {
                        const answer = await gptAssistant.getAnswer({company: sessionUser.company.toLowerCase(), chat_history: [], question: this.#mesgAccumulator[convId]});
    
                        const message = await pgdb.createMesg(pgdb.assistantUid, convId, {content: answer});
                        const convUsers = (await pgdb.getBridge('conv_users', 'conv_id', [convId])).convUsers;
                        const convUserIds = convUsers.map(convUser => convUser.user_id);
                        
                        userSession.aiSession[convId] = false;
                        userSession.getCurrConvMembers(convId);
                        delete this.#timeoutIds[convId];
                        delete this.#mesgAccumulator[convId];

                        await userSession.broadcast(convUserIds, message.mesgs[0]);
                        
                    } else {

                        userSession.aiSession[convId] = false;
                        userSession.getCurrConvMembers(convId);
                        delete this.#timeoutIds[convId];
                        delete this.#mesgAccumulator[convId];
                        
                        clearTimeout(this.#timeoutIds[convId]);

                    };
                } else {
                    
                    // Wait until chatroom members stop typing

                    clearTimeout(this.#timeoutIds[convId]);
                    this.#timeoutIds[convId] = setTimeout(runTimeout, timer);
                };
            };

            if (!userSession.isActive(pgdb.masterUid)) {

                this.#mesgAccumulator[convId] = limitStringByteLength(this.#mesgAccumulator[convId] ? this.#mesgAccumulator[convId] + ' ' + messageContent : messageContent, 720);
                
                clearTimeout(this.#timeoutIds[convId]);

                setTimeout(() => {
                    userSession.aiSession[convId] = true;
                    userSession.getCurrConvMembers(convId);
                }, timer / 2)

                this.#timeoutIds[convId] = setTimeout(runTimeout, timer);

            };


        } catch(err) {
            clearTimeout(this.#timeoutIds[convId]);
            delete this.#timeoutIds[convId];
            delete this.#mesgAccumulator[convId];
        };
    };
    
};

export class UserAction extends CommonAction {
    constructor() {
        super();
    };

    async updateProfile(options={reqUser, body, contentType, entityField, entity}) {
        try {

            if (!options.reqUser
                || !options.body
                || !options.contentType
                || !options.entityField
                || !options.entity
            ) throw new Error(`Invalid arguments. received ${options}`);

            let entity = await pgdb.get(
                options.entityField, 
                options.entityField == 'user'
                    ? options.reqUser.uid
                    : options.entity.id
            );
            entity = entity[options.entityField + 's'][0];

            if (entity.image_key) {
                const result = await awsClient.s3delete({imageKey: entity.image_key});
                if (!result) throw new Error('DeleteObject failed');
            };

            const result = await awsClient.s3put({body: options.body, contentType: options.contentType});
            if (!result) throw new Error('PutObject operation failed');

            const updated = await this.updateEntity(options.reqUser.uid, options.entityField, {...entity, image_key: result.Key});

            return updated;

        } catch(err) {

            console.log(err);
            return false;

        };
    };

    async deleteProfile(options={reqUser, entityId, entityField}) {
        try {

            if (!options.reqUser || !options.entityId || !options.entityField) throw new Error(`Invalid arguments. received ${options}`);

            let entity = await pgdb.get(
                options.entityField,
                options.entityField == 'user'
                    ? options.reqUser.uid
                    : options.entityId
            );
            entity = entity[options.entityField + 's'][0];

            const result = await awsClient.s3delete({imageKey: entity.image_key});
            if (!result) throw new Error('DeleteObject failed');

            const updated = await this.updateEntity(options.reqUser.uid, options.entityField, {...entity, image_key: null});

            return updated;
            
        } catch(err) {

            console.log(err);
            return false;

        }
    };

    async checkMesgs(userId, unreadMesgs) {
        try {
            const mesgCheckedBys = (await pgdb.createMesgCheckedBys(userId, unreadMesgs)).mesgCheckedBys;
            const conv = (await pgdb.get('conv', unreadMesgs[0].conv_id)).convs[0];
            const convUserIds = (await pgdb.getBridge('conv_users', 'conv_id', [conv.id])).convUsers.map(convUser => convUser.user_id);
    
            for (const mesgCheckedBy of mesgCheckedBys) {
                await userSession.broadcast(convUserIds, mesgCheckedBy);
            };
            
            return true;
        } catch(err) {
            return false;
        };
    };
    #emailSentBy = {};
    async sendEmail(userId, userCompany, message) {
        if (this.#emailSentBy[userId]) {
            return false
        } else {
            const result = await super.sendEmailToDeveloper(userId, userCompany, message);
            if (result) {
                this.#emailSentBy[userId] = setTimeout(() => {
                    delete this.#emailSentBy[userId]
                }, 1000 * 60 * 5);
                return result;
            } else {
                return result;
            };
        };
    };
    #errorReportedBy = {};
    async reportError(userId, userCompany, errorLocation) {
        if (this.#errorReportedBy[userCompany]) {
            return false
        } else {
            const message = `Client side error occurred at ${errorLocation}`;
            const result = await super.sendEmailToDeveloper(userId, userCompany, message);
            if (result) {
                this.#errorReportedBy[userCompany] = setTimeout(() => {
                    delete this.#errorReportedBy[userCompany]
                }, 1000 * 60 * 60 * 12);
                return result;
            } else {
                return result;
            };
        };
    };

};