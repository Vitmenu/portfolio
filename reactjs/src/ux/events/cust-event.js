export const imgModal = ({ media } = {}) => {
    try {
        const custEvent = new CustomEvent('cust-img-modal', {
            detail: {
                imgUrl: media,
            },
        });
        return dispatchEvent(custEvent);
    } catch(err) {
        return false;
    };
};
export const imgEditorModal = ({ media } = {}) => {
    try {
        const custEvent = new CustomEvent('cust-img-editor-modal', {
            detail: {
                imgUrl: media,
            },
        });
        dispatchEvent(custEvent);
    } catch(err) {
        return false;
    };
};