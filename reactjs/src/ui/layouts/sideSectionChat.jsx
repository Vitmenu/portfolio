import { useState }             from "react";
import { useNavigate }          from "react-router-dom";
import SideSectionWrapper       from "./sideSection";
import ProfileImage             from "../components/profileImage";
import * as svg                 from "../components/svgs";
import ComponentLoading         from "../components/loading";
import Tooltip                  from "../components/tooltip";
import SpanText                 from "../components/spanText";
// import TypingBubble             from "../components/typeingBubble";
import SideSectionHeader        from "../components/sideSection/sideSectionHeader"; 
import { getTimeAgo }           from "../../ux/utils/extractTime";
import { extractSearchResults } from "../../ux/utils/extractor";
import { Conv }                 from "../../ux/model/entities";
import { useGeneralContext }    from "../../ux/contexts/general.context";

const SideSectionChatItem = ({ thisUser, conv, mesgs, mesgCheckedBys, currConv, handleEnterChat, search}) => {

    const isCurrConv = currConv && conv.id == currConv.id;
    const mesgSorted = mesgs.filter(mesg => mesg.conv_id == conv.id).sort((a, b) => a.created - b.created);
    const latestMesg = mesgSorted[mesgSorted.length - 1];
    const uncheckeds = mesgSorted.filter(mesg => (
        mesg.user_id !== thisUser.id &&
        mesgCheckedBys.findIndex(mesgCheckedBy => (
            mesgCheckedBy.user_id == thisUser.id &&
            mesgCheckedBy.mesg_id == mesg.id
        )) < 0
    )).length;

    const handleClick = () => {
        const enteredConv = new Conv(conv);
        handleEnterChat(enteredConv);
    };
    
    return (
        <div className="flex justify-center items-center w-full h-16 px-4 py-1 cursor-pointer noselect" onClick={handleClick}>
            <div style={{
                background: isCurrConv ? '#2563eb' : '',
                color: isCurrConv ? '#f9fafb' : '',
            }} className={isCurrConv
                ? "rounded-md flex justify-between items-center w-full h-full px-4 py-3"
                : "rounded-md flex justify-between items-center w-full h-full px-4 py-3 hover:bg-gray-500 hover:text-white duration-0"
            }>
                <div className="flex w-full justify-between items-center space-x-1 md:space-x-4">
                    <ProfileImage
                        image_key={conv.image_key}
                        defaultSvg={svg.icons}
                    />
                    <div className="flex flex-col w-[calc(100%-3rem)] h-full">
                        <span style={{color: (search && search.prop == 'name') ? '#f87171' : ''}} className="text-md font-medium">
                            {conv.name}
                        </span>
                        <div className="flex justify-between text-xs font-normal w-full">
                            <div className="text-left w-2/3 truncate">
                                {
                                    latestMesg
                                        ? (
                                            (search && search.prop == 'content')? (
                                                <span className="text-red-400">
                                                    {search.keyword}
                                                </span>
                                            ) : (
                                                <span className="flex space-x-2 items-end">
                                                    {
                                                        uncheckeds > 0 && 
                                                        <span className="text-red-500 mr-2">
                                                            new +{uncheckeds}
                                                        </span>
                                                    }
                                                    {latestMesg.content}
                                                    {/* <TypingBubble uid={"315afe"} classes="w-[0.4375rem] h-[0.4375rem] mt-1 rounded-full bg-gray-400"/> */}
                                                </span>
                                            )
                                        )
                                        : <SpanText dataLang={'empt'} />
                                }
                            </div>
                            <div className="text-right w-1/3 truncate">
                                {getTimeAgo(latestMesg ? latestMesg.created : conv.created)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SideSectionChat = () => {
    const {

        thisUser,
        mesgs,
        mesgCheckedBys,
        convs,
        
        currConv,
        handleEnterChat,
    }                               = useGeneralContext();
    const navigate                  = useNavigate();
    const handleClickNewChat        = () => navigate('/member');

    const [searchInput, setSearchInput] = useState('');

    const searchMap = (convs && mesgs) ? [
        ...convs.map(conv => ({
            searchId: conv.id,
            searchKeyword: conv.name,
            searchedProp: 'name',
        })),
        ...mesgs.map(mesg => ({
            searchId: mesg.conv_id,
            searchKeyword: mesg.content,
            searchedProp: 'content',
        })),
    ] : [];

    const sortbyLastMesg = (a, b) => {
        const aLastMessage = mesgs.filter(msg => msg.conv_id === a.id).sort((a, b) => b.created - a.created)[0];
        const bLastMessage = mesgs.filter(msg => msg.conv_id === b.id).sort((a, b) => b.created - a.created)[0];

        if (!aLastMessage && bLastMessage) return bLastMessage.created - a.created;
        if (aLastMessage && !bLastMessage) return b.created - aLastMessage.created;
        if (!aLastMessage && !bLastMessage) return 0;

        return bLastMessage.created - aLastMessage.created;
    };

    const searchResults = extractSearchResults(searchMap, searchInput, convs);

    return (
        <SideSectionWrapper>
            <SideSectionHeader
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                titleDataLang={'cht'}
                icons={<>
                    <div className="hidden md:flex">New Chat</div>
                    <Tooltip
                        svg={svg.plus}
                        dataLang={'nch'}
                        svgStyles={{width: '1.5rem', height: '1.5rem'}}
                        align="bottom"
                        onClick={handleClickNewChat}
                    />
                </>}
            />
            <div className="space-y-2 overflow-scroll">
                {
                    searchResults ? (
                        searchResults.length > 0 ? (
                            searchResults.sort(sortbyLastMesg).map((conv, id) => (
                                <SideSectionChatItem
                                    key={id}
                                    thisUser={thisUser}
                                    conv={conv}
                                    mesgs={mesgs}
                                    mesgCheckedBys={mesgCheckedBys}
                                    currConv={currConv}
                                    handleEnterChat={handleEnterChat}
                                    search={conv.search}
                                />
                            ))
                        ) : (
                            <div className="flex justify-center items-center w-full h-80 px-4 py-1">
                                <SpanText dataLang={'nf'}/>
                            </div>
                        )
                    ) : (
                        convs ? (
                            convs.length > 0 ? (
                                convs.sort(sortbyLastMesg).map((conv, id) => (
                                    <SideSectionChatItem
                                        key={id}
                                        thisUser={thisUser}
                                        conv={conv}
                                        mesgs={mesgs}
                                        mesgCheckedBys={mesgCheckedBys}
                                        currConv={currConv}
                                        handleEnterChat={handleEnterChat}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center w-full h-80 px-4 py-1">
                                    <SpanText dataLang={'empt'} />
                                </div>
                            )
                        ) : (
                            <ComponentLoading />
                        )
                    )
                }
            </div>
        </SideSectionWrapper>
    );
}
 
export default SideSectionChat;