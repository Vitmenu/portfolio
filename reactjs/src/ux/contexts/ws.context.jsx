import {
    createContext,
    useState,
    useContext,
    useEffect
}                   from 'react';
import {
    useGeneralContext
}                   from "./general.context";
import { 
    User, 
    Conv, 
    Mesg, 
    entityValidator, 
    MesgCheckedBy,
    ConvUsers
}                   from "../model/entities";
import localConsole from '../utils/localLog';
import env from "../env";

const WSContext = createContext();


// Used in chatBoardBottomLine.jsx  
export const emitWSTyping = () => {
    const custEvent = new CustomEvent('cust-ws-typing');
    dispatchEvent(custEvent);
};

// Used in chatBoardConversationSection.jsx && general.context.jsx
export const emitWSConvid = (option={currConvId, thisUser}) => {
    const custEvent = new CustomEvent('cust-ws-convid', {
        detail: {
            currConvId: option.currConvId,
            thisUser: option.thisUser,
        },
    });
    dispatchEvent(custEvent);
};

export const WSProvider = ({ children }) => {

    const [wsClientReadyState, setWsClientReadyState] = useState(3);
    const {
        receivingUser,
        receivingMesg,
        receivingConv,
        receivingMesgCheckedBy,
        receivingConvUser,
        receivingCurrConvMembers,
        handleCheckMessages,
    } = useGeneralContext();

    const startWsClient = (maxTry) => {
    if (maxTry > 0) {
        const wsConnUrl = window.location.hostname === 'localhost' ? 'ws://localhost:14001' : `wss://${env.siteUrl}`;
        const wsClient = new WebSocket(wsConnUrl);

        const onOpen = (e) => {
            maxTry = 5;
            setWsClientReadyState(wsClient.readyState);
        };

        const state = {
            // Used in app
            thisUser: null,
            isTypingTimeoutId: null,

            // To server
            isTyping: false,
            currConvId: null,
        };

        const onCustomIsTyping = (e) => {
            clearTimeout(state.isTypingTimeoutId);
            
            state.isTyping = true;
            state.currConvId && wsClient.send(JSON.stringify({type: 'typing', isTyping: true, currConvId: state.currConvId }));
            
            state.isTypingTimeoutId = setTimeout(() => {
                state.isTyping = false;
                state.currConvId && wsClient.send(JSON.stringify({type: 'typing', isTyping: false, currConvId: state.currConvId }));
            }, 450);

        };
        const onCustomConvs = (e) => {

            state.thisUser = e.detail.thisUser !== undefined ? e.detail.thisUser : state.thisUser;
            state.currConvId = e.detail.currConvId !== undefined ? e.detail.currConvId : state.currConvId;

            wsClient.send(JSON.stringify({type: 'convid', currConvId: state.currConvId }));
        };

        const onMessage = (e) => {
            try {
                const message = JSON.parse(e.data);

                if (message.type == "state" && message.stateName) {
                    /*
                        state update message = {
                            type: state,
                            stateName: state name,
                            state: state={},
                        }
                     */
                    switch(message.stateName) {
                        case 'currConvMembers':
                            receivingCurrConvMembers(message.state);
                            break;
                        default:
                            localConsole.log('Unknown message received!');
                    };

                } else {
                    const validatedEntity = entityValidator(message);
                    
                    switch(validatedEntity.constructor) {
                        case User:
                            receivingUser(validatedEntity);
                            break;
                        case Conv:
                            receivingConv(validatedEntity);
                            break;
                        case Mesg:
                            if (state.thisUser instanceof User && validatedEntity.conv_id == state.currConvId && validatedEntity.user_id !== state.thisUser.id) {
                                handleCheckMessages([validatedEntity]);
                            };
                            receivingMesg(validatedEntity);
                            break;
                        case MesgCheckedBy:
                            receivingMesgCheckedBy(validatedEntity);
                            break;
                        case ConvUsers:
                            receivingConvUser(validatedEntity);
                            break;
                        default:
                            localConsole.log('Unknown message received!');
                    };

                };
                
            } catch(err) {
                localConsole.log(`   -   WebScoket Client onMessage error: ${err.message ? err.message : err}   -   `);
            } finally {
                setWsClientReadyState(wsClient.readyState);
            };
        };
        const onError = (e) => setWsClientReadyState(wsClient.readyState);
        const onClose = (e) => {

            setWsClientReadyState(wsClient.readyState);

            if (e.code === 4002) {

            } else if (!e.wasClean || e.code === 1006) {

                window.removeEventListener('cust-ws-typing', onCustomIsTyping);
                window.removeEventListener('cust-ws-convid', onCustomConvs);
                wsClient.removeEventListener('open', onOpen);
                wsClient.removeEventListener('message', onMessage);
                wsClient.removeEventListener('error', onError);
                wsClient.removeEventListener('close', onClose);
                setTimeout(() => startWsClient(maxTry - 1), 2500);
            };
        };
        window.addEventListener('cust-ws-typing', onCustomIsTyping);
        window.addEventListener('cust-ws-convid', onCustomConvs);
        wsClient.addEventListener('open', onOpen);
        wsClient.addEventListener('message', onMessage);
        wsClient.addEventListener('error', onError);
        wsClient.addEventListener('close', onClose);
    };
};

    useEffect(() => {
        startWsClient(4);
    }, []);

    return (
        <WSContext.Provider value={{
            wsClientReadyState,
        }}>
            {children}
        </WSContext.Provider>
    );
};

export const useWebSocket = () => useContext(WSContext);