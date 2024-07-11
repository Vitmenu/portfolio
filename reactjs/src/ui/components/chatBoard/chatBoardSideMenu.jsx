import Loading                                  from "../loading";
import ChatBoardUtilThisUserProfile             from "../chatBoardUtil/thisUserProfile";
import ChatBoardUtilSchedule                    from "../chatBoardUtil/schedule";
import ChatBoardUtilSelectedUserProfile         from "../chatBoardUtil/selectedUserProfile";
import ChatBoardPortfolioInfo                   from "../chatBoardUtil/portfolioInfo";
import { useGeneralContext }                    from "../../../ux/contexts/general.context";

const ChatBoardSideMenu = () => {
    const {
        thisUser,
        currConv,
        selectedUserProfile,
        handleUpdateEntity,
    }                                           = useGeneralContext();

    return (
        <div className="hidden 2xl:flex flex-col 2xl:w-[22rem] divide-y overflow-y-scroll">
            {
                thisUser ? (
                    <ChatBoardUtilThisUserProfile thisUser={thisUser} handleUpdateEntity={handleUpdateEntity} />
                ) : (
                    <Loading classes="flex w-full h-full justify-center items-center" />
                )
            }
            {
                currConv && <ChatBoardUtilSchedule />
            }
            {
                selectedUserProfile && <ChatBoardUtilSelectedUserProfile thisUser={thisUser} selectedUserProfile={selectedUserProfile} />
            }
            <ChatBoardPortfolioInfo />
        </div>
    );
};

export default ChatBoardSideMenu;