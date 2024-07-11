import { useRef, useEffect, useState } from "react";
import { useLocation }                 from "react-router-dom"
import * as svg                        from "../svgs";
import Tooltip                         from "../tooltip";
import SpanText                        from "../spanText";
import ModalTab                        from "../modalTab";
import { useGeneralContext }           from "../../../ux/contexts/general.context";
import useItemInput                    from "../../../ux/hooks/useItemInput";
import localConsole                    from "../../../ux/utils/localLog";
import { emitWSTyping }                from "../../../ux/contexts/ws.context";

const ChatBoardBottomLineUploadPhoto = () => {
    const { item, setItem, itemRef }    = useItemInput();
    const handleClickUploadImage = () => setItem(!item);
    const location = useLocation();
    return location.pathname !== '/' ? (
        <div className="hidden lg:flex items-end h-full border-[0.2rem] border-transparent py-2"
            ref={itemRef}
        >
            <div className="w-6 h-6">
                <Tooltip dataLang="sdnpht" svg={svg.addphoto} onClick={handleClickUploadImage} />
            </div>
            {
                item && (
                    <ModalTab parentRef={itemRef} translateX={"-1.35rem"} translateY={"-2.3rem"} styles={{width: '16rem'}}>
                        <div className="flex flex-col justify-start w-full h-64 p-4 space-y-4">
                            <div className="font-semibold">
                                <SpanText dataLang={'uppr'} />
                            </div>
                            <div className="font-light">
                                <SpanText dataLang={'prep'} />
                            </div>
                        </div>
                    </ModalTab>
                )
            }
        </div>
    ) : <></>;
};

const ChatBoardBottomLine = () => {
    const {
        text,
        currConv,
        handleSendMessage,
        handleCreateNewConversation,
    }                                   = useGeneralContext();
    const [ message, setMessage ]       = useState('');
    const textareaRef                   = useRef();
    const handleClickSend = async () => {
        if (message.trim().length < 1) {
            const messageInput = document.querySelector('[data-message-bar]');
            messageInput.style.outline = '0.2rem solid #6b7280';
            setTimeout(() => {
                if (document.activeElement === messageInput) messageInput.style.outline = '0.2rem solid #3b82f6';
                else messageInput.style.outline = '';
            }, 1000);
        } else {
            try {
                setMessage('');
                const targetConv = currConv
                    ? currConv
                    : await handleCreateNewConversation([]);
                await handleSendMessage(targetConv.id, message);
            } catch(err) {
                
                // Handle Sending Message Fail

                localConsole.log(err);
            }
        };
    };

    useEffect(() => {
        const textarea = textareaRef.current;

        const handleInputResizeTextarea = () => {
            textarea.style.height = '';
            textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
        };
        const handleKeyDownSendMessage = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleClickSend();
            };
        };

        textarea.addEventListener('input', handleInputResizeTextarea);
        textarea.addEventListener('keydown', handleKeyDownSendMessage);
        return () => {
            textarea.removeEventListener('input', handleInputResizeTextarea)
            textarea.removeEventListener('keydown', handleKeyDownSendMessage);
        };
    }, [message]);

    const handleMessageInputChange = (e) => {
        emitWSTyping();
        setMessage(e.target.value)
    };
    const handleMessageInputBlur = () => {
        const messageInput = document.querySelector('[data-message-bar]');
        messageInput.style.outline = '';
    };
    const handleMessageInputFocus = () => {
        const messageInput = document.querySelector('[data-message-bar]');
        messageInput.style.outline = '0.2rem solid #3b82f6';
    };
    return (
        <div className="w-full flex justify-between lg:justify-around items-end space-x-6 p-6 h-[7rem] min-h-[7rem]">
            <ChatBoardBottomLineUploadPhoto />
            <textarea
                ref={textareaRef}
                data-message-bar
                type="text"
                tabIndex={"0"}
                rows="1"
                maxLength={"255"}
                className="w-full h-[calc(100%-1rem)] px-4 py-3 overflow-scroll bg-gray-100 rounded-md resize-none outline-none outline-[0.2rem] outline-gray-200 z-10"
                value={message}
                placeholder={text ? text.sdnmsg : ''}
                onBlur={handleMessageInputBlur}
                onFocus={handleMessageInputFocus}
                onChange={handleMessageInputChange}
            />
            <div className="flex items-end h-full border-[0.2rem] border-transparent py-2">
                <div className="w-6 h-6">
                    <Tooltip
                        dataLang="sdnmsg"
                        svg={svg.send}
                        onClick={handleClickSend}
                        ttStyles={{transform: 'translate(-2rem, -2.25rem)'}}
                        svgStyles={{
                            transform: message.trim().length > 0 ? 'rotate(-0.125turn)' : '',
                            transition: message.trim().length > 0 ? 'transform 0.8s ease-out' : ''
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatBoardBottomLine;