import { useEffect, }   from "react";
import SpanText         from "../components/spanText";

const Error = () => {
    useEffect(() => {
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
                    body: JSON.stringify({ location: window.location }),
                });
                const result = await res.text();
                console.log(result);
            } catch(err) {
                console.log(err);
            };
        };
        window.location.hostname !== 'localhost' && reportError();
    }, []);
    return (
        <div className="flex flex-col w-full h-full justify-center items-center space-y-2">
            <SpanText dataLang={'err1'} classes={"flex justify-center text-center px-6"} />
            <SpanText dataLang={'err2'} classes={"flex justify-center text-center px-6"} />
            <SpanText dataLang={'err3'} classes={"flex justify-center text-center px-6"} />
        </div>
    );
}
 
export default Error;