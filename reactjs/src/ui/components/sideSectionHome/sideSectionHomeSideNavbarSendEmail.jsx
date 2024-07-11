import {
    useState,
}                           from "react";
import Loading              from "../loading";
import SpanText             from "../spanText";
import { useGeneralContext }   from "../../../ux/contexts/general.context";
import { emitWSTyping }     from "../../../ux/contexts/ws.context";

const SideSectionHomeSideNavbarSendEmail = () => {
    const { text }                  = useGeneralContext();
    const [emailBody, setEmailBody] = useState('');
    const handleEmailInputChange = (e) => {
        emitWSTyping();
        setEmailBody(e.target.value)
    };
    const [status, setStatus]       = useState(0);
    // 0 => available
    // 1 => loading
    // 2 => success
    // 3 => failure
    const handleClickSendEmail = async () => {
        setStatus(1);
        const setStatusBack = (num) => {
            setStatus(num);
            num !== 2 && setTimeout(() => {
                setStatus(0);
            }, 3000);
        };
        try {
            if (typeof emailBody !== 'string' || emailBody.length < 1) throw new Error('Invalid email body');
            const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : 'https://portfolio.vitmenu.com';
            const res = await fetch(`${url}/api/util/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ body: emailBody }),
            });
            if (res.ok) {
                setStatusBack(2);
            } else {
                setStatusBack(3);
            };
        } catch(err) {
            setStatusBack(3);
        };
    };
    return (
        <div className="flex flex-col w-full h-fit space-y-2 pt-4">
            <SpanText dataLang={'sem'} classes={"px-6 py-1 w-full flex font-medium text-md justify-start"} />
            <div className="mx-6 my-1 flex flex-col items-center justify-start w-[calc(100%-3rem)] h-[12rem] duration-200 text-sm space-y-4">
                {
                    status === 0 ? (
                        <div onClick={handleClickSendEmail} className="flex justify-center items-center w-full h-12 px-4 py-3 rounded-md bg-slate-100 shadow hover:shadow-lg cursor-pointer font-normal duration-200">
                            <SpanText dataLang={'sd'} />
                        </div>
                    ) :
                    status === 1 ? (
                        <Loading classes={"flex justify-center items-center w-full h-12 min-h-11 px-4 py-3 rounded-md bg-slate-100 shadow font-normal"}/>
                    ) :
                    status === 2 ? (
                        <SpanText dataLang={"sems"} classes={"flex justify-center items-center w-full h-12 px-4 py-3 rounded-md bg-slate-100 shadow font-normal text-blue-500"}/>
                    ) :
                    status === 3 && (
                        <SpanText dataLang={"semf"} classes={"flex justify-center items-center w-full h-12 px-4 py-3 rounded-md bg-slate-100 shadow font-normal text-red-500"}/>
                    )
                }
                {
                    status === 0 ? (
                        <textarea
                            data-email-bar
                            type="text"
                            onChange={handleEmailInputChange}
                            className="w-full h-full px-4 py-3 overflow-scroll rounded-md resize-none outline-none outline-0 outline-transparent bg-slate-100 focus:shadow-lg shadow text-start"
                            value={emailBody}
                            placeholder={text ? text.web : ''}
                        />
                    ) : (
                        <div className={"w-full h-full px-4 py-3 overflow-scroll rounded-md resize-none bg-slate-100 shadow text-start"}>
                            {emailBody}
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default SideSectionHomeSideNavbarSendEmail;