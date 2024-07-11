import { useEffect, useState }                  from "react";
import * as svg                                 from "../svgs";
import ModalTab                                 from "../modalTab";
import SpanText                                 from "../spanText";
import Tooltip                                  from "../tooltip";
import ProfileImage                             from "../profileImage";
import TitleChangable                           from "../titleChangable";
import LoadingTextSkeleton                      from "../loadingTextSkeleton";
import SidebarModalItem                         from "../sidebar/sidebarModalItem";
import ChatBoardUtilMenuThisUserProfile         from "../chatBoardUtil/thisUserProfile";
import ChatBoardUtilSchedule                    from "../chatBoardUtil/schedule";
import ChatBoardUtilMenuSelectedUserProfile     from "../chatBoardUtil/selectedUserProfile";
import ChatBoardUtilPortfolioInfo               from "../chatBoardUtil/portfolioInfo";
import { useGeneralContext }                    from "../../../ux/contexts/general.context";
import { useWebSocket }                         from "../../../ux/contexts/ws.context";
import useItemInput                             from "../../../ux/hooks/useItemInput";

const ChatBoardNavbarUserList = ({ currConv }) => {
    const {
        thisUser,
        members,
        convUsers,
        selectedUserProfile,
        setSelectedUserProfile,
    }                                   = useGeneralContext();
    const { item, setItem, itemRef }    = useItemInput();

    const currConvUsers = convUsers.filter(convUser => convUser.conv_id == currConv.id).map(convUser => [thisUser, ...members].find(user => user.id == convUser.user_id));

    const handleSetItemThisUser = () => setItem(1);
    const handleSetItemMember = (user) => {
        setSelectedUserProfile(user);
        setItem(2);
    };

    return currConv && (
        <div ref={itemRef} style={{width: `${Math.min((currConvUsers.length + 1) * 1.25, 7 * 1.25)}rem`}} className="hidden xl:flex flex-row justify-start items-center h-full">
            {
                currConvUsers.map((user, id) => id < 6 && (
                    <ProfileImage
                        key={id}
                        onClick={() => handleSetItemMember(user)}
                        styles={{zIndex: currConvUsers.length - id, marginLeft: `${id * 1.15}rem`}}
                        classes={"absolute cursor-pointer "}
                        image_key={user.image_key}
                        defaultSvg={
                            <Tooltip svg={svg.profile} customTooltip={<div>{user.name}</div>} align="bottom"/>
                        }
                    />
                ))
            }
            <div style={{zIndex: 0, marginLeft: `${Math.min(currConvUsers.length * 1.15, 6 * 1.15)}rem`}} className="w-7 h-7 absolute bg-white rounded-full cursor-pointer hover:text-blue-600 duration-100 ease-out ">
                <Tooltip dataLang={'addm'} svg={svg.adduser} align="bottom" onClick={handleSetItemThisUser}/>
            </div>
            {
                item === 1 ? (
                    <ModalTab parentRef={itemRef} translateX={"-9.35rem"} styles={{width: '20rem'}}>
                        <div className="flex flex-col justify-start w-full h-fit whitespace-normal p-4 space-y-4">
                            <div className="font-semibold">
                                <SpanText dataLang={'addm'} />
                            </div>
                            <div className="font-light">
                                <SpanText dataLang={'prep'} />
                            </div>
                        </div>
                    </ModalTab>
                ) : (item === 2 && selectedUserProfile) && (
                    <ModalTab parentRef={itemRef} translateX={"-9.35rem"} styles={{width: '20rem'}} classes={"2xl:hidden"}>
                        <ChatBoardUtilMenuSelectedUserProfile thisUser={thisUser} selectedUserProfile={selectedUserProfile} />
                    </ModalTab>
                )
            }
        </div>
    );
};

const IconPingPong = ({ wsClientReadyState }) => {
    return (    
        <div className="w-6 h-6 flex justify-center items-center relative">
            <span style={{ backgroundColor:
                    wsClientReadyState === WebSocket.CONNECTING ? '#a3e635'
                    : wsClientReadyState === WebSocket.CLOSING ? '#fcd34d'
                    : wsClientReadyState === WebSocket.OPEN ? '#3b82f6'
                    : wsClientReadyState === WebSocket.CLOSED && '#f87171'
            }} className="animate-ping absolute inline-flex h-[0.875rem] w-[0.875rem] rounded-full opacity-75 duration-1000"></span>
            <span style={{ backgroundColor:
                    wsClientReadyState === WebSocket.CONNECTING ? '#84cc16'
                    : wsClientReadyState === WebSocket.CLOSING ? '#fbbf24'
                    : wsClientReadyState === WebSocket.OPEN ? '#2563eb'
                    : wsClientReadyState === WebSocket.CLOSED && '#ef4444'
            }} className="relative inline-flex rounded-full h-3 w-3"></span>
        </div>
    );
};

const ChatBoardNavbarConversationTitle = ({ currConv, handleUpdateEntity }) => {

    const [chatname, setChatname] = useState(currConv.name);
    const [changedChatname, setChangedChatname] = useState(chatname);

    useEffect(() => {
        setChangedChatname(currConv.name);
    }, [currConv]);

    const handleUpdateChatname = (changedTitle, title) => handleUpdateEntity('conv', {...currConv, name: changedTitle});

    return (
        <div className="mx-4 md:mx-8 w-1/2 h-full flex justify-start items-center">
            <TitleChangable 
                titleId={"currconv"}
                title={chatname}
                setTitle={setChatname}
                changedTitle={changedChatname}
                setChangedTitle={setChangedChatname}
                handleUpdate={handleUpdateChatname}
                styles={{width: '12rem'}}
                classes={'flex justify-center font-bold text-2xl'}
                nameboard={
                    <Tooltip
                        svg={changedChatname}
                        dataLang={'ccn'}
                        align="bottom"
                        parentStyles={{ width: '100%', height: '1.55rem', justifyContent: 'flex-start' }}
                        svgStyles={{ width: '100%', height: '1.55rem', justifyContent: 'flex-start' }}
                    />
                }
            />
        </div>
    );
};

const ChatBoardNavbarMore = ({ item, setItem, itemRef, thisUser, currConv, handleUpdateEntity, handleExitConversation, handleQuitConversation, }) => {

    const modalItemHeight = `4rem`;
    const [selected, setSelected]   = useState();

    const handleSelectChnageChatname    = () => {
        try {
            const dataTitleId = document.querySelector(`[data-title-id="currconv"]`);
            dataTitleId.click();
        } finally {
            setItem(false);
        };
    };
    const handleSelectThisUserProfile   = () => setSelected(1);
    const handleSelectPortfolioInfo     = () => setSelected(2);
    const handleSelectExitConversation  = () => {handleExitConversation(); setItem(false)};
    const handleSelectQuitConversation  = () => setSelected(3);
    const handleSetItemClose            = () => setItem(false);
    
    const handleSelectedGoback          = () => setSelected(false);

    return (
        <ModalTab parentRef={itemRef} styles={{width: window.innerWidth < 640 ? "calc(100% - 0.9rem)" : "24rem"}} classes={"2xl:hidden"}>
            {
                selected === 1 ? (
                    <>
                        <ChatBoardUtilMenuThisUserProfile thisUser={thisUser} handleUpdateEntity={handleUpdateEntity} />
                        <SidebarModalItem onClick={handleSelectedGoback} dataLang={'gb'} svg={svg.goback} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSetItemClose} dataLang={'cls'} svg={svg.close} styles={{width: '100%', height: modalItemHeight}}/>
                    </>
                ) : selected === 2 ? (
                    <>
                        <ChatBoardUtilPortfolioInfo />
                        <SidebarModalItem onClick={handleSelectedGoback} dataLang={'gb'} svg={svg.goback} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSetItemClose} dataLang={'cls'} svg={svg.close} styles={{width: '100%', height: modalItemHeight}}/>
                    </>
                ) : selected === 3 ? (
                    <>
                        <SidebarModalItem onClick={() => handleQuitConversation(currConv)} dataLang={'cquit'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSelectedGoback} dataLang={'gb'} svg={svg.goback} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSetItemClose} dataLang={'cls'} svg={svg.close} styles={{width: '100%', height: modalItemHeight}}/>
                    </>
                ) : (
                    <>
                        <SidebarModalItem onClick={handleSelectChnageChatname} dataLang={'ccn'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSelectThisUserProfile} dataLang={'tup'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSelectPortfolioInfo} dataLang={'vinf'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSelectQuitConversation} dataLang={'cquit'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSelectExitConversation} dataLang={'exit'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={handleSetItemClose} dataLang={'cls'} svg={svg.close} styles={{width: '100%', height: modalItemHeight}}/>
                    </>
                )
            }
        </ModalTab>
    )
};

const ChatBoardNavbar = () => {
    const {
        currConv,
        thisUser,
        handleUpdateEntity,
        handleExitConversation,
        handleQuitConversation,
    }                               = useGeneralContext();
    const { wsClientReadyState }    = useWebSocket();
    const { item, setItem, itemRef} = useItemInput();

    return (
        <div className="w-full h-[6.4rem] flex justify-between items-center truncate">
            {
                !currConv && (
                    <div className="mx-6 w-full h-full flex flex-row justify-start items-center space-x-6 font-bold text-2xl">
                        {
                            thisUser ? thisUser.company : <LoadingTextSkeleton classes={"flex items-center w-24 h-4 "} />
                        }
                    </div>
                )
            }
            {
                currConv && (
                    <>
                        <ChatBoardNavbarConversationTitle currConv={currConv} handleUpdateEntity={handleUpdateEntity} />
                        <div ref={itemRef} className="mx-4 md:mx-8 w-fit h-full flex flex-row justify-end items-center space-x-6">
                            <ChatBoardNavbarUserList currConv={currConv} />
                            <Tooltip 
                                dataLang="csts"
                                svgClasses={'hover:text-blue-500 cursor-pointer duration-150'}
                                ttStyles={{transform: 'translate(-2rem, 2.25rem)'}}
                                parentStyles={{width: '1.75rem', height: '1.75rem'}}
                                svg={<IconPingPong wsClientReadyState={wsClientReadyState}/>}
                                align="bottom"
                            />
                            <Tooltip
                                dataLang="cld"
                                onClick={() => setItem('calendar')}
                                svgClasses={'hover:text-blue-500 cursor-pointer duration-150'}
                                ttStyles={{transform: 'translate(-2rem, 2.25rem)'}}
                                parentStyles={{width: '1.75rem', height: '1.75rem'}}
                                parentClasses={'hidden md:flex 2xl:hidden'}
                                svg={svg.calendar}
                                align="bottom"
                            />
                            <Tooltip
                                dataLang="mr"
                                onClick={() => setItem('more')}
                                svgClasses={'hover:text-blue-500 cursor-pointer duration-150'}
                                parentStyles={{width: '1.75rem', height: '1.75rem'}}
                                parentClasses={'flex 2xl:hidden'}
                                svg={svg.dotsC}
                                align="bottom"
                            />
                            {
                                item === 'calendar' ? (
                                    <ModalTab parentRef={itemRef} styles={{width: window.innerWidth < 640 ? "calc(100% - 0.9rem)" : "24rem"}} classes={"2xl:hidden"}>
                                        <ChatBoardUtilSchedule />
                                    </ModalTab>
                                ) : item === 'more' && (
                                    <ChatBoardNavbarMore setItem={setItem} itemRef={itemRef} thisUser={thisUser} currConv={currConv} handleUpdateEntity={handleUpdateEntity} handleExitConversation={handleExitConversation} handleQuitConversation={handleQuitConversation} />
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default ChatBoardNavbar;