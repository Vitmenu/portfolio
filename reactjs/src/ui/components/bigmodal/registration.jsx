import * as svg                  from "../svgs";
import SpanText                  from "../spanText";
import useDropping               from "../../../ux/hooks/useDropping";

const Registration = ({currVersion, item, setItem}) => {
    const handleCloseItem = () => {
        localStorage.setItem('version', currVersion);
        setItem(false);
    };

    const { modalRef } = useDropping();

    return (
        <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur">
            <div ref={modalRef} data-translate-modal className="w-11/12 h-3/4 shadow-md bg-white rounded-md flex -translate-y-80 opacity-0">
                <div className="hidden lg:flex flex-col justify-start lg:rounded-l-md lg:w-1/3 h-full">
                    <div className="w-full aspect-square">
                        <div className="w-full p-12">
                            {svg.welcome}
                        </div>
                    </div>
                    <SpanText dataLang={"rgst"} classes="w-full flex font-medium px-16 mb-3"/>
                    <ul className="w-full flex flex-col justify-start px-16 list-disc space-y-3">
                        <li><SpanText dataLang={"li1"} /></li>
                        <li><SpanText dataLang={"li2"} /></li>
                        <li><SpanText dataLang={"li3"} /></li>
                    </ul>
                </div>
                <div className="flex flex-col justify-evenly items-center w-full roudned-md lg:rounded-l-none lg:rounded-r-md lg:w-2/3 space-y-8">
                    <div className="w-4/5 flex-col flex justify-start space-y-4 md:space-y-8">
                        <SpanText dataLang={"wcpf"} classes={"text-2xl md:text-3xl font-medium"}/>
                        <SpanText dataLang={"fbam"} classes={"md:text-xl text-wrap"}/>
                    </div>
                    <div className="w-4/5 flex-col flex justify-end items-end space-y-3 md:space-y-6">
                        <div className="w-full flex-col flex justify-end items-end">
                            <SpanText dataLang={"wsnw"} classes={"font-normal"}/>
                            <SpanText dataLang={"update"} classes={"w-full md:w-fit inline-block truncate"}/>
                        </div>
                        <div onClick={handleCloseItem} className="w-full md:w-fit flex justify-center items-center px-4 py-2 bg-gray-500 text-white rounded font-light hover:bg-gray-600 duration-300 ease-out cursor-pointer">
                            <SpanText dataLang={"cls"}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;