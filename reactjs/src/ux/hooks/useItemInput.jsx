import { useState, useEffect, useRef } from "react";

const useItemInput = (preObject, postObject) => {
    const [item, setItem] = useState(false);
    const itemRef = useRef(null);
    const onClickEvent = (e) => {
        if (itemRef.current && !itemRef.current.contains(e.target)) {
            setItem(false);
        };
    };
    useEffect(() => {
        if (item) {
            document.addEventListener('mousedown', onClickEvent);
        };
        return () => {
            document.removeEventListener('mousedown', onClickEvent);
        };
    }, [item]);

    return {
        item,
        setItem,
        itemRef,
    };
}
 
export default useItemInput;