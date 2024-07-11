import { useEffect, useRef } from "react";

const useDropping = (shake=true) => {

    const modalRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            const dataTranslateModal = modalRef.current;
            
            dataTranslateModal.style.transform = 'translateY(0)';
            dataTranslateModal.style.opacity = '1';
            dataTranslateModal.style.transition = 'transform 0.4s ease-in-out';
            if (shake) {
                setTimeout(() => {
                    dataTranslateModal.style.animation = 'shake 0.5s ease-in-out';
                    dataTranslateModal.style.animationIterationCount = '1';
                }, 400);
            };
        }, 200);
    }, []);

    return {
        modalRef,
    };
}
 
export default useDropping;