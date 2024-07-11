import { useEffect, useState } from "react";
import SidebarModalItem        from "./sidebarModalItem";
import * as svg                from "../svgs";
import ProfileImage            from "../profileImage";
import Tooltip                 from "../tooltip";
import ModalTab                from "../modalTab";
import TitleChangable          from "../titleChangable";
import Loading                 from "../loading";
import useItemInput            from "../../../ux/hooks/useItemInput";
import useGetMedia             from "../../../ux/hooks/useGetMedia";
import { imgEditorModal }      from "../../../ux/events/cust-event";
import { useGeneralContext }   from "../../../ux/contexts/general.context";

const SidebarUserProfile = ({ titleId, parentItem, setParentItem, thisUser, handleUpdateEntity }) => {

    const [username, setUsername]               = useState();
    const [changedUsername, setChangedUsername] = useState();

    useEffect(() => {
        setUsername(thisUser.name);
        setChangedUsername(thisUser.name);
    }, [thisUser]);

    const handleUpdateUsername = (changedTitle, title) => handleUpdateEntity('user', {...thisUser, name: changedTitle})

    return (
        <div className="basis-4/5 h-full flex justify-start items-center space-x-4 font-normal">
            <div className="w-7 h-7 min-w-7 rounded-full bg-white text-black flex justify-start">
                <Tooltip
                    svg={(
                        <ProfileImage
                            isThisUser={true}
                            image_key={thisUser.image_key}
                            defaultSvg={svg.profile}
                        />
                    )}
                    dataLang={'prfp'}
                    ttStyles={{ opacity: parentItem ? '0' : '', zIndex: parentItem ? '-10' : '1', transform: 'translate(2rem, -2.25rem)'}}
                    svgStyles={{ width: '1.55rem', height: '1.55rem'}}
                />
            </div>
            <TitleChangable
                title={username}
                titleId={titleId}
                setTitle={setUsername}
                changedTitle={changedUsername}
                setChangedTitle={setChangedUsername}
                onClick={() => setParentItem(false)}
                handleUpdate={handleUpdateUsername}
                nameboard={
                    <Tooltip
                        svg={changedUsername}
                        dataLang={'cun'}
                        ttStyles={{ opacity: parentItem ? '0' : '', zIndex: parentItem ? '-10' : '1'}}
                        svgStyles={{ width: '100%', height: '1.55rem', justifyContent: 'flex-start'}}
                    />
                }
            />
        </div>
    );
};

const SidebarFooterItem = () => {
    const { item, setItem, itemRef }    = useItemInput();

    const {
        thisUser,
        handleUpdateEntity,
        handleRemoveAll,
    }                                   = useGeneralContext();

    const { media } = useGetMedia({
        objKey: thisUser?.image_key,
        dependencies: [thisUser],
    });
    
    const modalItemHeight = `2.4rem`;
    const modalTabTranslateY = (n) => `calc(-${modalItemHeight} * 0.8 * ${n})`;

    const titleId = "thisUserName";

    const onClickSetItem = () => setItem(!item);
    const onClickChangeUsername = () => {
        try {
            const dataTitleId = document.querySelector(`[data-title-id="${titleId}"]`);
            dataTitleId.click();
        } finally {
            setItem(false);
        };
    };
    const onClickChangeProfilePhoto = () => {
        imgEditorModal({ media });
        setItem(false);
    };
    const onClickExit = () => handleRemoveAll();

    return (
        <div ref={itemRef} className="flex w-full h-[6rem] flex-row justify-between items-center px-[1.8rem] relative ">
            {
                thisUser ? (
                    <SidebarUserProfile titleId={titleId} parentItem={item} setParentItem={setItem} thisUser={thisUser} handleUpdateEntity={handleUpdateEntity}/>
                ) : (
                    <Loading classes="flex w-full h-full justify-center items-center" />
                )
            }
            <div className="basis-1/5 font-light hover:text-blue-400" >
                <Tooltip svg={svg.dots} dataLang={'mr'} onClick={onClickSetItem} ttStyles={{ opacity: item ? '0' : '', zIndex: item ? '-10' : '1' }} svgStyles={{ width: '', height: '1.25rem', color: item ? '#60a5fa' : ''}} />
            </div>
            {
                item && (
                    <ModalTab parentRef={itemRef} translateX={"-1.35rem"} translateY={modalTabTranslateY(4)} styles={{width: 'calc(100% - 0.9rem)'}}>
                        <SidebarModalItem onClick={onClickExit} dataLang={'exit'} svg={svg.exit} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={onClickChangeUsername} dataLang={'cun'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={onClickChangeProfilePhoto} dataLang={'prfp'} styles={{width: '100%', height: modalItemHeight}}/>
                        <SidebarModalItem onClick={onClickSetItem} dataLang={'cls'} svg={svg.close} styles={{width: '100%', height: modalItemHeight}}/>
                    </ModalTab>
                )
            }
        </div>
    );
};

export default SidebarFooterItem