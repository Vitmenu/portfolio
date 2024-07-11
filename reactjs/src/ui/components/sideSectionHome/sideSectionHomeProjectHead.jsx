import { Fragment } from "react";
import SpanText     from "../spanText";

const SideSectionHomeProjectHead = ({ title, period, members=['kjy']}) => {
    return (
        <div className="w-full flex flex-col h-full lg:flex-row lg:h-fit justify-start lg:justify-between items-start lg:items-center space-y-2">
            <span className="text-2xl lg:text-3xl font-normal">
                {title}
            </span>
            <div className="flex w-full justify-between md:w-fit md:justify-end h-full items-end space-x-2">
                <span className="text-xs">
                    {period}
                </span>
                {
                    members.map((ele, id) => (
                        <Fragment key={id}>
                            <SpanText dataLang={ele} classes={"text-sm"}/>
                            {
                                members[id + 1] !== undefined &&
                                ' '
                            }
                        </Fragment>
                    ))
                }
            </div>
        </div>
    );
};

export default SideSectionHomeProjectHead;