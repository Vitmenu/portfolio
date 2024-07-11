export class User {
    constructor(options) {
        if (
            typeof options !== 'object' ||
            options.id === undefined ||
            options.name === undefined ||
            options.image_key === undefined ||
            options.company === undefined ||
            options.cid === undefined ||
            options.created === undefined
        ) throw new Error('Invalid options for User');

        this.id = options.id;
        this.name = options.name;
        this.image_key = options.image_key;
        this.company = options.company;
        this.cid = options.cid;
        this.created = options.created;
    };
};

export class ConvUsers {
    constructor(options) {
        if (typeof options !== 'object' ||
            options.conv_id === undefined ||
            options.user_id === undefined 
        ) throw new Error ('Invalid options for ConvUsers');
        this.conv_id = options.conv_id;
        this.user_id = options.user_id;
    };
};

export class Conv {
    constructor(options) {
        if (
            typeof options !== 'object' ||
            options.id === undefined ||
            options.name === undefined ||
            options.created === undefined ||
            options.image_key === undefined
        ) throw new Error('Invalid options for Conv');

        this.id = options.id;
        this.name = options.name;
        this.image_key = options.image_key;
        this.created = options.created;
    };
};

export class Mesg {
    constructor(options) {
        if (
            typeof options !== 'object' ||
            options.id === undefined ||
            options.conv_id === undefined ||
            options.user_id === undefined ||
            options.created === undefined ||
            options.content === undefined ||
            options.image_key === undefined
        ) throw new Error('Invalid options for Mesg');

        this.id = options.id;
        this.conv_id = options.conv_id;
        this.user_id = options.user_id;
        this.created = options.created;
        this.content = options.content;
        this.image_key = options.image_key;
    };
};

export class MesgCheckedBy {
    constructor(options) {
        if (
            typeof options !== 'object' ||
            options.mesg_id === undefined ||
            options.user_id === undefined
        ) throw new Error('Invalid options for MesgCheckedBy');

        this.mesg_id = options.mesg_id;
        this.user_id = options.user_id;
    };
};

export const entityValidator = (obj) => {
    const isUser = Object.hasOwn(obj, 'id')
                && Object.hasOwn(obj, 'name')
                && Object.hasOwn(obj, 'image_key')
                && Object.hasOwn(obj, 'company')
                && Object.hasOwn(obj, 'cid')
                && Object.hasOwn(obj, 'created');
    const isConvUsers = Object.hasOwn(obj, 'conv_id')
                     && Object.hasOwn(obj, 'user_id');
    const isConv = Object.hasOwn(obj, 'created')
                && Object.hasOwn(obj, 'id')
                && Object.hasOwn(obj, 'name')
                && Object.hasOwn(obj, 'image_key');
    const isMesg = Object.hasOwn(obj, 'id')
                && Object.hasOwn(obj, 'conv_id')
                && Object.hasOwn(obj, 'user_id')
                && Object.hasOwn(obj, 'created')
                && Object.hasOwn(obj, 'content')
                && Object.hasOwn(obj, 'image_key');
    const isMesgCheckedBy = Object.hasOwn(obj, 'mesg_id')
                         && Object.hasOwn(obj, 'user_id');
    return isUser ? new User(obj)
        : isConv ? new Conv(obj)
        : isMesg ? new Mesg(obj)
        : isConvUsers ? new ConvUsers(obj)
        : isMesgCheckedBy && new MesgCheckedBy(obj);
};