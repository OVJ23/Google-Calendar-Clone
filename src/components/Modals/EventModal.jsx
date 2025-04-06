/* eslint-disable react/prop-types */
import { EVENT_TYPES } from '../../static/constants';
import '../../styles/EventModal.css'
import { MdOutlineClose } from "react-icons/md";
import EventBody from '../EventModalsComponents/EventBody';
import { useEffect, useRef, useState } from 'react';
import { useEvent } from '../../contexts/EventContext';

function EventModal({ onClose, eventModalData = null }) {
    const eventModalRef = useRef(null)
    const { addEvent, updateEvent } = useEvent()
    const [eventInfo, setEventInfo] = useState({
        type: 'event',
        title: null,
        selectedDate: null,
        startTime: null,
        endTime: null,
        description: null,
        guests: [],
        repeat: 'Does not repeat',
    })

    function handleEventTitle(title) {
        setEventInfo(prev => ({
            ...prev,
            title
        }))
    }

    function closeEventModal() {
        // setIsModalOpen(false)
        onClose()
    }

    function convertDateObjToString() {
        setEventInfo(prev => ({
            ...prev,
            selectedDate: prev.selectedDate.toISOString(),
            startTime: prev.startTime.toISOString(),
            endTime: prev.endTime.toISOString()
        }))
    }

    function saveEvent() {
        console.log('saveEvent 1 - ', eventInfo)
        convertDateObjToString()
        // addEvent(eventInfo)

        if (eventModalData?.id) {
            updateEvent({ ...eventInfo, id: eventModalData.id });
        } else {
            console.log('saveEvent - ', eventInfo)
            addEvent(eventInfo);
        }

        // closeEventModal();
        closeEventModal()
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (eventModalRef.current && !eventModalRef.current.contains(e.target)) {
                closeEventModal();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        console.log('eventModalData - ', eventModalData)
        if (eventModalData) {
            setEventInfo({
                ...eventModalData,
                selectedDate: new Date(eventModalData.selectedDate),
                startTime: new Date(eventModalData.startTime),
                endTime: new Date(eventModalData.endTime)
            });
        }
    }, [eventModalData]);

    return (
        <>
            <div ref={eventModalRef} className="calendar-event-modal-component">
                <div className="event-modal-container">
                    <div className="event-modal-header">
                        <MdOutlineClose className='event-modal-close-icon' onClick={closeEventModal} />
                    </div>
                    <div className="event-modal-title-component">
                        <div className="event-modal-title-section">
                            <input
                                className='event-modal-title-input'
                                type="text"
                                placeholder='Add title'
                                value={eventInfo.title}
                                onChange={(event) => handleEventTitle(event.target.value)}
                            />
                        </div>
                    </div>
                    <div className="event-modal-types">
                        {EVENT_TYPES.map(option => (
                            <button key={option.eventName} className="event-modal-type">{option.eventName}</button>
                        ))}
                    </div>
                    <div className="event-modal-body">
                        <EventBody setEventInfo={setEventInfo} eventModalData={eventModalData} />
                    </div>
                    <div className="event-modal-footer">
                        <button className='event-modal-save-button' onClick={saveEvent}>Save</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventModal