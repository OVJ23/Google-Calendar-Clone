/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef, useEffect, useRef } from "react";
import "../../styles/EventPopup.css";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";

const EventPopup = forwardRef(({ event, position, onClose, onDelete, onEdit }, ref) => {
    const popupRef = ref || useRef(null);

    function formatTime(time) {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                console.log('handleClickOutside')
                e.stopPropagation()
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!event) return null;

    return (
        <div
            ref={popupRef}
            className="event-popup"
            style={{
                top: position.top,
                left: position.left
            }}
        >
            <div className="event-popup-header">
                <MdOutlineEdit
                    className="event-popup-edit"
                    onClick={onEdit}
                />
                <RiDeleteBinLine
                    className="event-popup-delete"
                    onClick={onDelete}
                />
            </div>
            <div className="event-popup-body">
                <h4>{event.title}</h4>
                <p>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                <p>{event.description || "No description"}</p>
            </div>
        </div>
    );
});

export default EventPopup;
