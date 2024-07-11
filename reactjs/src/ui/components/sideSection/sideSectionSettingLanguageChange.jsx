import SpanText                         from "../spanText";
import ModalTab                         from "../modalTab";
import useItemInput                     from "../../../ux/hooks/useItemInput";
import { useGeneralContext }            from "../../../ux/contexts/general.context";

const texts = {
    en: {
        lang: 'ENG',
        ko: 'Korean',
        en: 'English',
        ja: 'Japanese',
    },
    ko: {
        lang: 'KOR',
        ko: '한국어',
        en: '영어',
        ja: '일본어',
    },
    ja: {
        lang: 'JPN',
        ko: '韓国語',
        en: '英語',
        ja: '日本語',
    },
};

const SideSectionSettingLanguageChange = () => {
    const { item, setItem, itemRef } = useItemInput();
    const {
        changeLang,
    } = useGeneralContext();

    const onClickChangeLanguage = (lang) => {
        changeLang(lang);
        setItem(false);
    };
    const handleClick = () => setItem(!item);
    const optionNum = 4;
    
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
                        <SpanText dataLang={'cl'} classes="text-md font-medium"/>
                        <SpanText dataLang={'lang'} classes="text-md font-light"/>
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
                    {
                        [...Object.keys(texts)].map((lang, id) => (
                            <div 
                                key={id}
                                style={{
                                    backgroundColor: lang === (localStorage.lang ? localStorage.lang : window.navigator.language.split('-')[0]) ? '#2563eb' : null,
                                    color: lang === (localStorage.lang ? localStorage.lang : window.navigator.language.split('-')[0]) ? '#fff' : null,
                                }}
                                className="flex justify-between items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75 first:rounded-t"
                                onClick={(e) => onClickChangeLanguage(lang)}
                            >
                                <SpanText dataLang={[lang]} />
                                <span>
                                    {texts[lang].lang}
                                </span>
                            </div>
                        ))
                    }
                    <div onClick={handleClick} className="flex justify-start items-center w-full h-14 px-6 py-0 cursor-pointer hover:text-blue-500 duration-75">
                        <SpanText dataLang={'cls'} />
                    </div>
                </ModalTab>
            }
        </div>
    );
};

export default SideSectionSettingLanguageChange;