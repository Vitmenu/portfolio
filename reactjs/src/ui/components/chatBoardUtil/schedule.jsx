import { useState, useEffect }          from "react";
import SpanText                         from "../spanText";
import * as svg                         from "../svgs";

const ChatBoardSideMenuSchedule = ({ conversation }) => {

    const url = window.location.hostname === 'localhost' ? 'http://localhost:14001' : 'https://portfolio.vitmenu.com';
    const [schedules, setSchedules] = useState();
    const loadSchedule = async () => {
        // try {
        //     const res = await fetch(`${url}/api/chat/schedule?conv_id=${conversation.id}`, {
        //         method: 'GET',
        //         headers: {
        //             'Accept': 'application/json',
        //         },
        //         credentials: 'include',
        //     });
        //     const result = await res.json();
        //     const newSchedules = result.schedules.map(schedule => new Schedule(schedule));
        //     setSchedules(newSchedules);

        // } catch(err) {
        //     localConsole.log(`   -   Error ${err.messages ? err.messages : err}   -   `);
        // };
        
    };

    useEffect(() => {
        loadSchedule();
    }, [conversation])

    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDayOrMonth = (dayOrMonth) => {
        return dayOrMonth < 10 ? `0${dayOrMonth}` : dayOrMonth;
    };

    const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}${formatDayOrMonth(new Date().getMonth() + 1)}${formatDayOrMonth(new Date().getDate())}`);
    
    const handlePrevMonth = () => {
        setCurrentDate((prevDate) => {
            const prevMonth = prevDate.getMonth() - 1;
            return new Date(prevDate.getFullYear(), prevMonth, 1);
        });
    };
    const handleNextMonth = () => {
        setCurrentDate((prevDate) => {
            const nextMonth = prevDate.getMonth() + 1;
            return new Date(prevDate.getFullYear(), nextMonth, 1);
        });
    };
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDay();
    };
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        const lastDayOfMonth = getLastDayOfMonth(year, month);
        const lastDayOfLastMonth = getDaysInMonth(year, month - 1);

        const calendarDays = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`p${i}`} className="w-[calc(1/7*100%-0.5rem)] m-[0.25rem] flex items-center justify-center aspect-square text-zinc-500">{lastDayOfLastMonth - (firstDayOfMonth - i) + 1}</div>);
        };
        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(
                <div onClick={() => {
                    setSelectedDate(`${year}${formatDayOrMonth(month + 1)}${formatDayOrMonth(day)}`);
                }}
                    style={{
                        backgroundColor: selectedDate === `${year}${formatDayOrMonth(month + 1)}${formatDayOrMonth(day)}` ? '#2563eb' : '',
                        color: selectedDate === `${year}${formatDayOrMonth(month + 1)}${formatDayOrMonth(day)}` ? '#ffffff' : '',
                    }} key={`d${day}`} className="w-[calc(1/7*100%-0.5rem)] m-[0.25rem] flex items-center justify-center aspect-square hover:bg-blue-500 hover:text-white rounded-full cursor-pointer">
                    <div className="peer flex items-center justify-center w-full h-full">
                        {day}
                    </div>
                    <div className="absolute -z-10 opacity-0 peer-hover:opacity-100 peer-hover:z-10 duration-200 flex text-black -translate-y-10 bg-white shadow-xl rounded text-xs px-1 xl:text-sm xl:px-2 xl:py-1">
                        <SpanText dataLang={"nevt"} />
                    </div>
                </div>
            );
        };
        for (let i = 0; i < 6 - lastDayOfMonth; i++) {
            calendarDays.push(<div key={`n${i}`} className="w-[calc(1/7*100%-0.5rem)] m-[0.25rem] flex items-center justify-center aspect-square text-zinc-500">{i + 1}</div>);
        }
        return calendarDays;
    };

    return (
        <div className="w-full h-fit flex flex-col justify-start items-center space-y-4 lg:space-y-6 p-6">
            <div className="flex flex-col w-full noselect">
                <div className="w-full flex justify-between items-center p-4 font-medium">
                    <div className="w-8 h-8 flex justify-center items-center hover:bg-clear-500 rounded-full cursor-pointer" onClick={handlePrevMonth}>
                        {svg.ArrowLeft}
                    </div>
                    <div className="w-3/5 text-lg">
                        {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                    </div>
                    <div className="w-8 h-8 flex justify-center items-center hover:bg-clear-500 rounded-full cursor-pointer"onClick={handleNextMonth}>
                        {svg.ArrowRight}
                    </div>
                </div>
                <div className="w-full flex flex-col p-4">
                    <div className="flex flex-row justify-between font-medium">
                        <SpanText dataLang={'sun'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'mon'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'tue'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'wed'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'thu'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'fri'} classes={"w-[calc(1/7*100%)] text-center"}/>
                        <SpanText dataLang={'sat'} classes={"w-[calc(1/7*100%)] text-center"}/>
                    </div>
                    <div className="flex flex-row justify-start flex-wrap">
                        {renderCalendar()}
                    </div>
                </div>
                {/* <div className="w-full flex justify-between items-center p-4">
                    
                </div> */}
            </div>
        </div>
    );
};

export default ChatBoardSideMenuSchedule;