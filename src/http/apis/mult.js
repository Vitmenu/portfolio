import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
}                                   from "@aws-sdk/client-s3";
import {
    CreateInvalidationCommand,
}                                   from "@aws-sdk/client-cloudfront";
import { getSignedUrl }             from "@aws-sdk/cloudfront-signer";
import { v4 as uuidv4 }             from "uuid";
import pgdb                         from "../../pgdb/pgdb.config.js";
import { User }                     from "../../pgdb/entities.js";
import userSession                  from "../../session/session.config.js";
import env                          from "../../../config/env-initiator.js";
import {
    userAction,
    aiAction,
} from '../../action/action.config.js';

import path                         from "node:path";
import express                      from "express";
import multer                       from "multer";
import sharp                        from "sharp";
import asyncWrapper                 from "../utils/asyncWrapper.js";
import awsClient                    from "../../aws-sdk/aws.config.js";


const multRouter = express.Router();

multRouter.get('/media', asyncWrapper(async (req, res) => {
    if (!req.query.objKey) throw new Error('Invalid request body');
    const mediaUrl = await awsClient.getSignedUrl(req.query.objKey);
    mediaUrl
        ? res.status(200).send(mediaUrl)
        : res.status(404).end();
}));

const storage = multer.memoryStorage();
const singleUpload = multer({
    storage,
    fileFilter(req, file, cb) {
        const allowedExtnames = ['.jpg', '.jpeg', '.png'];
        const allowedContentTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (allowedExtnames.includes(path.extname(file.originalname)) && allowedContentTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.log(`    -     Upload denied due to not allowed extention name: ${file.originalname} or content type: ${file.mimetype} at ${req.originalUrl}`)
            cb(null, false);
        };
    },
    limits: {
        fieldNameSize: 128,
        fieldSize: 1 * 1024 * 1024,
        fields: 2,
        fileSize: 5 * 1024 * 1024,
        files: 1,
        parts: 4,
    },
}).single('image');

multRouter.post('/media/upload', singleUpload, asyncWrapper(async (req, res) => {
    if (req.user.cid == env.guestCid) {

        res.status(429).end();

    } else {

        // const getSharped = async (reqFile) => {
            
        //     const jpgFamily = ['image/jpeg', 'image/jpg'];
    
        //     let result;
    
        //     if (jpgFamily.includes(reqFile.mimetype)) {
        //         result = await sharp(reqFile.buffer)
        //             .jpeg({ quality: 10 })
        //             .toBuffer();
        //     } else {
        //         result = await sharp(reqFile.buffer)
        //             .png({ quality: 10 })
        //             .toBuffer();
        //     };
    
        //     return result;
        // };
        // const sharped = await getSharped(req.file);
    
        // const upload = Buffer.byteLength(req.file.buffer) > Buffer.byteLength(sharped) ? sharped : req.file.buffer;
    
        const entity = JSON.parse(req.body.entity);
    
        const result = await userAction.updateMedia({
            reqUser: req.user,
            body: req.file.buffer, 
            // body: upload, 
            contentType: req.file.mimetype,
            entityField: entity.field,
            entity: entity.param,
        });
    
        result
            ? res.status(200).end()
            : res.status(404).end();
        
    };
}));

multRouter.post('/media/delete', asyncWrapper(async (req, res) => {
    if (req.user.cid == env.guestCid) {

        res.status(429).end();

    } else {

        
    };
}));

export default multRouter;