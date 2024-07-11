import { v4 as uuidv4 }     from "uuid";
import {
    SESClient,
    SendEmailCommand,
}                           from "@aws-sdk/client-ses";
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
}                           from "@aws-sdk/client-s3";
import {
    CloudFrontClient,
    CreateInvalidationCommand,
}                           from "@aws-sdk/client-cloudfront";
import { getSignedUrl }     from "@aws-sdk/cloudfront-signer";
import env                  from '../../config/env.js';
import templateFormer       from "./ses/template.js";

class AWSClient {
    constructor() {
        this.ses        = new SESClient(env.clientConfiguration);
        this.s3         = new S3Client(env.clientConfiguration);
        this.cloudFront = new CloudFrontClient(env.clientConfiguration);
    };

    #_signedUrls = {};
    async getSignedUrl(objKey) {
        try {
            if (this.#_signedUrls[objKey]) {
                
                return this.#_signedUrls[objKey];
                
            } else {
                
                this.#_signedUrls[objKey] = getSignedUrl({
                    url: `${env.cloudfront_dist_domain}/${objKey}`, // data.item_image => s3 key
                    dateLessThan: new Date(Date.now() + 1000 * 60 * 60),
                    privateKey: env.cloudfront_pk,
                    keyPairId: env.cloudfront_pk_id,
                });

                setTimeout(() => delete this.#_signedUrls[objKey], 1000 * 60 * 50);

                return this.#_signedUrls[objKey];
            };
            
        } catch(err) {
            console.log(`    -    error at async getSignedUrl():  ${err}`);
            return false;
        };
    };

    async s3delete(options={imageKey}) {
        try {
            if (!options.imageKey) throw new Error(`Invalid arguments. received ${options}`);

            const deleteObjectParams = {
                Bucket: env.s3bucketName,
                Key: options.imageKey,
            };

            const deleteObjectCommand = new DeleteObjectCommand(deleteObjectParams);
            await this.s3.send(deleteObjectCommand);
        
            const invalidationParams = {
                DistributionId: env.cloudfront_dist_id,
                InvalidationBatch: {
                    CallerReference: options.imageKey,
                    Paths: {
                        Quantity: 1,
                        Items: [
                            "/" + options.imageKey,
                        ],
                    },
                },
            };

            const invalidationCommand = new CreateInvalidationCommand(invalidationParams);

            await this.cloudFront.send(invalidationCommand);

            return true;

        } catch(err) {
            console.log(`    -    error at async s3delete():  ${err}`);
            return false;
        };
    };

    async s3put(options={body, contentType}) {
        try {
            if (!options.body || !options.contentType) throw new Error('Invalid arguments');

            const newKey = uuidv4();

            const params = {
                Bucket: env.s3bucketName,
                Key: newKey,
                Body: options.body,
                ContentType: options.contentType,
            };

            const command = new PutObjectCommand(params);

            await this.s3.send(command);
            
            return params;

        } catch(err) {
            console.log(`    -    error at async s3put():  ${err}`);
            return false;
        };
    };

    async sendEmail(sender, senderCompany, message) {
        try {
            const params = templateFormer(sender, senderCompany, message);
            const command = new SendEmailCommand(params);
            await this.ses.send(command);
            return true;
        } catch(err) {
            console.log(`    -    error at async sendEmail():  ${err}`);
            return false;
        };
    };
};

export default AWSClient;
