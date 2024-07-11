import { useState, useEffect }          from "react";
import Tooltip                          from "../tooltip";
import TitleChangable                   from "../titleChangable";
import ProfileImage                     from "../profileImage";
import * as svg                         from "../svgs";

const ChatBoardSideMenuThisUserProfile = ({ thisUser, handleUpdateEntity }) => {

    const [username, setUsername]               = useState(thisUser && thisUser.name);
    const [changedUsername, setChangedUsername] = useState(thisUser && thisUser.name);

    useEffect(() => {
        setUsername(thisUser.name);
        setChangedUsername(thisUser.name);
    }, [thisUser]);

    const handleUpdateUsername = (changedTitle, title) => handleUpdateEntity('user', {...thisUser, name: changedTitle})

    return (
        <div className="w-full h-fit flex flex-col justify-start items-center space-y-2 p-4 2xl:space-y-6 2xl:p-6">
            <ProfileImage isThisUser={true} image_key={thisUser.image_key} defaultSvg={svg.profile} defaultClasses="w-[40rem] md:w-[80rem] h-20 md:h-24 "/>
            <TitleChangable
                title={username}
                setTitle={setUsername}
                changedTitle={changedUsername}
                setChangedTitle={setChangedUsername}
                handleUpdate={handleUpdateUsername}
                styles={{width: '100%', textAlign: 'center'}}
                classes={'flex justify-center items-center w-full h-14 text-xl font-semibold lg:text-2xl lg:font-bold'}
                nameboard={
                    <Tooltip
                        svg={changedUsername}
                        dataLang={'cun'}
                        svgStyles={{ width: '100%', height: '2.25rem', justifyContent: 'flex-start'}}
                    />
                }
            />
            <div className="flex justify-center items-start w-full lg:h-12 text-lg font-medium lg:text-xl lg:font-semibold">
                {thisUser.company}
            </div>
        </div>
    )
};

export default ChatBoardSideMenuThisUserProfile;