/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { WEEK_DAYS } from '../../static/constants'
import { MdOutlineClose } from "react-icons/md";
import EventPopup from './EventPopup';
import { handleDeleteEvent, handleEditEvent, handleEventClick, handleClosePopup } from '../../utils/eventActions'
import { useEvent } from '../../contexts/EventContext';

function MultipleEventsPopup({ date, position, events, closePopup }) {
    const popupRef = useRef(null);
    const eventPopupRef = useRef(null);
    const { updateEvent, deleteEvent } = useEvent()
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [recentlyClosed, setRecentlyClosed] = useState(false);

    function formatTime(dateTime) {
        return new Date(dateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    // function handleEventClick(event, e) {
    //     const rect = e.target.getBoundingClientRect();
    //     setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    //     setSelectedEvent(event);
    // };

    // function closeEventPopup() {
    //     setSelectedEvent(null);
    // }

    function onEventClick(event, e) {
        handleEventClick(
            event,
            selectedEvent,
            setSelectedEvent,
            setPopupPosition,
            () => handleClosePopup(setSelectedEvent, setPopupPosition),
            recentlyClosed,
            e
        );
    }

    function onClosePopup() {
        handleClosePopup(setSelectedEvent, setPopupPosition, setRecentlyClosed)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current &&
                !popupRef.current.contains(event.target) &&
                eventPopupRef.current &&
                !eventPopupRef.current.contains(event.target)
            ) {
                closePopup();
            }
        }

        if (date) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [date]);

    return (
        <>
            <div
                ref={popupRef}
                className="more-events-popup"
                style={{ top: position.top, left: position.left }}
            >
                <div className="event-popup-header">
                    <div className="popup-event-header-date-info">
                        <p className='popup-event-header-day'>{WEEK_DAYS[(new Date(date)).getDay()]}</p>
                        <p className='popup-event-header-date'>{(new Date(date)).getDate()}</p>
                    </div>
                    <div className="popup-close-button">
                        <MdOutlineClose className="popup-close-icon" onClick={closePopup} />
                    </div>
                </div>
                <div className="popup-events-list">
                    {events.length > 0 ?
                        (
                            events.map(event => (
                                <div key={event.id} className="popup-event" onClick={(e) => onEventClick(event, e)}>
                                    {formatTime(event.startTime)} {event.title}
                                </div>
                            ))
                        )
                        : (
                            <p> There are no events scheduled on this day.</p>
                        )
                    }
                </div>
            </div >
            {selectedEvent && <EventPopup
                ref={eventPopupRef}
                event={selectedEvent}
                position={popupPosition}
                onClose={onClosePopup}
                onDelete={() => handleDeleteEvent(selectedEvent.id, deleteEvent, onClosePopup)}
                onEdit={() => handleEditEvent(selectedEvent.id, updateEvent, onClosePopup)}
            />
            }
        </>
    )
}

export default MultipleEventsPopup