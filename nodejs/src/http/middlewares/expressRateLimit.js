// import { rateLimit } from "express-rate-limit";
import env from "../../../config/env.js";

let map = {}

setInterval(() => {
    for (const [key, value] of Object.entries(map)) {
        delete map[key];
    };
}, 1000 * 60 * 15);

const rateLimit = (req, res, next) => {
    
    if (map[req.user.uid] === undefined) {
        map[req.user.uid] = 0;
    };

    map[req.user.uid] ++;

    const max = req.user.cid == env.guestCid
        ? 6
        : 200;

    if (map[req.user.uid] <= max && env.companyList.has(req.user.cid)) {
        next();
    } else {
        res.status(429).end();
    };
};

export default rateLimit;