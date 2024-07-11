import { useState, useEffect } from "react";
import retrieve from "../utils/retrieve";

const useGetMedia = ({ objKey, dependencies=[] }) => {

    const [media, setMedia] = useState();

    useEffect(() => {
        if (objKey) {
            const path = `/api/mult/media?objKey=${objKey}`;
            const options = {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/plain',
                },
                credentials: 'include',
            };
            retrieve(path, options, async (res) => {
                if (res) {
                    const result = await res.text();
                    setMedia(result);
                };
            });
        };
    }, dependencies);

    return {
        media,
    };
}
 
export default useGetMedia;