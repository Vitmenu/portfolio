import { useGeneralContext }            from "../../ux/contexts/general.context";
import LoadingTextSkeleton              from "./loadingTextSkeleton";

const SpanText = ({ dataLang, classes, isMesg }) => {
    const { text } = useGeneralContext();
    return isMesg ? (
        <span className={classes}>
            {
                (text && text['mesg'])
                ? text['mesg'][dataLang]
                : <LoadingTextSkeleton />
            }
        </span>
    ) : (
        <span className={classes}>
            {
                text
                ? text[dataLang]
                : <LoadingTextSkeleton />
            }
        </span>
    );
};
 
export default SpanText;