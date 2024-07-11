const ModalTab = ({ parentRef, children, translateX, translateY=0, styles={}, classes }) => {
    if (parentRef && parentRef.current) {
        const adjustedTranslateX = translateX ? translateX
            : window.innerWidth - 16 > parentRef.current.getBoundingClientRect().left + 128
            ? '-0.5rem'
            : window.innerWidth > parentRef.current.getBoundingClientRect().right
            ? `calc(${parentRef.current.getBoundingClientRect().width}px - 8rem)`
            : `calc(${parentRef.current.getBoundingClientRect().width}px - 9rem - ${parentRef.current.getBoundingClientRect().right - window.innerWidth}px)`;
        
        return (
            <div style={{
                ...styles,
                transform: `translate(${adjustedTranslateX}, ${translateY})`,
                top: translateY ? '' : '5rem',
            }} className={'absolute flex flex-col w-full h-fit divide-y divide-color border rounded shadow z-20 bg-clear-100 backdrop-blur ' + classes}>
                {children}
            </div>
        );
    } else {
        return <></>;
    };
};
 
export default ModalTab;