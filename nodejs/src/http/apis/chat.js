import express                  from 'express';
import asyncWrapper             from '../utils/asyncWrapper.js';
import pgdb                     from '../../pgdb/pgdb.config.js';
import { userAction, aiAction } from '../../action/action.config.js';

const chatRouter = express.Router();

chatRouter.get('/load/all/:lang', asyncWrapper(async (req, res) => {
    const entities = await pgdb.getAllEntities(req.user);
    if (entities) {
        res.status(200).json(entities);
    } else {
        const newEntities = await pgdb.createUser(req.user, req.params.lang);
        if (newEntities) {
            res.status(200).json(newEntities);
        } else {
            res.status(404).json();
        };
    };
}));

chatRouter.post('/conv/create', asyncWrapper(async (req, res) => {
    
    const convUserIds = [...req.body.memberIds, req.user.uid];

    convUserIds.length < 2 && convUserIds.push(pgdb.masterUid);
    
    const isMasterInvited = convUserIds.findIndex(newConvUserId => newConvUserId == pgdb.masterUid) > -1;
    const isAssistantInvited = convUserIds.findIndex(newConvUserId => newConvUserId == pgdb.assistantUid) > -1;

    (isMasterInvited && !isAssistantInvited) && convUserIds.push(pgdb.assistantUid);
    (!isMasterInvited && isAssistantInvited) && convUserIds.push(pgdb.masterUid);

    const newConvUserIds = convUserIds.filter((newConvUserId, index) => convUserIds.indexOf(newConvUserId) === index);

    const result = await pgdb.getBridge('conv_users', 'user_id', newConvUserIds);

    const convIds = {};
    for (const convUser of result.convUsers) {
        if (convIds[convUser.conv_id]) {
            convIds[convUser.conv_id].push(convUser.user_id);
        } else {
            convIds[convUser.conv_id] = [convUser.user_id];
        };
    };

    const convUsers = (await pgdb.getBridge('conv_users', 'conv_id', Object.keys(convIds))).convUsers;

    for (const convUser of convUsers) {
        if (!convIds[convUser.conv_id].includes(convUser.user_id)) {
            convIds[convUser.conv_id].push(convUser.user_id);
        };
    };

    const arraysContainSameElements = (a, b) => {
        if (a.length !== b.length) return false;
    
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
    
        for (let i = 0; i < sortedA.length; i++) {
            if (sortedA[i] !== sortedB[i]) return false;
        };
    
        return true;
    };

    const matchingConvId = Object.keys(convIds).find(key => arraysContainSameElements(convIds[key], newConvUserIds));

    if (matchingConvId) {
        
        const convs = await pgdb.get('conv', matchingConvId);
        const result = {
            ...convs,
            convUsers: newConvUserIds.map(newConvUser => ({conv_id: convs.convs[0].id, user_id: newConvUser})),
        };

        res.status(200).json(result);

    } else {
        
        const result = await pgdb.createConv(newConvUserIds, req.body.lang);

        res.status(200).json(result);

    };
}));

chatRouter.post('/conv/get', asyncWrapper(async (req, res) => {
    const convId = req.body.convId;
    const result = await pgdb.get('conv', convId);
    if (conv) {
        res.status(200).json(result);
    } else {
        res.status(404).end();
    };
}));

chatRouter.put('/:entity/update', asyncWrapper(async (req, res) => {

    const updated = await userAction.updateEntity(req.user.uid, req.params.entity, req.body);
    
    if (updated) {
        res.status(200).json(updated);
    } else {
        res.status(404).end();
    };
}));

chatRouter.delete('/conv-users', asyncWrapper(async (req, res) => {
    const deleted = await pgdb.deleteConvUsers(req.user.uid, req.body.conv);
    if (deleted) {
        res.status(200).end();
    } else {
        res.status(404).end();
    };
}));

chatRouter.post('/mesg-checked-by', asyncWrapper(async (req, res) => {
    const result = await userAction.checkMesgs(req.user.uid, req.body.unreadMesgs);
    if (result) {
        res.status(200).end();
    } else {
        res.status(404).end();
    };
}));

chatRouter.post('/mesg/create', asyncWrapper(async (req, res) => {
    const result = await userAction.sendMesg(req.user.uid, req.body.convId, req.body.content);

    if (result) {
        if (result.convUserIds.includes(pgdb.masterUid)) {
            aiAction.actionForMaster(req.user.uid, req.body.convId, req.body.content);
        };
        res.status(200).end();
    } else {
        res.status(400).end();
    };
}));

export default chatRouter;