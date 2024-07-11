import {
    useState,
    useEffect,
}                           from "react";
import SpanText             from "../spanText";


const HashLink = ({hashId, closestId, biographRef, children, linkColor="#3b82f6"}) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            // console.error(`Element with id "${id}" not found`);
            return;
        };

        const yPosition = element.offsetTop - biographRef.current.offsetTop;

        biographRef.current.scrollTo({
            top: yPosition,
            behavior: 'smooth',
        });
    };

    return (
        <div onClick={() => scrollToSection(hashId)} style={{color: hashId == closestId ? linkColor : ''}} className={'cursor-pointer px-8 py-1 w-full text-sm flex justify-start hover:text-blue-400'} >
            {children}
        </div>
    );
};

const ParentHashLink = ({hashIds, closestId, biographRef, children, linkColor="#3b82f6"}) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const yPosition = element.offsetTop - biographRef.current.offsetTop;

        biographRef.current.scrollTo({
            top: yPosition,
            behavior: 'smooth',
        });
    };

    return (
        <div onClick={() => scrollToSection(hashIds[0])} style={{color: hashIds.includes(closestId) ? linkColor : ''}} className={'cursor-pointer px-8 py-1 w-full text-sm flex justify-start hover:text-blue-400'} >
            {children}
        </div>
    );
};

const SideSectionHomeSideNavbarItems = ({ biographRef }) => {
    const [closestId, setClosestId] = useState("intro");

    useEffect(() => {
        const handleScroll = () => {
            const sections = [
                "intro",
                "education",
                "experience",
                "skills",
                "project-vitmenu-portfolio",
                "project-vitmenu",
                "teamp-vitmenu-team",
                "personality",
            ];
            let closest = null;
    
            for (const id of sections) {
                const element = document.getElementById(id);
                if (!element) continue;
    
                const distance = Math.abs(element.getBoundingClientRect().top);
    
                if (closest === null || distance < closest.distance) {
                    closest = { id, distance };
                }
            };
            
            setClosestId(closest.id)
        };
    
        const container = biographRef.current;
        container.addEventListener('scroll', handleScroll);
    
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-fit space-y-2 py-6">
            <div className="px-6 py-1 w-full flex font-medium text-md justify-start">
                <SpanText dataLang={"toc"}/>
            </div>
            <HashLink hashId={"intro"} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"intro"}/>
            </HashLink>
            <HashLink hashId={"education"} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"education"}/>
            </HashLink>
            <HashLink hashId={"experience"} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"experience"}/>
            </HashLink>
            <HashLink hashId={"skills"} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"skills"}/>
            </HashLink>

            {/* Team Project */}
            <ParentHashLink hashIds={["teamp-vitmenu-team",]} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"teamp"}/>
            </ParentHashLink>
            <HashLink hashId={"teamp-vitmenu-team"} closestId={closestId} biographRef={biographRef} >
                <span className="ml-3">
                    Vitmenu Inklings
                </span>
            </HashLink>

            {/* Indivisual Project */}
            <ParentHashLink hashIds={["project-vitmenu-portfolio", "project-vitmenu"]} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"projects"}/>
            </ParentHashLink>
            <HashLink hashId={"project-vitmenu-portfolio"} closestId={closestId} biographRef={biographRef} linkColor={"#60a5fa"}>
                <span className="ml-3">
                    Vitmenu Portfolio
                </span>
            </HashLink>
            <HashLink hashId={"project-vitmenu"} closestId={closestId} biographRef={biographRef} linkColor={"#60a5fa"}>
                <span className="ml-3">
                    Vitmenu
                </span>
            </HashLink>

            <HashLink hashId={"personality"} closestId={closestId} biographRef={biographRef} >
                <SpanText dataLang={"personality"}/>
            </HashLink>
        </div>
    );
};

export default SideSectionHomeSideNavbarItems;