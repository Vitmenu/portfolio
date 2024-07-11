import { useEffect }   from "react";
import { useNavigate } from "react-router-dom";
import * as svg        from "../components/svgs";

if (localStorage.theme) document.documentElement.classList.add(localStorage.theme);

const SpanText = ({ dataLang, classes }) => {
    const lang = localStorage.lang ? localStorage.lang : window.navigator.language.split('-')[0];
    const text = {
        en: {
            errmesg1: 'Sorry for your inconvenience. The page you are looking for is not found.',
            bth: 'Back to home',
        },
        ko: {
            errmesg1: '불편을 끼쳐드려 죄송합니다. 찾으시는 페이지를 찾을 수 없습니다.',
            bth: '홈으로 돌아가기',
        },
        ja: {
            errmesg1: 'ご不便をおかけして申し訳ありません。お探しのページが見つかりません。',
            bth: 'ホームに戻る',
        },
    };
    return (
        <span className={classes}>
            {text[lang][dataLang]}
        </span>
    );
};

const Notfound = () => {
    const navigate = useNavigate(); 
    useEffect(() => {
        const translateSpans = document.querySelectorAll('[data-translate]');
        translateSpans.forEach((span, i) => {
            span.style.opacity = '0';
            
            span.style.transform = 'translateY(-6rem)';
            
            setTimeout(() => {
                span.style.transform = 'translateY(0)';
                span.style.opacity = '1';
                span.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
                setTimeout(() => {
                    span.style.animation = 'shake 0.5s ease-in-out';
                    span.style.animationIterationCount = '1';
                }, 400);
            }, i * 150);
        });

        const reportError = async () => {
            try {
                const url = 'https://portfolio.vitmenu.com';
                const res = await fetch(`${url}/api/util/report`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        location: window.location,
                        content: 'User tried to access not existing page',
                    }),
                });
                const result = await res.text();
                console.log(result);
            } catch(err) {
                console.log(err);
            };
        };
        window.location.hostname !== 'localhost' && reportError();
    }, []);

    const handleClickBackHome = () => navigate('/');

    return (
        <div className="flex w-full h-full justify-center items-center space-y-6">
            <div className="w-full md:w-2/3 flex justify-center">
                <div className="hidden md:flex mx-12">
                    <div className="w-48 text-gray-800">
                        {svg.cry}
                    </div>
                </div>
                <div className="w-full md:w-[21rem] px-8 md:px-0 space-y-6">
                    <div className="flex w-full justify-center text-center text-8xl space-x-2 text-gray-800 font-medium font-geologica">
                        <span data-translate>
                            4
                        </span>
                        <span data-translate>
                            0
                        </span>
                        <span data-translate>
                            4
                        </span>
                    </div>
                    <div className="flex max-w-3/4 text-lg text-start">
                        <SpanText dataLang={"errmesg1"}/>
                    </div>
                    <div className="w-full flex justify-center md:justify-start">
                        <div onClick={handleClickBackHome} className="px-4 py-2 bg-blue-500 rounded-full text-white cursor-pointer hover:bg-blue-600 duration-300 ease-out">
                            <SpanText dataLang={"bth"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Notfound;