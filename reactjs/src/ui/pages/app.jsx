import { useState, useEffect }    from "react";
import { Outlet, useLocation }    from "react-router-dom";
import ChatBoard                  from "../layouts/chatBoard";
import Sidebar                    from "../layouts/sidebar";
import Tooltip                    from "../components/tooltip";
import * as svg                   from "../components/svgs";
import TooManyRequestsByGuestUser from "../components/bigmodal/tooManyRequestsByGuestUser";
import TooManyRequests            from "../components/bigmodal/tooManyRequests";
import Registration               from "../components/bigmodal/registration";
import ImageEditor                from "../components/bigmodal/imageEditor";
import { useGeneralContext }      from "../../ux/contexts/general.context";
import useItemInput               from "../../ux/hooks/useItemInput";

const App = () => {

    const currVersion = 'v-0.0.1';

    const [sidebarClosed, setSidebarClosed] = useState(localStorage.getItem('sidebar-closed'));
    const location                          = useLocation();
    const { thisUser } = useGeneralContext();
    
    useEffect(() => {
        try {
            window.innerWidth < 768 && setSidebarClosed(true);
            if (!sidebarClosed && location.pathname !== '/') {
                const sideSection = document.querySelectorAll('[data-side-section]');
                if (sideSection.length > 1) {
                    [...sideSection].forEach((section) => {
                        section.dataset.sideSection = "1";
                    });
                } else {
                    sideSection.dataset.sideSection = "1";
                };
            };
        } catch(err) {
            console.log(err);
        };
        
    }, [location]);
    

    const { item, setItem, itemRef } = useItemInput();
    const handleClickSwitchItem = () => setItem(!item);

    const [ modalImg, setModalImg ]         = useState();
    const [ registration, setRegistration ] = useState(true);

    const onCustomBigModal = (e) => setItem(e.detail.item);
    const onCustomImageModal = (e) => {
        setModalImg(e.detail.imgUrl);
        setItem('img');
    };
    const onCustomImageEditorModal = (e) => {
        setModalImg(e.detail.imgUrl);
        setItem('img-editor');
    };

    useEffect(() => {
        
        window.addEventListener('cust-big-modal', onCustomBigModal);
        window.addEventListener('cust-img-modal', onCustomImageModal);
        window.addEventListener('cust-img-editor-modal', onCustomImageEditorModal);

        return () => {
            window.removeEventListener('cust-big-modal', onCustomBigModal);
            window.removeEventListener('cust-img-modal', onCustomImageModal);
            window.removeEventListener('cust-img-editor-modal', onCustomImageEditorModal);
        };
        
    }, []);

    const sidebarClosedWrapperClasses = sidebarClosed ? 'w-full' : 'w-full lg:w-[calc(100%-14.4rem)]';

    const chatList = ['/chat', '/member', '/setting'];

    return (
        <div className="flex flex-row w-full h-full">
            <Sidebar sidebarClosed={sidebarClosed} setSidebarClosed={setSidebarClosed}/>
            <div className={"flex divide-x " + sidebarClosedWrapperClasses}>
                <Outlet context={{ sidebarClosed }}/>
                {chatList.includes(location.pathname) &&  <ChatBoard sidebarClosed={sidebarClosed} />}
            </div>
            {
                (registration && thisUser && localStorage.getItem('version') !== currVersion) && (
                    <Registration setItem={setRegistration} currVersion={currVersion}/>
                )
            }
            {
                (item === 'img' && modalImg) ? (
                    <div onClick={handleClickSwitchItem} className="absolute flex justify-center items-center backdrop-blur w-screen h-screen top-0 left-0 z-50">
                        <div className="absolute top-0 right-0 w-16 h-16 flex justify-center items-center">
                            <div className="w-6 h-6 cursor-pointer">
                                <Tooltip dataLang={"cls"} svg={svg.close} align="bottom"/>
                            </div>
                        </div>
                        <div className="w-full h-full md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3">
                            <img
                                src={modalImg}
                                alt={'modal image'}
                                className={"flex justify-center items-center w-full h-full object-contain"}
                            />
                        </div>
                    </div>
                ) : (item === 'img-editor') ? (
                    <ImageEditor img={modalImg} setImg={setModalImg} thisUser={thisUser} setItem={setItem} />
                ) : (item && thisUser) && (
                    thisUser.company.toLowerCase() == 'guest'
                    ? <TooManyRequestsByGuestUser item={item} setItem={setItem} />
                    : <TooManyRequests item={item} setItem={setItem} />
                )
            }
        </div>
    );
};
 
export default App;