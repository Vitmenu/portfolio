import SpanText                             from "../spanText";

const SidebarModalitem = ({ onClick, svg, dataLang, styles }) => {
    return (
        <div onClick={onClick} style={styles} className="flex justify-between items-center space-x-4 px-[1.8rem] py-[1.4rem] cursor-pointer hover:text-blue-400 duration-100">
            <div style={{width: svg !== undefined ? '80%' : '100%'}} className="truncate">
                <SpanText dataLang={dataLang} classes={"font-normal"}/>
            </div>
            {
                svg !== undefined && 
                <div className="w-5 h-5">
                    {svg}
                </div>
            }
        </div>
    );
};

export default SidebarModalitem;