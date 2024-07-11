import SpanText from "../spanText";
import Video    from "../video";

const SideSectionHomeProjectSummary = ({ objkey, descLang, justify="left"}) => {
    return justify === "left" ? (
            <div className="flex flex-col justify-start items-start lg:flex-row lg:justify-between space-x-0 lg:space-x-12 h-full">
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
                    <Video objKey={objkey} wrapperClasses={"w-full"} contentClasses={"rounded-lg "} loadingClasses={"rounded-lg "} alt={"not found"} />
                </div>
                <div className="basis-1/2 flex flex-col justify-between lg:justify-start items-start space-y-1 lg:space-y-4 h-full my-8 md:my-0">
                    <SpanText dataLang={descLang} classes={"flex"}/>
                </div>
            </div>
        ) : (
            <div className="flex flex-col-reverse justify-start items-start lg:flex-row lg:justify-between space-x-0 lg:space-x-12 h-full">
                <div className="basis-1/2 flex flex-col justify-between lg:justify-start items-start space-y-1 lg:space-y-4 h-full my-8 md:my-0">
                    <SpanText dataLang={descLang} classes={"flex"}/>
                </div>
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
                    <Video objKey={objkey} wrapperClasses={"w-full"} contentClasses={"rounded-lg "} loadingClasses={"rounded-lg "} alt={"not found"} />
                </div>
            </div>
    );
};

export default SideSectionHomeProjectSummary;