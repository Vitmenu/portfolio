import { useState, useEffect, useCallback } from "react";
import { createRoot }                       from "react-dom/client";
import                                      "../ui/styles/index.css";
import * as svg from "../ui/components/svgs";
import env from "../ux/env";

if (localStorage.theme) document.documentElement.classList.add(localStorage.theme);


const SpanText = ({ dataLang, classes }) => {
    const lang = localStorage.lang ? localStorage.lang : window.navigator.language.split('-')[0];
    const text = {
        en: {
            errmesg1: 'Sorry for your inconvenience. The page you are looking for is not found.',
            errmesg2: 'Please type where you belong below, then I will look up the right place for you.',
            sd: 'send',
            ierr1: 'Please enter the name of the company or organization.',
            ierr2: 'We couldn\'t find the matching page for you. Please try again.',
        },
        ko: {
            errmesg1: '불편을 끼쳐드려 죄송합니다. 찾으시는 페이지를 찾을 수 없습니다.',
            errmesg2: '아래에 속한 곳을 입력하시면, 제가 올바른 곳을 찾아드리겠습니다.',
            sd: '보내기',
            ierr1: '회사나 단체의 이름을 입력해주세요.',
            ierr2: '찾으시는 페이지를 찾을 수 없습니다. 조금 더 정확한 검색어로 다시 시도해주세요.',
        },
        ja: {
            errmesg1: 'ご不便をおかけして申し訳ありません。お探しのページが見つかりません。',
            errmesg2: '以下に所属する団体や会社を入力してください。その後、適切な場所を探します。',
            sd: '送信',
            ierr1: '会社や団体の名前を入力してください。',
            ierr2: 'お探しのページが見つかりませんでした。もう少し正確にご記入ください。',
            
        },
    };
    return (
        <span className={classes}>
            {text[lang][dataLang]}
        </span>
    );
};

const App = () => {
    const [companyName, setCompanyName] = useState('');

    const [error, setError] = useState();

    const getCompanyId = async (companyName) => {
        try {
            const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : `https://${env.siteUrl}`;
            const res = await fetch(`${url}/api/notfound`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ companyName }),
            });
            
            if (res.ok) {
                location.reload();
            } else {
                setError('err2');
            };
            
        } catch(err) {
            setError('err2');
        };
    };
    const handleChange = (e) => setCompanyName(e.target.value);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                if (companyName.trim().length > 0) {
                    getCompanyId(companyName);
                } else {
                    setError('err1');
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

    return (
        <div className="flex flex-col w-full h-full justify-center items-center space-y-6">
            <div className="flex flex-col w-2/3 justify-center items-center space-y-1">
                <div className="flex justify-center text-center">
                    <SpanText dataLang={"errmesg1"}/>
                </div>
                <div className="flex justify-center text-center">
                    <SpanText dataLang={"errmesg2"}/>
                </div>
            </div>
            <div className="flex flex-col items-center w-4/5 md:w-2/3 lg:w-1/4 space-y-2">
                <div className="flex flex-row w-full justify-center text-center space-x-4">
                    <input data-input={'company'} type="text" value={companyName} onChange={handleChange} style={{outline: error ? "#ef4444 solid 3px" : ""}} className="w-full bg-slate-100 px-3 py-2 rounded outline outline-gray-300 outline-[3px] outline-offset-0 focus:outline-blue-400 focus:outline-[3px]" placeholder="e.g. TeamLab"/>
                    <div className="flex justify-center items-center cursor-pointer">
                        <div className="w-6 h-6 peer hover:text-blue-500 duration-300 ease-out" style={{
                                transform: companyName.trim().length > 0 ? `rotate(-${Math.random()}turn)` : '',
                                transition: companyName.trim().length > 0 ? 'transform 0.8s ease-out' : '',
                                color: companyName.trim().length > 0 ? '#3b82f6' : '',
                            }}>
                            {svg.send}
                        </div>
                        <div className="absolute -translate-y-3 opacity-0 peer-hover:-translate-y-8 duration-300 peer-hover:opacity-100 w-fit shadow rounded text-xs -z-10 px-2 py-1">
                            <SpanText dataLang={"sd"}/>
                        </div>
                    </div>
                </div>
                {
                    error && (
                        <div className="px-3 w-full flex justify-start text-red-500">
                            <SpanText dataLang={error}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
};

createRoot(document.getElementById('root')).render(
    <App />
);
