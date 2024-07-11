import { NavLink }                          from "react-router-dom";
import SpanText                             from "../spanText";

const SidebarItem = ({ svg, dataLang, linkTo }) => {
    return (
        <NavLink to={linkTo} style={{zIndex: '1'}} className={({ isActive, isPending }) =>
             isPending ? "text-blue-400"
            : isActive ? "text-blue-500"
                       : "hover:text-blue-400 duration-100"
            }>
            <div className="
                flex w-full px-[1.8rem] justify-start items-center
                h-[4rem] space-x-4
                ">
                <div className="w-6 h-6">
                    {svg}
                </div>
                <SpanText dataLang={dataLang} classes={"font-normal"}/>
            </div>
        </NavLink>
    );
};

export default SidebarItem;