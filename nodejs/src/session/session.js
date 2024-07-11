import env from "../../config/env.js";

class UserSession {
    constructor() {
        this.#sessionTimer();
    };

    #userSessions = new Map([
        /*
            [
                ws.vm_userId,
                {
                    id: ws.vm_userId,
                    company: ws.vm_company,
                    created: Date.now(),
                    isTyping: false,
                    currConvId: null,
                    ws: newWsList,
                },
            ]
         */
    ]);

    aiSession = {
        // convId: bool <= key: currConv, bool <= isTyping
    };

    #sessionTimer() {
        setInterval(() => {
            this.#userSessions.forEach((userSession, userId) => {
                
                if (userSession.ws.size < 1) {
                    this.#userSessions.delete(userId);
                    
                } else {
                    userSession.ws.forEach((ws, wsId) => {
                        if (!ws.isAlive) {
                            try {
                                typeof ws.terminate === 'function' && ws.terminate();
                                userSession.ws.delete(wsId);
                            } catch(err) {
                                console.log(`    -    Socket termination failed ${err.message ? err.message : err}    -    `);
                            };
                        };
                        ws.isAlive = false;
                        ws.ping();
                    });
                };
            });
        }, 15000);
    };

    sessionHeartBeat(ws) {
        ws.isAlive = true;
    };

    get(userId) {
        return this.#userSessions.get(userId);
    };

    isActive(userId) {
        const userSession = this.#userSessions.get(userId);
        if (userSession) {
            if (userSession.ws.size < 1) {
                return false;
            } else {
                return true;
            };
        } else {
            return false;
        };
    };

    async set(ws) {
        try {
            const userSession = this.#userSessions.get(ws.vm_userId);
            if (userSession) {
                userSession.ws.set(ws.vm_wsId, ws);
                return userSession;
            } else {
                const newWsList = new Map();
                newWsList.set(ws.vm_wsId, ws);
                this.#userSessions.set(ws.vm_userId, {
                    id: ws.vm_userId,
                    company: ws.vm_company,
                    created: Date.now(),
                    isTyping: false,
                    currConvId: null,
                    ws: newWsList,
                });
                return userSession;
            };
            
        } catch(err) {
            console.log(`   -   error   ${err.message ? err.message : err}   -   `);
            return false;
        };
    };

    broadcast(userIds, message) {
        return new Promise ((resolve, reject) => {
            try {
                const stringified = JSON.stringify(message);
                for (const userId of userIds) {
                    const targetUserSession = this.#userSessions.get(userId);
                    if (targetUserSession) {
                        targetUserSession.ws.forEach((wsClient, wsId) => {
                            wsClient.send(stringified);
                        });
                    };
                };
                resolve();
            } catch(err) {
                reject(err);
            };
        });
    };

    getCurrConvMembers(convId) {
        try {
            const typingUsers = {};
            this.#userSessions.forEach((val, key) => {
                if (val.currConvId == convId) {
                    typingUsers[key] = val.isTyping;
                };
            });
            
            const userIds = Object.keys(typingUsers);
            
            if (this.aiSession[convId] && typeof this.aiSession[convId] === 'boolean') {
                typingUsers[env.assistantUid] = this.aiSession[convId];
            };
            
            this.broadcast(userIds, {
                type: "state",
                stateName: "currConvMembers",
                state: typingUsers,
            });
    
            return typingUsers;
        } catch(err) {
            console.log(`   -   error   ${err.message ? err.message : err}   -   `);
            return;
        };
    };

    setIsTyping(userId, boolean) {
        const userSession = this.#userSessions.get(userId);
        if (userSession.isTyping !== boolean) {
            
            userSession.isTyping = boolean;

            this.getCurrConvMembers(userSession.currConvId);
        };
    };

    setcurrConvId(userId, convId) {
        const userSession = this.#userSessions.get(userId);
        if (userSession.currConvId !== convId) {
            userSession.currConvId = convId;

            this.getCurrConvMembers(userSession.currConvId);
        };
    };

    isTyping(userId) {
        return this.#userSessions.get(userId).isTyping;
    };

    socketClose(ws) {
        try {
            const userSession = this.#userSessions.get(ws.vm_userId);
            typeof userSession.ws.get(ws.vm_wsId)?.terminate() === 'function' && userSession.ws.get(ws.vm_wsId)?.terminate();
            userSession.ws.delete(ws.vm_wsId);
            if (userSession.size < 1) this.#userSessions.delete(ws.vm_userId);
        } catch(err) {
            console.log(`   -   Socket close failed ${err.message ? err.message : err}   -   `);
        };
    };
}

export default UserSession;