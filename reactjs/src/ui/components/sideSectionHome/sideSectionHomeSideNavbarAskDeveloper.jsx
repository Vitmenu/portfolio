import { useState, useEffect } from "react";
import Loading                 from "../loading";
import SpanText                from "../spanText";
import localConsole            from "../../../ux/utils/localLog";
import { useGeneralContext }   from "../../../ux/contexts/general.context";

const SideSectionHomeSideNavbarAskDeveloper = ({ handleSwitchChat }) => {
    const {
        lang,
    }                                 = useGeneralContext();
    const [question, setQuestion]     = useState('');
    const getAboutInfoQuestion = async () => {
        try {
            const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : 'https://portfolio.vitmenu.com';
            const res = await fetch(`${url}/api/util/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ lang }),
            });
            const result = await res.json();
        
            setQuestion(result.question);

        } catch(err) {
            localConsole.log(err);
        };
    };
    useEffect(() => {
        getAboutInfoQuestion();
    }, []);

    const handleClickSendQuestion = () => handleSwitchChat(question);

    return (
        <div className="flex flex-col w-full h-fit space-y-2 pt-4">
            <SpanText dataLang={'aj'} classes={"px-6 py-1 w-full flex font-medium text-md justify-start"} />
            <div onClick={handleClickSendQuestion} className="mx-6 my-1 px-4 py-2 flex items-center justify-center w-[calc(100%-3rem)] h-16 bg-slate-100 shadow rounded cursor-pointer hover:shadow-lg duration-200 text-sm group relative">
                {
                    question
                    ? question
                    : <Loading classes={"w-full h-full flex justify-center items-center"}/>
                }
                <SpanText
                    dataLang={'sq'}
                    classes={'absolute flex opacity-0 group-hover:opacity-100 duration-150 -translate-y-[3.25rem] ease-in-out shadow px-2 py-1 rounded bg-clear-100 backdrop-blur text-zinc-800 text-xs font-normal whitespace-nowrap'}
                />
            </div>
        </div>
    );
};

export default SideSectionHomeSideNavbarAskDeveloper;