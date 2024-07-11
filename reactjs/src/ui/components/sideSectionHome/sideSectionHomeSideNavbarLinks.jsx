import * as svg             from "../svgs"
import SpanText             from "../spanText";
import Tooltip              from "../tooltip";

const SideSectionHomeSideNavbarLinks = () => {
    return (
        <div className="flex flex-col w-full space-y-2 pt-4 pb-20">
            <SpanText dataLang={'lks'} classes={"px-6 py-1 w-full flex font-medium text-md justify-start"} />
            <div className="px-6 py-1 w-full flex font-light text-md justify-start space-x-2">
                <a target="_blank" href="https://www.instagram.com/juyeo_on/" className="flex items-center justify-center w-8 h-8 bg-slate-100 shadow rounded cursor-pointer hover:shadow-lg duration-200">
                    <Tooltip dataLang={'ist'} svg={svg.insta}/>
                </a>
                <a target="_blank" href="https://github.com/Vitmenu" className="flex items-center justify-center w-8 h-8 bg-slate-100 shadow rounded cursor-pointer hover:shadow-lg duration-200">
                    <Tooltip dataLang={'ghb'} svg={svg.github}/>
                </a>
            </div>
        </div>
    );
};

export default SideSectionHomeSideNavbarLinks;