// import { useEffect, useState } from "react";
// import localConsole            from "../utils/localLog";

// const useTypingEffect = ({ lang }) => {
//     const [infoQuestion, setInfoQuestion]               = useState();
//     // const [infoAnswer, setInfoAnswer]                   = useState();
//     const [typingQuestionDone, setTypingQuestionDone]   = useState(false);
    
//     const [typingQuestion, setTypingQuestion]           = useState('');
//     // const [typingAnswer, setTypingAnswer]               = useState('');

//     const getAboutInfoQuestion = async () => {
//         try {
//             const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : 'https://portfolio.vitmenu.com';
//             const res = await fetch(`${url}/api/util/question`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({ lang }),
//             });
//             const result = await res.json();
            
//             // getAboutInfoAnswer(result.question);

//             setInfoQuestion(result.question);


//         } catch(err) {
//             localConsole.log(err);
//         };
//     };
//     // const getAboutInfoAnswer = async (question) => {
//     //     try {
        
//     //         const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : 'https://portfolio.vitmenu.com';
//     //         const res = await fetch(`${url}/api/util/answer`, {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Accept': 'application/json',
//     //             },
//     //             credentials: 'include',
//     //             body: JSON.stringify({ question }),
//     //         });
//     //         const result = await res.json();
            
//     //         setInfoAnswer(result.answer);

//     //     } catch(err) {
//     //         localConsole.log(err);
//     //     };
//     // };
//     useEffect(() => {
        
//         getAboutInfoQuestion();

//     }, []);
//     useEffect(() => {
//         let questionTimerId;
//         if (infoQuestion && !typingQuestionDone) {
//             let i = -1;
//             questionTimerId = setInterval(() => {
//                 if (i < infoQuestion.length - 1) {
//                     setTypingQuestion((prev) => prev + infoQuestion[i]);
//                     i++;
//                 } else {
//                     setTypingQuestionDone(true);
//                     clearInterval(questionTimerId);
//                 }
//             }, 50);
//         };
//         return () => clearInterval(questionTimerId);
//     }, [infoQuestion]);
//     // useEffect(() => {
//     //     let answerTimerId;
        
//     //     if (infoAnswer && typingQuestionDone) {
//     //         let i = -1;
//     //         answerTimerId = setInterval(() => {
//     //             if (i < infoAnswer.length - 1) {
//     //                 setTypingAnswer((prev) => prev + infoAnswer[i]);
//     //                 i++;
//     //             } else {
//     //                 clearInterval(answerTimerId);
//     //             }
//     //         }, 25);
//     //     };
//     //     return () => clearInterval(answerTimerId);
//     // }, [infoAnswer, typingQuestionDone]);

//     return {
//         infoQuestion,
//         typingQuestion,
//         // typingAnswer,
//     }
// };

// export default useTypingEffect;