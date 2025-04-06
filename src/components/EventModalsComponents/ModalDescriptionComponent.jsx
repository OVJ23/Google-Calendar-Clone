/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
// import { MdOutlineFormatBold, MdOutlineFormatItalic, MdOutlineFormatUnderlined } from "react-icons/md";

function ModalDescriptionComponent({ setEventInfo }) {
    const [isEditable, setIsEditable] = useState(false);
    // const [textState, setTextState] = useState({ bold: false, italic: false, underline: false });
    const [description, setDescription] = useState('');
    const descriptionRef = useRef(null);

    function handleDescriptionClick() {
        setIsEditable((prev) => !prev);
    }

    // function handleToggleFormat(format) {
    //     setTextState((prevFormats) => ({
    //         ...prevFormats,
    //         [format]: !prevFormats[format],
    //     }));
    //     descriptionRef.current.focus();
    // }

    // useEffect(() => {
    //     console.log(textState);
    // }, [textState]);

    // Save and restore selection
    // const saveSelection = () => {
    //     const selection = window.getSelection();
    //     if (selection.rangeCount > 0) {
    //         return selection.getRangeAt(0);
    //     }
    //     return null;
    // };

    // const restoreSelection = (range) => {
    //     if (range) {
    //         const selection = window.getSelection();
    //         selection.removeAllRanges();
    //         selection.addRange(range);
    //     }
    // };

    // Handle input with inline styling
    const handleInput = () => {
        // event.preventDefault();

        // const range = saveSelection();
        // const span = document.createElement('span');
        // span.innerText = event.nativeEvent.data || '';

        // Apply styles
        // if (textState.bold) span.style.fontWeight = 'bold';
        // if (textState.italic) span.style.fontStyle = 'italic';
        // if (textState.underline) span.style.textDecoration = 'underline';

        // if (range) {
        //     range.deleteContents();
        //     range.insertNode(span);
        //     range.setStartAfter(span);
        //     range.setEndAfter(span);
        //     restoreSelection(range);
        // }

        setDescription(descriptionRef.current?.textContent || '');
    };

    useEffect(() => {
        setEventInfo(prev => ({
            ...prev,
            description
        }));
    }, [description])

    return (
        <>
            <div className="event-modal-description-component">
                {!isEditable ? (
                    <div className="modal-description-display" onClick={handleDescriptionClick}>
                        <p>Add Description</p>
                    </div>
                ) : (
                    <div className="modal-descriotion-edit">
                        <div className="modal-description-edit-options">
                            {/* <div
                                className={`modal-description-edit-option ${textState.bold ? 'modal-description-edit-option-active' : ''}`}
                                onClick={() => handleToggleFormat('bold')}
                            >
                                <MdOutlineFormatBold className="modal-description-edit-option-icon" />
                            </div>
                            <div
                                className={`modal-description-edit-option ${textState.italic ? 'modal-description-edit-option-active' : ''}`}
                                onClick={() => handleToggleFormat('italic')}
                            >
                                <MdOutlineFormatItalic className="modal-description-edit-option-icon" />
                            </div>
                            <div
                                className={`modal-description-edit-option ${textState.underline ? 'modal-description-edit-option-active' : ''}`}
                                onClick={() => handleToggleFormat('underline')}
                            >
                                <MdOutlineFormatUnderlined className="modal-description-edit-option-icon" />
                            </div> */}
                        </div>
                        <div
                            ref={descriptionRef}
                            className="modal-description-edit-input"
                            contentEditable={true}
                            // suppressContentEditableWarning={true}
                            onInput={handleInput}
                            placeholder="Add description"
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default ModalDescriptionComponent;
