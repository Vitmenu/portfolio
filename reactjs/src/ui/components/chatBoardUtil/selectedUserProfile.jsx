import ProfileImage                     from "../profileImage";
import * as svg                         from "../svgs";

const ChatBoardSideMenuSelectedUserProfile = ({ thisUser, selectedUserProfile }) => {
    
    return (
        <div className="w-full h-24 flex justify-start items-center space-x-4 lg:space-x-6 p-6">
            <div className="flex flex-col h-full justify-start items-center">
                <ProfileImage isThisUser={(thisUser && thisUser.id === selectedUserProfile.id)} image_key={selectedUserProfile.image_key} defaultSvg={svg.profile} defaultClasses="w-12 h-12 "/>
            </div>
            <div className="flex flex-col h-full justify-center items-start">
                <div className="flex justify-start items-center w-full bg-slate text-lg font-medium lg:text-xl lg:font-semibold">
                    {selectedUserProfile.name}
                </div>
                <div className="flex justify-start items-center w-full bg-slate text-md font-normal lg:text-lg lg:font-medium">
                    {selectedUserProfile.company}
                </div>
            </div>
        </div>
    );
};

export default ChatBoardSideMenuSelectedUserProfile;