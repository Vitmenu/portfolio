import { useOutletContext } from "react-router-dom";

const SideSectionWrapper = ({ children }) => {
    const { sidebarClosed }                     = useOutletContext();

    const sidebarClosedClasses = sidebarClosed ? 'lg:w-[36.4rem]' : '';
    return (
        <div data-side-section="0" className={"data-[side-section='0']:hidden md:data-[side-section='0']:flex data-[side-section='1']:flex flex-col h-full bg-color z-20 shadow md:shadow-none md:flex absolute w-4/5 md:relative md:w-[22rem] " + sidebarClosedClasses}>
            {children}
        </div>
    );
};
 
export default SideSectionWrapper;