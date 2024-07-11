import { useState, useEffect }   from "react";
import * as svg                  from "../svgs";
import SpanText                  from "../spanText";
import retrieve                  from "../../../ux/utils/retrieve";
import useDropping               from "../../../ux/hooks/useDropping";

const TooManyRequestsByGuestUser = ({item, setItem}) => {

    const [companyName, setCompanyName] = useState('');
    const [error, setError]             = useState();
    const [result, setResult]           = useState();

    const handleChange = (e) => setCompanyName(e.target.value);
    const handleCloseItem = () => setItem(false);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    const handleRegisterCompany = async () => retrieve('/api/util/register', {
            ...options,
            body: JSON.stringify(result),
        }, async (res) => {
            if (res) {
                location.reload();
            };
        }
    );
    const getCompanyId = async (companyName) => retrieve('/api/util/search', {
            ...options,
            body: JSON.stringify({ companyName }),
        }, async (res) => {
            if (res) {
                const result = await res.json();
                // result = {name, key}
                setResult(result);
            } else {
                setError('ierr2');
            };
        }
    );
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                if (companyName.trim().length > 0) {
                    getCompanyId(companyName);
                } else {
                    setError('ierr1');
                };
            } else {
                setError();
            };
        };
        document.addEventListener("keyup", handleKeyPress);

        return () => {
            document.removeEventListener("keyup", handleKeyPress);
        };
    }, [companyName]);
    useEffect(() => {
        if (item) {
            const dataInputCompany = document.querySelector('[data-input="company"]');
            dataInputCompany.focus();
        };
    }, [item]);

    const { modalRef } = useDropping();

    return (
        <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur">
            <div ref={modalRef} className="w-11/12 h-3/4 shadow-md bg-white rounded-md flex -translate-y-80 opacity-0">
                <div className="hidden lg:flex flex-col justify-start lg:rounded-l-md lg:w-1/3 h-full">
                    <div className="w-full aspect-square">
                        {svg.register}
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
                        <SpanText dataLang={"sfi"} classes={"text-2xl md:text-3xl font-medium"}/>
                        <SpanText dataLang={"mrag"} classes={"md:text-xl text-wrap"}/>
                    </div>
                    <div className="w-4/5 flex-col flex justify-start space-y-4 md:space-y-8">
                        <div className="w-full flex flex-col space-y-4">
                            <div className="w-full flex">
                                <SpanText dataLang={"tcpe"}/>
                            </div>
                            <div className="w-full flex">
                                <input data-input={'company'} type="text" value={companyName} onChange={handleChange} style={{outline: error ? "#ef4444 solid 3px" : ""}} className="w-full bg-slate-100 px-3 py-2 rounded outline outline-gray-300 outline-[3px] outline-offset-0 focus:outline-blue-400 focus:outline-[3px]" placeholder="e.g. companyName"/>
                            </div>
                            {
                                error && (
                                    <div className="px-3 w-full flex justify-start text-red-500">
                                        <SpanText dataLang={error}/>
                                    </div>
                                )
                            }
                        </div>
                        <div className="w-full flex flex-col md:flex-row items-start justify-end md:items-center space-x-0 space-y-2 md:space-x-4 md:space-y-0">
                            {
                                result && (
                                    <div onClick={handleRegisterCompany} className="w-full md:w-fit flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded font-light hover:bg-blue-600 duration-300 ease-out cursor-pointer">
                                        <SpanText dataLang={"lia"}/>&nbsp;
                                        <span className="font-normal">
                                            {result.name}
                                        </span>
                                    </div>
                                )
                            }
                            <div onClick={handleCloseItem} className="w-full md:w-fit flex justify-center items-center px-4 py-2 bg-gray-500 text-white rounded font-light hover:bg-gray-600 duration-300 ease-out cursor-pointer">
                                <SpanText dataLang={"ni"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TooManyRequestsByGuestUser;