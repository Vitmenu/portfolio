import Loading     from "./loading";
import useGetMedia from "../../ux/hooks/useGetMedia";

const Video = ({ objKey, wrapperClasses, contentClasses, loadingClasses, alt, }) => {
    const { media } = useGetMedia({ objKey });

    return media
        ? (
            <div className={"flex justify-center items-center " + wrapperClasses}>
                <video
                    src={media}
                    alt={alt}
                    className={"flex justify-center items-center w-full h-full border " + contentClasses}
                    controls
                />
            </div>
        ) : (
            <div className={"flex justify-center items-center relative " + wrapperClasses}>
                <Loading classes={"flex justify-center items-center w-full h-full " + loadingClasses} />
            </div>
        );
}
 
export default Video;