import ChatBoardNavbar         from "./chatBoardNavbar";
import ChatBoardBottomLine     from "./chatBoardBottomLine";
import ChatBoardMessageSection from "./chatBoardMessageSection";

const ChatBoardChatSection = ({classes="flex flex-col h-full w-full 2xl:w-[calc(100%-22rem)] justify-between divide-y relative"}) => {
    return (
        <div className={classes}>
            <ChatBoardNavbar />
            <div className="flex flex-col-reverse w-full h-[calc(100%-6.4rem)] overflow-scroll">
                <ChatBoardBottomLine />
                <ChatBoardMessageSection />
            </div>
        </div>
    );
};

export default ChatBoardChatSection;