import { useEffect }                from "react";
import SpanText                     from "../spanText";
import * as svg                     from "../svgs";
import { useGeneralContext }        from "../../../ux/contexts/general.context";

const SideSectionSearchEnd = ({searchInput, setSearchInput}) => {
    return searchInput.length > 0 ? (
            <svg onClick={() => {setSearchInput('')}} strokeWidth={1.2} stroke="currentColor" className='w-5 h-5 cursor-pointer' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ) : navigator.userAgent.includes('Mac OS') ? (
            <div className='flex justify-end items-center bg-slate-200 px-1 text-slate-600 font-normal border border-slate-300 rounded'>
                <svg strokeWidth={1.2} stroke="currentColor" className='w-4 h-4' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"></path>
                </svg>
                <span>K</span>
            </div>
        ) : (
            <div className='flex justify-end items-center bg-slate-200 px-1 text-slate-600 font-normal border border-slate-300 rounded'>
                <span>Ctrl</span>
                <span>K</span>
            </div>
        );
};

const SideSectionSearchBar = ({ dataLangPlaceHolder, searchInput, setSearchInput, }) => {
    const { text } = useGeneralContext();

    const handleSearchInputChange = (e) => setSearchInput(e.target.value);
    const handleSearchInputBlur = () => {
        const searchInput = document.querySelector('[data-search-bar]');
        searchInput.style.outline = 'none';
        setSearchInput('');
    };
    const handleSearchInputFocus = () => {
        const searchInput = document.querySelector('[data-search-bar]');
        searchInput.style.outline = '3px solid #3b82f6';
    };

    useEffect(() => {
        const onPressCommandK = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.code.toLowerCase() === 'keyk') {
                document.querySelector('[data-search-input]').focus();
            };
        };
        addEventListener('keydown', onPressCommandK);
        return () => removeEventListener('keydown', onPressCommandK);
    }, []);

    return (
        <div className="w-full h-1/3 flex flex-row justify-between items-center ">
            <div data-search-bar className="flex items-center justify-between w-full h-12 mx-4 bg-gray-100 rounded-md">
                <div className="flex items-center justify-center px-4">
                    <div className="w-5 h-5 ">
                        {svg.search}
                    </div>
                </div>
                <input
                    data-search-input type="text"
                    value={searchInput}
                    placeholder={(dataLangPlaceHolder && text) ? text[dataLangPlaceHolder] : ''}
                    onBlur={handleSearchInputBlur}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchInputFocus}
                    className="flex w-full h-full outline-none bg-transparent"
                />
                <div className="flex items-center justify-center px-4">
                    <SideSectionSearchEnd searchInput={searchInput} setSearchInput={setSearchInput} />
                </div>
            </div>
        </div>
    );
};

const SideSectionHeader = ({ titleDataLang, icons, searchInput, setSearchInput,  }) => {
    const handleClickToggleMenu = () => {

        const sideSection = document.querySelectorAll('[data-side-section]');
        if (sideSection.length > 1) {
            [...sideSection].forEach((section) => {
                const sideSectionClosed = section.dataset.sideSection > 0
                    ? "0"
                    : "1";
                section.dataset.sideSection = sideSectionClosed;
            });
        } else {
            const sideSectionClosed = sideSection.dataset.sideSection > 0
                ? "0"
                : "1";
            sideSection.dataset.sideSection = sideSectionClosed;
        };
    };

    return (
        <div style={{height: searchInput !== undefined ? '12rem' : '8rem'}} className="w-full flex flex-col">
            <div style={{height: searchInput !== undefined ? '66.666667%' : '100%'}} className="flex flex-row justify-between items-center w-full">
                <div className="mx-8 w-full flex items-center justify-start">
                    <SpanText dataLang={titleDataLang} classes={'text-2xl font-medium'}/>
                </div>
                <div className="mx-8 w-full flex items-center justify-end space-x-4">
                    {icons}
                    <div data-side-section="0"
                        className="w-7 h-7 flex md:hidden justify-center items-center data-[side-section='0']:text-black data-[side-section='1']:text-blue-500 cursor-pointer"
                        onClick={handleClickToggleMenu}
                    >
                        {svg.menu}
                    </div>
                </div>
            </div>
            {   searchInput !== undefined && 
                <div className="flex flex-row justify-between items-center w-full h-1/3">
                    <SideSectionSearchBar dataLangPlaceHolder={"src"} searchInput={searchInput} setSearchInput={setSearchInput} />
                </div>
            }
        </div>
    );
};

export default SideSectionHeader;