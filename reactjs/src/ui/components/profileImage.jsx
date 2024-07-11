import useGetMedia  from "../../ux/hooks/useGetMedia"
import {
    imgModal,
    imgEditorModal,
} from "../../ux/events/cust-event";

const ProfileImage = ({ isThisUser, onClick, alt='unknown', contentClasses, loading='eager', image_key, defaultSvg, styles, classes, defaultClasses="w-7 h-7 min-w-7 min-h-7 rounded-full bg-white text-black flex justify-center items-center " }) => {

    const { media } = useGetMedia({ objKey: image_key });

    const handleClickZoomIn = () => imgModal({ media });
    const handleClickOpenEditorModal = () => imgEditorModal({ media })

    const handleClickProfile = () => {
        try {
            if (typeof onClick === 'function') {
                onClick();
            } else {
                if (isThisUser) {
                    handleClickOpenEditorModal();
                } else if (media) {
                    handleClickZoomIn();
                };
            };
        } catch(err) {
            console.log(err);
        };
    };
    
    return media ? (
        <div onClick={handleClickProfile} style={styles} className={defaultClasses + classes}>
            <img
                src={media}
                alt={alt}
                className={"flex justify-center items-center rounded-full w-full h-full cursor-pointer object-contain border " + contentClasses}
                loading={loading}
            />
        </div>
    ) : (
        <div onClick={handleClickProfile} style={styles} className={defaultClasses + classes}>
            {defaultSvg}
        </div>
    );
}
 
export default ProfileImage;