import { useState }              from "react";
import Tooltip                   from "../tooltip";
import * as svg                  from "../svgs";
import SpanText                  from "../spanText";
import SideSectionHomeResumeItem from "../sideSectionHome/sideSectionHomeResumeItem";
import retrieve                  from "../../../ux/utils/retrieve";
import useDropping               from "../../../ux/hooks/useDropping";

const ImageEditor = ({ img, setImg, thisUser, setItem }) => {

    const [prvImage, setPrvImage] = useState(img);
    const [newImage, setNewImage] = useState(img);
    const [status, setStatus]     = useState(0);
    const [message, setMessage]   = useState();
    
    const { modalRef } = useDropping(false);

    const handleCloseItem = () => setItem(false);

    const handleImageUploaded = (e) => {
        setMessage();

        const file = e.target.files[0];

        if (file && file.size < 1024 * 1024 * 5) {

            setNewImage({
                url: URL.createObjectURL(file),
                file: file,
            });

        } else {
            setMessage('tbf');
        };
    };

    const handleClickDelete = () => setNewImage();

    const handleClickSave = async () => {

        if (prvImage !== newImage && status === 0) {

            const clearStatus = async (res) => {
                if (res) {
                    setStatus(2);
                    setTimeout(() => setStatus(0), 2000);
                } else {
                    setStatus(4);
                    setMessage('dcl');
                    setTimeout(() => setStatus(0), 2000);
                };
            };

            setStatus(1);

            if (newImage) {
                const allowedContentTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (newImage.file instanceof File && allowedContentTypes.includes(newImage.file.type)) {
        
                    const formData = new FormData();
        
                    formData.append('image', newImage.file)
                    formData.append('entity', JSON.stringify({
                        field: 'user',
                        param: thisUser,
                    }));
        
                    // console.log(newImage.file);
                    await retrieve('/api/mult/media/upload', {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                    }, clearStatus);
                };
            } else {

                await retrieve('/api/mult/media/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        entityField: 'user',
                        entityId: thisUser.id,
                    }),
                }, clearStatus);
            };
        };

    };

    return (
        <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur">
            <div onClick={handleCloseItem} className="absolute top-0 right-0 w-16 h-16 flex justify-center items-center">
                <div className="w-6 h-6 cursor-pointer">
                    <Tooltip dataLang={"cls"} svg={svg.close} align="bottom"/>
                </div>
            </div>
            <div ref={modalRef} className="flex justify-center items-start w-4/5 h-4/5 border md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3 bg-white rounded -translate-y-80 opacity-0">
                <div className="w-full h-full flex flex-col divide-y lg:divide-y-0 lg:flex-row lg:divide-x">
                    <div className="w-full h-full lg:w-1/3 lg:h-full flex flex-col justify-start items-center p-8 gap-y-8 overflow-y-scroll">
                        <div className="w-[10rem] md:w-[14rem] max-w-[10rem] md:max-w-[14rem] h-[10rem] md:h-[14rem] max-h-[10rem] md:max-h-[14rem] object-contain rounded-full border relative flex items-center justify-center">
                            {
                                (newImage) ? (
                                    <img
                                        src={(newImage && newImage.url) ? newImage.url : img}
                                        alt={'image'}
                                        className={"w-[10rem] md:w-[14rem] max-w-[10rem] md:max-w-[14rem] h-[10rem] md:h-[14rem] max-h-[10rem] md:max-h-[14rem] object-contain rounded-full border relative flex items-center justify-center"}
                                    />
                                ) : (
                                    <div className="w-full h-full">
                                        {svg.profile}
                                    </div>
                                )
                            }
                            <input
                                id="user-profile-input"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                onChange={handleImageUploaded}
                                hidden
                            />
                            <label htmlFor="user-profile-input" className="rounded-lg w-1/4 md:w-1/5 flex justify-center items-center bg-white p-1 cursor-pointer absolute bottom-0 border right-0 peer/change z-10">
                                {svg.edit}
                            </label>
                            <div className="absolute bottom-0 right-0 peer-hover/change:opacity-100 opacity-0 duration-500 translate-y-2 peer-hover/change:translate-y-8">
                                <span className="text-wrap -z-50 noselect text-xs bg-white rounded shadow px-2 py-1">
                                    Change profile photo
                                </span>
                            </div>
                            {
                                (newImage) && (
                                    <>
                                        <div onClick={handleClickDelete} className="rounded-lg w-1/4 md:w-1/5 flex justify-center items-center bg-white text-red-500 border-red-500 p-1 cursor-pointer absolute top-0 border-2 right-0 peer/delete z-10">
                                            {svg.eraser}
                                        </div>
                                        <div className="absolute top-0 right-0 peer-hover/delete:opacity-100 opacity-0 duration-500 translate-y-6 peer-hover/delete:translate-y-12">
                                            <span className="text-wrap -z-50 noselect text-xs bg-white rounded shadow px-2 py-1">
                                                Delete profile photo
                                            </span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <div className="flex flex-col w-full h-full space-y-6">
                            <div className="flex flex-col w-full">
                                <div className="font-medium">
                                    Name:
                                </div>
                                <div>
                                    {thisUser.name}
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="font-medium">
                                    Company:
                                </div>
                                <div>
                                    {thisUser.company}
                                </div>
                            </div>
                            <div className="flex flex-col items-end justify-end w-full h-full space-y-4">
                                <div className="w-full flex justify-end">
                                    {
                                        message && (
                                            <SpanText dataLang={message} classes={"w-full text-right font-light text-red-500 text-sm"} isMesg={true}/>
                                        )
                                    }
                                </div>
                                <div
                                    onClick={handleClickSave}
                                    className={
                                        "noselect rounded text-white px-4 py-2 duration-200 " +
                                        (
                                            (prvImage !== newImage && status === 0) ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : 
                                            (status !== 0) ? "bg-blue-500 cursor-default" : "bg-gray-400 cursor-default"
                                        )
                                    }
                                >
                                    <SpanText dataLang={
                                        status == 0 ? "wsnw" : 
                                        status == 1 ? "lodn" :
                                        status == 2 ? "savd" :
                                        status == 4 && "erro"
                                    } />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden w-0 h-0 lg:w-2/3 lg:h-full lg:flex flex-col justify-start items-center p-8 space-y-8">
                        <div className="w-full h-1/2 flex flex-col">
                            {svg.welcome}
                        </div>
                        <div className="w-full h-1/2 flex flex-col">
                            <SideSectionHomeResumeItem titleLang={"wcpf"} listItemLangs={["li1", "li2", "li3"]}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default ImageEditor;