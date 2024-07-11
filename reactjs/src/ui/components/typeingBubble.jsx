import { useEffect } from "react";

const TypingBubble = ({uid, classes="w-2 h-2 bg-gray-400 rounded-full"}) => {

    useEffect(() => {
        const colors = ['#d1d5db', '#9ca3af', '#6b7280',];
        const bubbles = document.querySelectorAll(`[data-bubble="${uid}"]`);
        let first = 2;
        setInterval(() => {
            bubbles.forEach((bubble, i) => {
                bubble.style.backgroundColor = colors[(first + i) % 3];
                bubble.style.animationDuration = "2s";
                bubble.style.animationTimingFunction = "cubic-bezier(0.2, 0.8, 0.2, 1)";
            });
            first = first < 1 ? 2 : first - 1;
        }, 500);
    }, []);

    return (
        <>
            <div data-bubble={uid} className={classes}></div>
            <div data-bubble={uid} className={classes}></div>
            <div data-bubble={uid} className={classes}></div>
        </>
    );
}
 
export default TypingBubble;