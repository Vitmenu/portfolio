import { useState }                     from "react";
import * as svg                         from "../svgs";
import SpanText                         from "../spanText";
import ModalTab                         from "../modalTab";
import useItemInput                     from "../../../ux/hooks/useItemInput";

const DarkModeIcon = ({theme}) => {
    return theme === 'dark'
        ? svg.themeDark : theme === 'light'
        ? svg.themeLight
        : svg.themeSystem;
};

const SideSectionDarkMode = () => {
    const { item, setItem, itemRef } = useItemInput();

    const [theme, setTheme] = useState(localStorage.theme);

    const onClickChangeTheme = (theme) => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.remove('light');
        if (theme) {
            localStorage.setItem('theme', theme);
            document.documentElement.classList.add(theme);
        } else localStorage.removeItem('theme');
        setTheme(theme);
        setItem(!item);
    };
    const selectedTheme = (selectedTheme) => selectedTheme === theme ? {
        backgroundColor: '#2563eb',
        color: '#ffffff',
    } : {};
    
    const handleClick = () => setItem(!item);
    const optionNum = 5;

    return (
        <div ref={itemRef} className="flex justify-center items-center w-full h-16 px-4 py-1 noselect relative">
            <div style={item ? {
                    background: '#2563eb',
                    color: '#ffffff',
                } : {}}
                className={"rounded-md flex justify-between items-center w-full h-full px-4 py-3 hover:bg-gray-500 hover:text-white duration-75 cursor-pointer "}
                onClick={handleClick}
            >
                <div className="flex w-full items-center space-x-4">
                    <div className="flex flex-row justify-between w-full h-full">
                        <SpanText dataLang={'dkmd'} classes="text-md font-medium"/>
                        <DarkModeIcon theme={theme}/>
                    </div>
                </div>
            </div>
            {
                item &&
                <ModalTab
                    parentRef={itemRef}
                    styles={{width: 'calc(100% - 2rem)', zIndex: 1, background: '#ffffff'}}
                    translateX={'0rem'}
                    translateY={itemRef.current.getBoundingClientRect().y + ((2 + 4 * optionNum) * 14) > window.innerHeight
                        ? `-${1 + 2 * optionNum}rem`
                        : `${1 + 2 * optionNum}rem`
                    }
                >
                    <div
                        style={selectedTheme('light')}
                        className="flex justify-between items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75"
                        onClick={() => onClickChangeTheme('light')}
                    >
                        <SpanText dataLang={'dkmdl'} />
                        {svg.themeLight}
                    </div>
                    <div
                        style={selectedTheme('dark')}
                        className="flex justify-between items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75"
                        onClick={() => onClickChangeTheme('dark')}
                    >
                        <SpanText dataLang={'dkmdd'} />
                        {svg.themeDark}
                    </div>
                    <div
                        style={selectedTheme()}
                        className="flex justify-between items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75"
                        onClick={() => onClickChangeTheme()}   
                    >
                        <SpanText dataLang={'dkmds'} />
                        {svg.themeSystem}
                    </div>
                    <div onClick={handleClick} className="flex justify-start items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75">
                        <SpanText dataLang={'prep'} />
                    </div>
                    <div onClick={handleClick} className="flex justify-start items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75">
                        <SpanText dataLang={'cls'} />
                    </div>
                </ModalTab>
            }
        </div>
    );
}
 
export default SideSectionDarkMode;