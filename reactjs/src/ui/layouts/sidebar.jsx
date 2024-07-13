import { useState, useEffect }                              from "react";
import AnimateSlide                                         from "../components/animateSlide";
import Tooltip                                              from "../components/tooltip";
import SidebarItem                                          from "../components/sidebar/sidebarItem";
import SidebarFooterItem                                    from "../components/sidebar/sidebarFooterItem";
import * as svg                                             from "../components/svgs";
import LoadingTextSkeleton                                  from "../components/loadingTextSkeleton";
import { useGeneralContext }                                from "../../ux/contexts/general.context";

const Sidebar = ({ sidebarClosed, setSidebarClosed }) => {
    const {
        thisUser,
    }                           = useGeneralContext();
    const [tooltip, setTooltip] = useState(true);

    const switchSidebar = () => {
        setTooltip(false);
        setSidebarClosed(!sidebarClosed)
    };
    const svgD = sidebarClosed ? {
        before: "M8, 12l0, 8, M8, 12l0, -8,",
        after: "M20, 12l-4, 8, M20, 12l-4, -8,",
    } : {
        before: "M8, 12l0, 8, M8, 12l0, -8,",
        after: "M4, 12l4, 8, M4, 12l4, -8,",
    };

    useEffect(() => {
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebarClosed) {
            sidebar.style.left = '-14.4rem';
            localStorage.setItem('sidebar-closed', 'true');
        } else {
            sidebar.style.left = '0';
            localStorage.removeItem('sidebar-closed');
        }
        return () => setTimeout(() => setTooltip(true), 1000);
    }, [sidebarClosed]);

    const sidebarClosedClasses = sidebarClosed ? 'left-[-14.4rem] absolute' : 'left-0 absolute lg:relative';
    return (
        <div data-sidebar className={"flex flex-col h-full w-[14.4rem] duration-150 ease-in divide-color border-r bg-color z-40 " + sidebarClosedClasses}>
            <div className="flex w-full h-[calc(100%-6rem)] flex-col relative ">
                <div className="
                    flex w-full px-[1.8rem] justify-start items-center
                    h-[8rem] py-[1.6rem] relative
                ">
                    <div className="text-xl font-semibold">
                        {
                            thisUser ? thisUser.company : <LoadingTextSkeleton />
                        }
                    </div>
                </div>
                <SidebarItem svg={svg.about} dataLang={'home'} linkTo={'/'} />
                {/* <SidebarItem svg={svg.tool} dataLang={'dvlg'} linkTo={'/devlog'} /> */}
                <SidebarItem svg={svg.message} dataLang={'cht'} linkTo={'/chat'} />
                <SidebarItem svg={svg.team} dataLang={'mbr'} linkTo={'/member'} />
                <SidebarItem svg={svg.setting} dataLang={'stg'} linkTo={'/setting'} />
            </div>
            <SidebarFooterItem />
            <div className="absolute flex flex-col h-full w-[16.75rem] justify-center items-end">
                <Tooltip ttStyles={{ opacity: tooltip ? '' : '0'}} svg={<AnimateSlide svgD={svgD} />} dataLang={sidebarClosed ? 'op' : 'cls'} onClick={switchSidebar}/>
            </div>
        </div>
    );
};

export default Sidebar;