import SpanText from "../spanText";

const SideSectionHomeResumeSection = ({ titleLang, classes, children }) => {
    const biographSection = "flex flex-col px-6 py-8 md:py-12 space-y-6 md:space-y-8 ";
    return (
        <div id={titleLang} className={biographSection + classes}>
            <SpanText dataLang={titleLang} classes={"flex text-xl font-light"}/>
            {children}
        </div>
    );
};
 
export default SideSectionHomeResumeSection;