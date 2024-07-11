import { useRef, useEffect } from "react";
import { useLocation }       from "react-router-dom";
import SpanText              from "../spanText";
import * as svg              from "../svgs";
import TypingBubble          from "../typeingBubble";
import { extractTime }       from "../../../ux/utils/extractTime";
import { useGeneralContext } from "../../../ux/contexts/general.context";
import { emitWSConvid }      from "../../../ux/contexts/ws.context";
import useItemInput          from "../../../ux/hooks/useItemInput";

const Message = ({ id, thisUser, mesg, members, setSelectedUserProfile, prevMesg, mesgCheckedBys}) => {
    const location = useLocation();
    const { item, setItem, itemRef } = useItemInput();

    const currentDate = new Date(parseInt(mesg.created)).toDateString();
    const prevDate = id > 0 ? new Date(parseInt(prevMesg.created)).toDateString() : null;

    const isMyMesg = thisUser.id === mesg.user_id;
    const isSameSender = prevMesg && prevMesg.user_id === mesg.user_id;
    const isSentWithin1Minutes = prevMesg && parseInt(mesg.created) - parseInt(prevMesg.created) < 1000 * 60 * 1;

    const sender = members.find(member => member.id == mesg.user_id);
    const handleClickMenu = () => setItem(!item);

    return (
        <>
            {
                (id === 0 || currentDate !== prevDate) &&
                <div className="flex items-center w-full justify-center mt-4">
                    <span className="px-2 text-sm text-gray-500">{currentDate}</span>
                </div>
            }
            <div style={{justifyContent: isMyMesg ? 'flex-end' : 'flex-start'}} className="w-full h-auto flex flex-row px-6 font-geologica group">
                <div style={{alignItems: isMyMesg ? 'flex-end' : 'flex-start', width: location.pathname !== '/' ? '66.666667%' : '100%'}} className="flex flex-col items-start h-full space-y-2">
                    {
                        !(isSameSender && isSentWithin1Minutes) &&
                        <div style={{flexDirection: isMyMesg ? 'row-reverse' : 'row'}} className="flex w-fit mt-4">
                            <div className="text-lg font-medium hover:text-blue-500 duration-150 cursor-pointer truncate" onClick={() => setSelectedUserProfile(sender)}>
                                {
                                    sender
                                        ? sender.name
                                        : <SpanText dataLang={'ukn'}/>
                                }
                            </div>
                            <div className="text-xs mx-4 h-full flex items-center mt-[0.125rem]">
                                {extractTime(mesg.created)}
                            </div>
                            {
                                (isMyMesg && mesgCheckedBys.length > 0) &&
                                <div className="text-xs h-full flex items-center mt-1">
                                    <SpanText dataLang={'chd'} />&nbsp;{mesgCheckedBys.length}
                                </div>
                            }
                            <div ref={itemRef} className="h-full flex justify-center items-center mt-[0.125rem] w-6 relative text-sm">
                                <div onClick={handleClickMenu} style={{opacity: item ? '1' : ''}} className="w-6 h-6 flex justify-center items-center cursor-pointer opacity-0 group-hover:opacity-100 duration-75 hover:bg-slate-100 rounded-full">
                                    <div className="flex justify-center items-center w-4 h-4">
                                        {svg.dots}
                                    </div>
                                </div>
                                {
                                    item && (
                                        <div style={{right: isMyMesg ? '0' : '', left: isMyMesg ? '' : '0'}} className="absolute bg-gray-200 z-10 w-min shadow rounded flex flex-col -translate-y-8 bottom-0">
                                            <div className="whitespace-nowrap flex items-center cursor-pointer hover:bg-gray-100 px-3 py-1">
                                                reply
                                            </div>
                                            <div className="whitespace-nowrap flex items-center cursor-pointer hover:bg-gray-100 px-3 py-1">
                                                close
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    }
                    <div style={{background: isMyMesg ? '#3b82f6' : '#e5e7eb', color: isMyMesg ? '#ffffff' : '#1f2937'}} className="flex text-md font-light rounded-md px-4 py-2">
                        {mesg.content}
                    </div>
                </div>
            </div>
        </>
    );
};

const BubbleMessage = () => {

    return (
        <div className="w-full h-full flex items-end">
            <div className="w-full h-auto flex justify-start flex-row px-6 font-geologica">
                <div className="flex flex-col flex-start items-start w-24 h-full space-y-2">
                    <div className="h-10 flex items-center text-md font-light rounded-md px-4 py-2 bg-gray-200 text-gray-800 space-x-2">
                        <TypingBubble uid={"123"}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

const isSomebodyElseTyping = (thisUser, currConvMembers) => {
    for (let [userId, val] of Object.entries(currConvMembers)) {
        if (userId !== thisUser.id && val) {
            return true;
        }
    };
    return false;
};

const ChatBoardConversationSection = () => {
    const {
        thisUser,
        mesgs,
        mesgCheckedBys,
        members,
        // convUsers,
        convs,
        currConv,
        setSelectedUserProfile,
        currConvMembers,
    }                       = useGeneralContext();
    const containerRef      = useRef();

    useEffect(() => {
        if (currConv) {
            const dataMessageBar = document.querySelector('[data-message-bar]');
            dataMessageBar.focus();
            
            emitWSConvid({
                currConvId: currConv.id, 
                thisUser: thisUser,
            });
            
        };
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        };
    }, [currConv]);
    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        };
    }, [mesgs, currConvMembers]);
    
    const currConvMesgs = mesgs && mesgs.filter(mesg => mesg.conv_id === currConv?.id).sort((a, b) => a.created - b.created);
    
    return (
        <div ref={containerRef} className="w-full h-full flex flex-col overflow-y-scroll space-y-2">
            {
                (thisUser && currConvMesgs && currConvMesgs.length > 0)
                    ? currConvMesgs.map((mesg, id) => (
                        <Message
                            key={id}
                            id={id}
                            thisUser={thisUser}
                            mesg={mesg}
                            members={[...members, thisUser]}
                            mesgCheckedBys={mesgCheckedBys.filter(mesgCheckedBy => mesgCheckedBy.mesg_id == mesg.id)}
                            setSelectedUserProfile={setSelectedUserProfile}
                            prevMesg={currConvMesgs[id - 1]}
                        />
                    )) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <span className="text-lg font-normal mx-6">
                                <SpanText dataLang={'itrC'}/>
                            </span>
                        </div>
                    )
            }
            {
                isSomebodyElseTyping(thisUser, currConvMembers) && <BubbleMessage />
            }
        </div>
    );
};

export default ChatBoardConversationSection;