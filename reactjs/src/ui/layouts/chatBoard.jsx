import ChatBoardSideMenu    from "../components/chatBoard/chatBoardSideMenu";
import ChatBoardChatSection from "../components/chatBoard/chatBoardChatSection";

const ChatBoard = ({ sidebarClosed }) => {

    const sidebarClosedClasses = sidebarClosed ? 'w-full md:w-[calc(100%-22rem)] lg:w-[calc(100%-36.4rem)]' : 'w-full md:w-[calc(100%-22rem)]';

    return (
        <div className={"flex h-full divide-color bg-color divide-x " + sidebarClosedClasses}>
            <ChatBoardChatSection />
            <ChatBoardSideMenu />
        </div>
    );
};

export default ChatBoard;