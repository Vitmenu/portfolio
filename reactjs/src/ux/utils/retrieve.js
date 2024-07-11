import localConsole from "./localLog";
import env          from "../env";

const retrieve = async (path, options, cb) => {
    const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : `https://${env.siteUrl}`;
    try {
        const res = await fetch(url + path, options);
        if (res.ok) {
            if (typeof cb === 'function') {
                return cb(res);
            };
        } else {
            // console.log(res.status);

            if (res.status === 429) {

                const custEvent = new CustomEvent('cust-big-modal', {
                    detail: {
                        item: true,
                    },
                });
                dispatchEvent(custEvent);

            };
            if (typeof cb === 'function') {
                return cb(null);
            };
        };
    } catch(err) {
        localConsole.log(`   -   Error ${err.messages ? err.messages : err}   -   `);
    };
};
 
export default retrieve;