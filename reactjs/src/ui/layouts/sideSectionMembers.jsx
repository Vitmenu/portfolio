import { useState }             from "react";
import { useNavigate }          from "react-router-dom";
import SideSectionWrapper       from "./sideSection";
import ProfileImage             from "../components/profileImage";
import SideSectionHeader        from "../components/sideSection/sideSectionHeader"; 
import * as svg                 from "../components/svgs";
import SpanText                 from "../components/spanText";
import ComponentLoading         from "../components/loading";
import ModalTab                 from "../components/modalTab";
import useItemInput             from "../../ux/hooks/useItemInput";
import { useGeneralContext }    from "../../ux/contexts/general.context";
import { extractSearchResults } from "../../ux/utils/extractor";

const SideSectionMemberItem = ({ member, startGroupChat, setStartGroupChat, search }) => {
    const {
        handleCreateNewConversation,
        handleEnterChat,
    }                                   = useGeneralContext();
    const { item, setItem, itemRef }    = useItemInput();
    const navigate                      = useNavigate();

    const handleClick = () => setItem(!item);
    const optionNum = 2;

    const handleClickStartNewChat = () => handleCreateNewConversation(member.id, (newConv) => {
        handleEnterChat(newConv);
        navigate('/chat');
    });

    return (
        <div ref={itemRef} className="flex justify-center items-center w-full h-16 px-4 py-1 noselect relative">
            <div style={item ? {
                    background: '#2563eb',
                    color: '#ffffff',
                } : {}}
                className={"rounded-md flex justify-between items-center w-full h-full px-4 py-3 hover:bg-gray-500 hover:text-white duration-75 cursor-pointer "}
                onClick={handleClick}
            >
                <div className="flex w-full justify-between items-center">
                    <div className="flex w-full items-center space-x-4">
                        <ProfileImage
                            image_key={member.image_key}
                            defaultSvg={svg.profile}
                        />
                        <div className="flex flex-col w-full h-full">
                            <span  style={{color: (search && search.prop == 'name') ? '#f87171' : ''}} className="text-md font-medium">
                                {member.name}
                            </span>
                        </div>
                    </div>
                    <div className="text-sm font-medium">
                        {member.company}
                    </div>
                </div>
            </div>
            {
                item && (
                    <ModalTab
                        parentRef={itemRef}
                        styles={{width: 'calc(100% - 2rem)', zIndex: 1, background: '#ffffff'}}
                        translateX={'0rem'}
                        translateY={itemRef.current.getBoundingClientRect().y + ((2 + 4 * optionNum) * 16) > window.innerHeight
                            ? `-${2 + 2 * optionNum}rem`
                            : `${2 + 2 * optionNum}rem`
                        }
                    >
                        <div onClick={handleClickStartNewChat} className="flex justify-start items-center w-full h-16 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75">
                            <SpanText dataLang={'nch'} />
                        </div>
                        <div onClick={() => setItem(false)} className="flex justify-start items-center w-full h-16 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75">
                            <SpanText dataLang={'cls'} />
                        </div>
                    </ModalTab>
                )
            }
        </div>
    );
};

const SideSectionMembers = () => {
    const {
        members,
    }                                           = useGeneralContext();
    const [startGroupChat, setStartGroupChat]   = useState(false); // [userId, ...userIds]

    const [searchInput, setSearchInput]         = useState('');

    const searchMap = members ? members.map(member => ({
            searchId: member.id,
            searchKeyword: member.name,
            searchedProp: 'name',
        })) : [];

    const searchResults = extractSearchResults(searchMap, searchInput, members);

    return (
        <SideSectionWrapper>
            <SideSectionHeader titleDataLang={'mbr'} icons={<></>} searchInput={searchInput} setSearchInput={setSearchInput} />
            <div className="space-y-2 overflow-scroll h-full">
                {
                    searchResults ? (
                        searchResults.length > 0 ? (
                            searchResults.map((member, id) => (
                                <SideSectionMemberItem
                                    key={id}
                                    member={member}
                                    startGroupChat={startGroupChat}
                                    setStartGroupChat={setStartGroupChat}
                                    search={member.search}
                                />
                            ))
                        ) : (
                            <div className="flex justify-center items-center w-full h-80 px-4 py-1">
                                <SpanText dataLang={'nf'}/>
                            </div>
                        )
                    ) : (
                        members ? (
                            members.length > 0 ? (
                                members.map((member, id) => (
                                    <SideSectionMemberItem
                                        key={id}
                                        member={member}
                                        startGroupChat={startGroupChat}
                                        setStartGroupChat={setStartGroupChat}
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
 
export default SideSectionMembers;