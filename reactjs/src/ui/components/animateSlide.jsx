import { useRef } from "react";

const AnimateSlide = ({ svgD }) => {
    const animateEnterRef = useRef();
    const animateLeaveRef = useRef();
    const handleMouseEnter = () => animateEnterRef.current.beginElement();
    const handleMouseLeave = () => animateLeaveRef.current.beginElement();

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2.25} strokeLinecap="round"  strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d={svgD.before}>
                    <animate
                        ref={animateEnterRef}
                        attributeName="d"
                        begin="indefinite"
                        dur="0.2s"
                        repeatCount="1"
                        fill="freeze"
                        from={svgD.before}
                        to={svgD.after}
                    />
                    <animate
                        ref={animateLeaveRef}
                        attributeName="d"
                        begin="indefinite"
                        dur="0.2s"
                        repeatCount="1"
                        fill="freeze"
                        from={svgD.after}
                        to={svgD.before}
                    />
                </path>
            </svg>
        </div>
    );
};

export default AnimateSlide;