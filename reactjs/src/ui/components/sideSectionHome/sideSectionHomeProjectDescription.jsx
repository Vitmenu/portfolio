import SpanText from "../spanText";
import Image    from "../image";

export const SideSectionHomeProjectDescriptionRight = ({ titleLang, descLang, objkey, }) => {
    return (
        <div className="w-full h-full flex flex-col justify-start items-start space-y-4">
            <SpanText dataLang={titleLang} classes={"text-lg md:text-xl"} />
            <div className="w-full h-full flex flex-col-reverse md:flex-row space-y-4 md:space-y-0 space-y-reverse">
                <div className="flex flex-col justify-between w-full md:w-2/3 h-full space-y-1 md:space-y-2 font-light">
                    <SpanText dataLang={descLang} />
                </div>
                <Image objKey={objkey} wrapperClasses={"w-full ml-0 mr-0 md:ml-6 md:w-1/2 float-right"} contentClasses={"rounded-lg border "} loadingClasses={"rounded-lg "} alt={"not found"} loading="eager" />
            </div>
        </div>
    );
};
export const SideSectionHomeProjectDescriptionLeft = ({ titleLang, descLang, objkey, }) => {
    return (
        <div className="w-full h-full flex flex-col justify-start items-start space-y-4">
            <SpanText dataLang={titleLang} classes={"text-lg md:text-xl"} />
            <div className="w-full h-full flex flex-col md:flex-row space-y-4 md:space-y-0">
                <Image objKey={objkey} wrapperClasses={"w-full ml-0 mr-0 md:mr-6 md:w-1/2 float-left"} contentClasses={"rounded-lg border "} loadingClasses={"rounded-lg "} alt={"not found"} loading="eager" />
                <div className="flex flex-col justify-between w-full md:w-2/3 h-full space-y-1 md:space-y-2 font-light">
                    <SpanText dataLang={descLang} />
                </div>
            </div>
        </div>
    );
};