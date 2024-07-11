import { createContext, useState, useContext, useEffect } from 'react';
import retrieve                                           from '../utils/retrieve';
import { User, Conv, Mesg, MesgCheckedBy, ConvUsers }     from "../model/entities";
import { emitWSConvid }                                   from "./ws.context";
import localConsole from '../utils/localLog';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {

// --------------------------------- Lang ---------------------------------

    const [lang, setLang]                       = useState(localStorage.lang ? localStorage.lang : window.navigator.language.split('-')[0]);
    const [textList, setTextList]               = useState({});
    const [text, setText]                       = useState();

    const defaultText = {
        en: {
            err1: 'Sorry for the inconvenience.',
            err2: 'We just sent an email to the developer to fix this error.',
            err3: 'Please try again later.',
        },
        ko: {
            err1: '불편을 끼쳐드려 죄송합니다.',
            err2: '이 오류를 수정하기 위해 개발자에게 이메일을 보냈습니다.',
            err3: '나중에 다시 시도해 주세요.',
        },
        ja: {
            err1: 'ご不便をおかけして申し訳ありません。',
            err2: 'このエラーを修正するために開発者にメールを送信しました。',
            err3: '後で再試行してください。',
        },
    };

    const changeLang = (langCode) => setLang(langCode);
    const fetchLang = async (lang) => {
        localStorage.setItem('lang', lang);
        if (textList[lang]) {
            setText(textList[lang]);
        } else {
            const path = `/api/lang/get/${lang}`;
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            };
            await retrieve(path, options, async (res) => {
                if (res) {
                    const result = await res.json();
                    setText({...result, ...defaultText[lang]});
                    setTextList(prev => ({...prev, lang: {...result, ...defaultText[lang]}}));
                };
            });
        };
    };

    // Initial Loading
    useEffect(() => {
        fetchLang(lang);
    }, [lang]);

// --------------------------------- Lang ---------------------------------

// --------------------------------- Chat ---------------------------------

    
    // Stateless From Server
    const [thisUser, setThisUser]               = useState();
    const [mesgs, setMesgs]                     = useState();
    const [convs, setConvs]                     = useState();
    const [members, setMembers]                 = useState();
    const [convUsers, setConvUsers]             = useState();
    const [mesgCheckedBys, setMesgCheckedBys]   = useState();

    const returnSplit = (prev, part) => prev.filter(prevEle => part.findIndex(partEle => partEle.id == prevEle.id) < 0);
    const returnSplitByMultipleIds = (prev, part, ids) => prev.filter(prevEle => part.findIndex(partEle => (partEle[ids[0]] == prevEle[ids[0]] && partEle[ids[1]] == prevEle[ids[1]])) < 0);

    const returnMerged = (prev, later) => ([...returnSplit(prev, later), ...later])
    const returnMergedByMultipleIds = (prev, later, ids) => ([...returnSplitByMultipleIds(prev, later, ids), ...later])

    const updateThisUser      = (later) => setThisUser(prev => ({...prev, ...later}));
    
    const splitConvs          = (part) => setConvs(prev => returnSplit(prev, part));
    const splitMesgs          = (part) => setMesgs(prev => returnSplit(prev, part));
    const splitMembers        = (part) => setMembers(prev => returnSplit(prev, part));
    const splitConvUsers      = (part) => setConvUsers(returnSplitByMultipleIds(prev, part, ['user_id', 'conv_id']));
    const splitMesgCheckedBys = (part) => setMesgCheckedBys(returnSplitByMultipleIds(prev, part, ['user_id', 'mesg_id']));

    const mergeConvs          = (later) => setConvs(prev => returnMerged(prev, later));
    const mergeMesgs          = (later) => setMesgs(prev => returnMerged(prev, later));
    const mergeMembers        = (later) => setMembers(prev => returnMerged(prev, later));
    const mergeConvUsers      = (later) => setConvUsers(prev => returnMergedByMultipleIds(prev, later, ['user_id', 'conv_id']));
    const mergeMesgCheckedBys = (later) => setMesgCheckedBys(prev => returnMergedByMultipleIds(prev, later, ['user_id', 'mesg_id']));

    const fetchChatLoadAll = async () => {
        const path = `/api/chat/load/all/${lang}`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include',
        };
        await retrieve(path, options, async (res) => {
            if (res) {
                const result = await res.json();
                
                const newUser           = new User(result.user);
                const newMessages       = result.mesgs.map(mesg => new Mesg(mesg));
                const newMesgCheckedBys = result.mesgCheckedBys.map(mesgChecked => new MesgCheckedBy(mesgChecked));
                const newMembers        = result.members.map(user => new User(user));
                const newConvs          = result.convs.map(conv => new Conv(conv));
                const newConvUsers      = result.convUsers.map(convUser => new ConvUsers(convUser));
                
                setThisUser(newUser);
                setMesgs(newMessages);
                setMesgCheckedBys(newMesgCheckedBys);
                setMembers(newMembers);
                setConvs(newConvs);
                setConvUsers(newConvUsers);
            };
        });
    };

    // Stateful From Server
    const [currConvMembers, setCurrConvMembers] = useState({
        // userId: bool
    });

    // Initial Loading
    useEffect(() => {
        fetchChatLoadAll();
    }, []);

    // Stateful To Server
    const [currConv, setCurrConv]                       = useState();

    // State
    const [selectedUserProfile, setSelectedUserProfile] = useState();

// // --------------------------------- Chat: WebSocket Receivers ---------------------------------

    // Stateless
    const receivingUser          = (newUser) => mergeMembers([newUser])
    const receivingConv          = (newConv) => mergeConvs([newConv]);
    const receivingMesg          = (newMesg) => mergeMesgs([newMesg]);
    const receivingMesgCheckedBy = (newMesgCheckedBy) => mergeMesgCheckedBys([newMesgCheckedBy]);
    const receivingConvUser      = (newConvUser) => mergeConvUsers([newConvUser]);

    // Statefull
    const receivingCurrConvMembers = (newCurrConvMembers) => setCurrConvMembers(newCurrConvMembers);

// // --------------------------------- Chat: Handlers ---------------------------------
    
    const handleUpdateEntity = async (entity, goalEntity) => {
        if (entity !== 'conv' && entity !== 'user') console.log('Invalid entity');
        const path = `/api/chat/${entity}/update`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(goalEntity),
        };
        await retrieve(path, options, async (res) => {
            if (res) {
                switch(entity) {
                    case 'user':
                        const result = await res.json();
                        const updatedEntity = result[entity];
    
                        setThisUser(new User(updatedEntity));
                        break;
                    case 'conv':
                    case 'mesg':
                    default:
                        break;
                };
            };
        });
    };

    const handleExitConversation = async () => {
        setCurrConv();
        emitWSConvid({
            currConvId: null,
        });
    };
    
    const handleQuitConversation = async (quitConv) => {
        try {
            const targetConv = new Conv(quitConv);
            const path = `/api/chat/conv-users`;
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({conv: targetConv}),
            };
            await retrieve(path, options, async (res) => {
                if (res) {
                    splitConvs([targetConv]);
                    setCurrConv();
                    
                    emitWSConvid({
                        currConvId: null,
                    });   
                };
            });
        } catch(err) {
            return;
        };
    };
    const handleCheckMessages = async (unreadMesgs) => {
        const path = `/api/chat/mesg-checked-by`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({unreadMesgs}),
        };
        await retrieve(path, options);
    };
    const handleEnterChat = async (conv) => {
        try {
            const newConv = new Conv(conv);
            setCurrConv(newConv);

            const checkedMesgIds = mesgCheckedBys
                .filter(mesgCheckedBy => mesgCheckedBy.user_id == thisUser.id)
                .map(mesgCheckedBy => mesgCheckedBy.mesg_id);

            const unreadMesgs = mesgs
                .filter(mesg => mesg.conv_id == newConv.id)
                .filter(mesg => mesg.user_id !== thisUser.id)
                .filter(mesg => !checkedMesgIds.includes(mesg.id));

            if (unreadMesgs.length > 0) {
                const path = `/api/chat/mesg-checked-by`;
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({unreadMesgs}),
                };
                await retrieve(path, options);
            };
        } catch(err) {
            return;
        };
    };
    const handleSendMessage = async (convId, content) => {
        const path = `/api/chat/mesg/create`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ convId, content }),
        };
        await retrieve(path, options);
    };
    const handleCreateNewConversation = async (memberIdList, cb) => {
        const memberIds = Array.isArray(memberIdList) ? memberIdList : [memberIdList];
        const path = `/api/chat/conv/create`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ memberIds, lang }),
        };
        const receivedConv = await retrieve(path, options, async (res) => {
            if (res) {
                const result = await res.json();
                const receivedConv = new Conv(result.convs[0]);
                const receivedConvUsers = result.convUsers.map(convUser => new ConvUsers(convUser));
    
                mergeConvs([receivedConv]);
                mergeConvUsers(receivedConvUsers);
                setCurrConv(receivedConv);
                
                return receivedConv;
            };
        });

        typeof cb === 'function' && cb(receivedConv);

        return receivedConv;

    }; 

    const handleRemoveAll = async () => {
        localConsole.log('User clicked exit');
    };


    return (
        <GeneralContext.Provider value={{
            lang,
            text,
            changeLang,

            thisUser,
            mesgs,
            mesgCheckedBys,
            members,
            convs,
            convUsers,
            currConvMembers,

            currConv,
            selectedUserProfile,
            setSelectedUserProfile,
            
            
            handleUpdateEntity,
            handleExitConversation,
            handleQuitConversation,
            
            handleSendMessage,
            handleCreateNewConversation,
            handleCheckMessages,
            handleEnterChat,
            
            handleRemoveAll,
            
            receivingUser,
            receivingMesg,
            receivingConv,
            receivingMesgCheckedBy,
            receivingConvUser,
            receivingCurrConvMembers,

        }}>
            {children}
        </GeneralContext.Provider>
    );
};

export const useGeneralContext = () => useContext(GeneralContext);