import { WebSocketServer }                      from 'ws';
import jwt                                      from 'jsonwebtoken';
import { v4 as uuidv4 }                         from 'uuid';
import extract                                  from '../http/utils/extract.js';
import userSession                              from '../session/session.config.js';
import env                                      from '../../config/env-initiator.js';
import pgdb                                     from '../pgdb/pgdb.config.js';

const startServer = (server) => {
    console.log(`    -    Portfolio ws server listening`);
    
    try {
        const wsServer = new WebSocketServer({ noServer: true });
        
        const handleServerUpgrade = (req, socket, head) => {
                    
            const sendUnauthorised = () => {
                socket.write(`HTTP/1.1 401 Unauthorized\r\n\r\n`);
                socket.destroy();
            };
            const onError = (err) => {
                socket.removeListener('error', onError);
                sendUnauthorised();
            };
            const handleUpgradeFailed = () => {
                socket.removeListener('error', onError);
                sendUnauthorised();
            };
            socket.on('error', onError);

            const issuedUserJWT = extract.cookie(req, 'user');
            try {
                
                const userJwt = jwt.verify(issuedUserJWT, env.jwt_signature_user);

                const jwtUsersSession = userSession.get(issuedUserJWT);

                if (jwtUsersSession && jwtUsersSession.ws.size > 3) {
                    
                    return handleUpgradeFailed()

                } else if (userJwt) {
                    return wsServer.handleUpgrade(req, socket, head, async (ws) => {
                        
                        ws.vm_company = env.companyList.get(userJwt.cid);

                        ws.vm_userId = ws.vm_company === 'Master' ? pgdb.masterUid : userJwt.uid;
                        ws.vm_wsId = uuidv4();
                        ws.vm_created = Date.now();

                        await userSession.set(ws);
                        wsServer.emit('connection', ws, req);
                    });
                } else {
                    return handleUpgradeFailed();
                };
            } catch(err) {
                return handleUpgradeFailed();
            };

        };
        const handleWSSConnection = (ws) => {
            // console.count(`    -    ${ws.vm_company} ${ws.vm_userId} ${ws.vm_wsId} connected    -    `);
            userSession.sessionHeartBeat(ws);

            const onMessage = (mesg) => {
                try {
                    const message = JSON.parse(mesg);
                    switch(message.type) {
                        case 'typing':
                            userSession.setIsTyping(ws.vm_userId, message.isTyping);
                            userSession.setcurrConvId(ws.vm_userId, message.currConvId);
                            break;
                        case 'convid':
                            userSession.setcurrConvId(ws.vm_userId, message.currConvId);
                            break;
                        default:
                            typeof ws.terminate === 'function' && ws.terminate();
                            userSession.socketClose(ws);
                    }

                } catch(err) {
                    typeof ws.terminate === 'function' && ws.terminate();
                    userSession.socketClose(ws);
                }
            };
            const onPong = () => userSession.sessionHeartBeat(ws);
            const onError = (err) => {
                console.log(`    -    Ws Instance Error ${err.message ? err.message : err}"   -   ws.vm_company: "${ws.vm_company}" ws.vm_userId: "${ws.vm_userId}" ws.vm_wsId: "${ws.vm_wsId}"`);
            };
            const onClose = () => {

                // console.count(`    -    ${ws.vm_company} ${ws.vm_userId} ${ws.vm_wsId} closed    -    `);

                ws.off('message', onMessage);
                ws.off('pong', onPong);
                ws.off('error', onError);
                ws.off('close', onClose);

                userSession.socketClose(ws);
            }; 
            
            ws.on('message', onMessage);
            ws.on('pong', onPong);
            ws.on('error', onError);
            ws.on('close', onClose);
            
        };
        const handleWSSError = (err) => console.log(`    -    Ws Server   error: "${err.message ? err.message : err}"    -    `);
        const handleWSSClose = () => {

            server.off('upgrade', handleServerUpgrade);
            wsServer.off('connection', handleWSSConnection);
            wsServer.off('error', handleWSSError);
            wsServer.off('close', handleWSSClose);

            startServer(server);
        };

        
        server.on('upgrade', handleServerUpgrade);
        wsServer.on('connection', handleWSSConnection);
        wsServer.on('error', handleWSSError);
        wsServer.on('close', handleWSSClose);

    } catch (err) {
        console.log(`   -   Error caught in ws.startServer "${err.message ? err.message : err}"`);
    };
};

export default { startServer };
