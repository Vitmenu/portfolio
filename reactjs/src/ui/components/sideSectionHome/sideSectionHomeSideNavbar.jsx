import {
    useState,
}                              from "react";
import * as svg                from "../svgs"
import Tooltip                 from "../tooltip";
import ChatBoardBottomLine     from "../chatBoard/chatBoardBottomLine";
import ChatBoardMessageSection from "../chatBoard/chatBoardMessageSection";

import SideSectionHomeSideNavbarItems        from "./sideSectionHomeSideNavbarItems";
import SideSectionHomeSideNavbarAskDeveloper from "./sideSectionHomeSideNavbarAskDeveloper";
import SideSectionHomeSideNavbarSendEmail    from "./sideSectionHomeSideNavbarSendEmail";
import SideSectionHomeSideNavbarLinks        from "./sideSectionHomeSideNavbarLinks";

import { useGeneralContext }   from "../../../ux/contexts/general.context";

const SideSectionHomeSideNavbar = ({ biographRef, scrollToSection }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const {
        handleCreateNewConversation,
        handleSendMessage,
    } = useGeneralContext();

    const handleSwitchChat = async (message) => {
        if (isChatOpen) {
            setIsChatOpen(false);
        } else {
            const targetConv = await handleCreateNewConversation([]);
            await handleSendMessage(targetConv.id, message);
            setIsChatOpen(true);
        };
    };

    return (
        <div className="hidden w-0 md:flex md:w-[20rem] h-full border-l divide-color bg-color divide-x overflow-y-scroll">
            {
                !isChatOpen && (
                    <div className="flex flex-col w-full justify-start items-end space-y-4">
                        <div className="pt-8 px-8 w-1/2 h-fit flex text-2xl font-medium justify-start">
                            VitDev
                        </div>
                        <SideSectionHomeSideNavbarItems biographRef={biographRef} scrollToSection={scrollToSection} />
                        <SideSectionHomeSideNavbarAskDeveloper handleSwitchChat={handleSwitchChat} />
                        <SideSectionHomeSideNavbarSendEmail />
                        <SideSectionHomeSideNavbarLinks />
                    </div>
                )
            }
            {
                isChatOpen && (
                    <div className={"hidden md:flex flex-col h-full w-0 md:w-full justify-between divide-y relative"}>
                        <div className="w-full h-[6.4rem] flex justify-between items-center truncate">
                            <div className="mx-6 w-full h-full flex flex-row justify-start items-center space-x-6 font-normal text-sm">
                                <Tooltip dataLang={'gb'} svg={svg.goback} onClick={handleSwitchChat} svgClasses="w-6 h-6" align="bottom" />
                            </div>
                            <div className="mx-6 w-full h-full flex flex-row justify-end items-center space-x-6 font-bold text-2xl">
                                Ask Juyeon
                            </div>
                        </div>
                        <div className="flex flex-col-reverse w-full h-[calc(100%-6.4rem)] overflow-scroll">
                            <ChatBoardBottomLine />
                            <ChatBoardMessageSection />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SideSectionHomeSideNavbar;