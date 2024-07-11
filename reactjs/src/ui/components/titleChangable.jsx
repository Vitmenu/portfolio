import { useEffect }                           from "react";
import useItemInput                            from "../../ux/hooks/useItemInput";

const TitleChangable = ({ titleId, title, setTitle, changedTitle, setChangedTitle, handleUpdate, onClick, nameboard, styles, classes }) => {

    const { item, setItem, itemRef } = useItemInput();

    const onChangeChangeTitle = (e) => {
        setChangedTitle(e.target.value);
    };
    const onClickChangeTitle = () => {
        typeof onClick === 'function' && onClick();
        setItem(true);
    };

    useEffect(() => {
        if (item) {
            const onPressEnter = (e) => e.key.toLowerCase() === 'enter' && setItem(false);
            itemRef.current.querySelector('input').focus();
            document.addEventListener('keydown', onPressEnter);
            
            return () => document.removeEventListener('keydown', onPressEnter);
        } else {
            if (changedTitle === title) {
                return;
            } else {
                setTitle(changedTitle);
                handleUpdate(changedTitle, title);
            };
        };
    }, [item]);

    return (
        <div data-title-id={titleId} ref={itemRef} onClick={onClickChangeTitle} style={{width: '6rem', ...styles}} className={classes}>
            {
                item ? (
                    <input type="text" value={changedTitle} onChange={onChangeChangeTitle} className="flex justify-start w-full h-full"/>
                ) : (
                    nameboard
                )
            }
        </div>
    );
}
 
export default TitleChangable;