import SpanText                             from "./spanText";

const Tooltip = ({ parentRef, onClick, dataLang, customTooltip, svg, ttStyles={}, parentStyles={}, align='top', svgStyles={}, svgClasses='', parentClasses, }) => {

    const parentClass = `
        flex items-center duration-150 z-10 relative
    `;
    const parentStyle = {
        justifyContent: align === 'top'
        ? 'center'
        : 'flex-start',
    };
    const ttClass = `
        absolute flex opacity-0 peer-hover:opacity-100 duration-150 ease-in-out
        shadow px-2 py-1 rounded bg-clear-100 backdrop-blur text-zinc-800 text-xs font-normal whitespace-nowrap
    `;
    
    const ttAlign = {
        transform: align === 'top'
            ? `translate(0rem, -2.25rem)`
            : `translate(-0.5rem, 2.25rem)`,
    };
    
    return (
        <div onClick={onClick} style={{cursor: onClick ? 'pointer' : '', ...parentStyle, ...parentStyles}} className={parentClass + ' ' + parentClasses} >
            <div style={svgStyles} className={"flex justify-center items-center truncate peer " + svgClasses}>
                {svg}
            </div>
            {
                (dataLang || customTooltip) && (
                    <div style={{...ttAlign, ...ttStyles}} className={ttClass} >
                        {
                        parentRef !== null &&
                        customTooltip ? (
                            customTooltip
                        ) : (
                                <SpanText dataLang={dataLang}/>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Tooltip;