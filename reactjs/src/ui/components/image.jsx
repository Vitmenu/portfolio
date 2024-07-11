import Loading      from "./loading";
import useGetMedia  from "../../ux/hooks/useGetMedia";
import { imgModal } from "../../ux/events/cust-event";

const Image = ({ objKey, wrapperClasses, contentClasses, loadingClasses, alt, loading="lazy", }) => {
    const { media } = useGetMedia({ objKey });
    const handleClickZoomIn = () => imgModal({ media });

    return media ? (
        <div className={"flex justify-center items-center " + wrapperClasses}>
            <img
                onClick={handleClickZoomIn}
                src={media}
                alt={alt}
                className={"flex justify-center items-center w-full h-full cursor-pointer object-contain " + contentClasses}
                loading={loading}
            />
        </div>
    ) : (
        <div className={"flex justify-center items-center relative " + wrapperClasses}>
            <Loading classes={"flex justify-center items-center w-full h-full " + loadingClasses} />
        </div>
    );
}
 
export default Image;