import SpanText from "../spanText";

const SideSectionHomeResumeItem = ({ titleLang, listItemLangs=[] }) => {
    return (
        <div className="flex flex-col justify-start items-start w-full h-fit text-sm md:text-md space-y-2 md:space-y-4">
            <SpanText dataLang={titleLang} classes={"font-medium"}/>
            <ul className="flex flex-col space-y-1 md:space-y-2 font-light list-disc">
                {
                    listItemLangs.map((ele, id) => (
                        <li key={id} className="ml-6">
                            <SpanText dataLang={ele} />
                        </li>        
                    ))
                }
            </ul>
        </div>
    );
};

export default SideSectionHomeResumeItem;