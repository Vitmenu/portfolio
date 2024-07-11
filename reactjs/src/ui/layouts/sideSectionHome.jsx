import { useRef } from "react";
import Image      from "../components/image";
import Tooltip    from "../components/tooltip";
import SpanText   from "../components/spanText";
import * as svg   from "../components/svgs";

import SideSectionHomeSideNavbar     from "../components/sideSectionHome/sideSectionHomeSideNavbar";
import SideSectionHomeResumeItem     from "../components/sideSectionHome/sideSectionHomeResumeItem";
import SideSectionHomeResumeSection  from "../components/sideSectionHome/sideSectionHomeResumeSection";
import SideSectionHomeProjectHead    from "../components/sideSectionHome/sideSectionHomeProjectHead";
import SideSectionHomeProjectSummary from "../components/sideSectionHome/sdieSectionHomeProjectSummary";
import {
    SideSectionHomeProjectDescriptionRight,
    SideSectionHomeProjectDescriptionLeft,
}                                    from "../components/sideSectionHome/sideSectionHomeProjectDescription";

const Project = ({ wrapperId, children }) => {
    return (
        <div id={wrapperId} className="flex flex-col w-full h-full space-y-6 md:space-y-14 my-12">
            {children}
        </div>
    );
};
const ProjectDescription = ({ children }) => {
    return (
        <div className="flex flex-col w-full justify-start items-start space-y-12 px-0 md:px-4">
            {children}
        </div>
    );
};

const SideSectionHome = () => {
    const biographRef       = useRef();
    const biographSection = "flex flex-col px-6 py-8 md:py-12 space-y-6 md:space-y-8 ";

    return (
        <div className={"flex justify-between w-full"}>
            <div ref={biographRef} className="overflow-y-scroll w-full lg:w-[calc(100%-20rem)] px-4 lg:px-8 divide-y">
                <div id="intro" className={biographSection + " mt-12"}>
                    <div className="flex justify-between items-center space-x-0 lg:space-x-12">
                        <div className="basis-1/2 lg:basis-3/4 flex flex-col justify-between lg:justify-start items-start space-y-1 lg:space-y-4 h-32 lg:h-fit">
                            <div className="flex justify-start lg:justify-end items-center space-x-2 w-full text-xs lg:text-sm">
                                <Tooltip svg={svg.mappin} svgClasses="w-5 h-5 font-light" dataLang={'wrf'} />
                                <SpanText dataLang={"sj"} />
                            </div>
                            <div className="w-full flex flex-col h-full lg:flex-row lg:h-fit justify-start lg:justify-between items-start lg:items-center space-y-2">
                                <SpanText dataLang={"kjy"} classes={"text-2xl lg:text-3xl font-normal"}/>
                                <SpanText dataLang={"us"} classes={"text-sm"}/>
                            </div>
                            <SpanText dataLang={"itr"} classes={"hidden lg:flex"}/>
                        </div>
                        <div className="basis-1/2 lg:basis-1/4 flex justify-center items-center">
                            <Image objKey={'cropped.png'} wrapperClasses={"w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64"} contentClasses={"rounded-full border "} loadingClasses={"rounded-full border"} alt={"profile photo"} />
                        </div>
                    </div>
                    <SpanText dataLang={"itr"} classes={"flex lg:hidden"}/>
                </div>
                <SideSectionHomeResumeSection titleLang={"education"}>
                    <SideSectionHomeResumeItem titleLang={"bch"} listItemLangs={["susj", "egdm"]} />
                    <SideSectionHomeResumeItem titleLang={"rcw"} listItemLangs={["ecan", "bsin"]} />
                </SideSectionHomeResumeSection>
                <SideSectionHomeResumeSection titleLang={"experience"}>
                    <SideSectionHomeResumeItem titleLang={"jpro"} listItemLangs={["nvag", "omsj"]} />
                    <SideSectionHomeResumeItem titleLang={"rka"} listItemLangs={["fese", "pgrk"]} />
                    <SideSectionHomeResumeItem titleLang={"uqsm"} listItemLangs={["pgr1", "pgr2"]} />
                </SideSectionHomeResumeSection>
                <SideSectionHomeResumeSection titleLang={"skills"}>
                    <SideSectionHomeResumeItem titleLang={"cien"} listItemLangs={["pgr3", "pgr4"]} />
                    <SideSectionHomeResumeItem titleLang={"fsdm"} listItemLangs={["pgr5", "pgr6", "pgr7", "pgr8"]} />
                    <SideSectionHomeResumeItem titleLang={"lsls"} listItemLangs={["en", "ja", "ko"]} />
                </SideSectionHomeResumeSection>
                
                <SideSectionHomeResumeSection titleLang={"teamp"}>
                    <Project wrapperId={"teamp-vitmenu-team"}>
                        <SideSectionHomeProjectHead title={"Vitmenu Inklings"} period={"1st Jun 2024 ~ Present"} members={["kjy", "qstn"]}/>
                        <div className="flex w-full justify-end items-start">
                            <SpanText dataLang={"rdmr"} classes={"cursor-pointer hover:text-gray-600 duration-150"} />
                        </div>
                    </Project>
                </SideSectionHomeResumeSection>

                <SideSectionHomeResumeSection titleLang={"projects"}>
                    <Project wrapperId={"project-vitmenu-portfolio"}>
                        <SideSectionHomeProjectHead title={"Vitmenu Portfolio"} period={"12th April ~ May 2024"} />
                        <SideSectionHomeProjectSummary objkey={"portfolio-demonstration.mov"} descLang={"vmdpf"}/>
                        <ProjectDescription>
                            <SideSectionHomeProjectDescriptionRight titleLang={"ftes1"} descLang={"lid0"} objkey={"portfolio-erd.png"}/>
                            <SideSectionHomeProjectDescriptionLeft titleLang={"pled2"} descLang={"lid3"} objkey={"teamlab.png"}/>
                        </ProjectDescription>
                        <div className="flex w-full justify-end items-start">
                            <div className="w-fit md:w-1/2 h-fit flex justify-around items-center space-x-8">
                                <div className="w-8 rounded-lg">{svg.nodejs}</div>
                                <div className="w-8 rounded-lg">{svg.aws}</div>
                                <div className="w-8 rounded-lg">{svg.tailwindcss}</div>
                                <div className="w-8 rounded-lg">{svg.openai}</div>
                                <div className="w-8 rounded-lg">{svg.react}</div>
                            </div>
                        </div>
                    </Project>
                    <Project wrapperId={"project-vitmenu"}>
                        <SideSectionHomeProjectHead title={"Vitmenu"} period={"Oct 2022 ~ Suspended"} />
                        <SideSectionHomeProjectSummary objkey={"project.mov"} descLang={"vmd"} justify="right"/>
                        <ProjectDescription>
                            <SideSectionHomeProjectDescriptionLeft titleLang={"sor"} descLang={"lid6"} objkey={"erm.png"}/>
                            <SideSectionHomeProjectDescriptionRight titleLang={"frow"} descLang={"lid9"} objkey={"project-0.png"}/>
                        </ProjectDescription>
                        <div className="flex justify-start items-start space-x-0 lg:space-x-12 overflow-x-scroll">
                            <div className="w-fit h-fit flex justify-start items-center space-x-12">
                                <Image objKey={'project-1.png'} wrapperClasses={"w-40"} contentClasses={"rounded-lg border "} loadingClasses={"rounded-lg "} alt={"not found"} loading="eager" />
                                <Image objKey={'project-2.png'} wrapperClasses={"w-40"} contentClasses={"rounded-lg border "} loadingClasses={"rounded-lg "} alt={"not found"} loading="eager" />
                            </div>
                        </div>
                    </Project>
                </SideSectionHomeResumeSection>

                <SideSectionHomeResumeSection titleLang={"personality"}>
                    <SideSectionHomeResumeItem titleLang={"hb1"} listItemLangs={["hb1desc"]} />
                    <SideSectionHomeResumeItem titleLang={"hb2"} listItemLangs={["hb2desc"]} />
                    <SideSectionHomeResumeItem titleLang={"hb3"} listItemLangs={["hb3desc"]} />
                    <SideSectionHomeResumeItem titleLang={"hb4"} listItemLangs={["hb4desc"]} />
                </SideSectionHomeResumeSection>
            </div>
            <SideSectionHomeSideNavbar biographRef={biographRef} />
        </div>
    );
}
 
export default SideSectionHome;