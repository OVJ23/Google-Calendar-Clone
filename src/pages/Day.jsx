/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import '../styles/Day.css'
import { TIME_PERIODS } from '../static/constants'
import { useDate } from '../contexts/DateContext'
import { useEffect, useRef, useState } from 'react'
import EventModal from '../components/Modals/EventModal'
import { getEventsForDate } from '../utils/filterEvents.js';
import { useEvent } from '../contexts/EventContext'
import EventPopup from '../components/Modals/EventPopup';
import { handleDeleteEvent, handleEditEvent, handleEventClick, handleClosePopup } from '../utils/eventActions'

function Day() {
    const timeSlotRefs = useRef([])
    const dragOffsetRef = useRef(0);
    const { dateState, updateDate } = useDate()
    const { eventState, updateEvent, deleteEvent } = useEvent()
    const [eventPositions, setEventPositions] = useState(null)
    const [eventModalData, setEventModalData] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [recentlyClosed, setRecentlyClosed] = useState(false);
    // const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const HOUR_HEIGHT = 3 * 16;

    // Convert dateState.currentDate from ISO string to Date object once
    const currentDateObj = new Date(dateState.currentDate)

    function filterEventsByDate() {
        const filteredEvents = getEventsForDate(new Date(dateState.currentDate), eventState);
        return filteredEvents;
    }

    function getEventPosition(event) {
        // console.log('event - ', event)
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        // console.log('eventStart - ', eventStart, ' ; eventEnd - ', eventEnd)

        const startHour = eventStart.getHours() + eventStart.getMinutes() / 60;
        const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;
        // console.log('startHour - ', startHour, ' ; endHour - ', endHour)

        const top = startHour * HOUR_HEIGHT;
        const height = (endHour - startHour) * HOUR_HEIGHT;

        return { top, height };
    }

    function parsedEvents(events) {
        return events.map(event => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime)
        }))
    }

    function positionOverlappingEvents(events) {
        let updatedEvents = parsedEvents(events)
        // Sort events by start time, then by duration (longest first)
        const sortedEvents = [...updatedEvents].sort((a, b) => {
            if (a.startTime.getTime() !== b.startTime.getTime()) {
                return a.startTime - b.startTime;
            }
            return (b.endTime - b.startTime) - (a.endTime - a.startTime);
        });

        const positionedEvents = [];
        let activeOverlaps = [];

        sortedEvents.forEach(event => {
            // Remove events that are no longer overlapping
            activeOverlaps = activeOverlaps.filter(e => e.endTime > event.startTime);

            // Add the current event to the active overlapping group
            activeOverlaps.push(event);

            const totalOverlaps = activeOverlaps.length;

            // Assign positions equally: 0%, 25%, 50%, 75% for 4 events
            activeOverlaps.forEach((e, index) => {
                e.left = (index * (100 / totalOverlaps)); // Even spacing
                e.width = 100 / totalOverlaps; // Equal width for all overlapping events
                e.zIndex = index + 1; // Increase z-index from left to right
            });

            // console.log(event.title, ' - ', event.left, event.width, event.zIndex)

            positionedEvents.push(event);
        });

        return positionedEvents;
    }

    function handleTimeSlotClick(event, index) {
        if (!timeSlotRefs.current[index]) return;

        const slotRef = timeSlotRefs.current[index];
        const { top, height } = slotRef.getBoundingClientRect();
        const clickY = event.clientY - top;
        const percentage = clickY / height;

        let minutesOffset = 0;
        if (percentage >= 0.25 && percentage < 0.5) minutesOffset = 15;
        else if (percentage >= 0.5 && percentage < 0.75) minutesOffset = 30;
        else if (percentage >= 0.75) minutesOffset = 45;

        // const hour = TIME_PERIODS[index].replace(/[^\d]/g, ''); // Extracts digits (hour)
        // const period = TIME_PERIODS[index].replace(/\d/g, '');  // Extracts AM/PM
        // const startTime = `${hour}:${minutesOffset.toString().padStart(2, '0')} ${period}`;
        // const endTime = `${hour+1}:${minutesOffset.toString().padStart(2, '0')} ${period}`;

        // Extracting hour and AM/PM
        const [hour, period] = TIME_PERIODS[index].split(" ");
        let selectedHour = parseInt(hour.split(":")[0], 10);
        let selectedMinutes = minutesOffset;

        // Convert to 24-hour format for accurate calculations
        if (period === "PM" && selectedHour !== 12) selectedHour += 12;
        if (period === "AM" && selectedHour === 12) selectedHour = 0;

        // Creating Date objects for start and end times
        const startTime = new Date(currentDateObj);
        startTime.setHours(selectedHour, selectedMinutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 60); // 15-minute duration

        console.log(startTime, endTime)

        setEventModalData({ selectedDate: currentDateObj, startTime, endTime });
    }

    function handleDragStart(e, eventId) {
        const eventElement = e.target;
        const boundingRect = eventElement.getBoundingClientRect();
        e.dataTransfer.setData("eventId", eventId);
        dragOffsetRef.current = e.clientY - boundingRect.top;
        console.log('drag event - ', eventId, eventState[eventId])
        console.log('event spec - ', boundingRect, dragOffsetRef.current)
    }

    function handleDrop(e, index) {
        e.preventDefault();

        const eventId = e.dataTransfer.getData("eventId");
        if (!eventId) return;

        const eventData = eventState[eventId];
        const dayViewElement = document.querySelector(".day-body");
        const dayViewTop = dayViewElement.getBoundingClientRect().top;
        const scrollOffset = dayViewElement.scrollTop; // Now should be correct!

        // Calculate event's new top relative to the scrollable day view
        const eventTop = e.clientY - dragOffsetRef.current - dayViewTop + scrollOffset;
        console.log('eventTop - ', eventTop)

        const totalMinutesInDay = 24 * 60;
        const dayViewHeight = dayViewElement.scrollHeight; // Use total height
        const minutesPerPixel = totalMinutesInDay / dayViewHeight;

        let totalMinutes = Math.round(eventTop * minutesPerPixel);

        // Snap to nearest 15-minute slot
        totalMinutes = Math.round(totalMinutes / 15) * 15;

        const newStartTime = new Date(currentDateObj); // Get current date
        newStartTime.setHours(0, 0, 0, 0); // Reset to 12:00 AM

        // Add the newStartTime (minutes from 12 AM)
        newStartTime.setMinutes(totalMinutes);

        // Preserve event duration
        const eventDuration = new Date(eventData.endTime) - new Date(eventData.startTime);
        const newEndTime = new Date(newStartTime.getTime() + eventDuration);

        console.log('drop event - ', newStartTime, newEndTime)

        // Update the event in state
        updateEvent(eventId, {
            selectedDate: eventData.selectedDate,
            startTime: formatToLocalISOString(newStartTime),
            endTime: formatToLocalISOString(newEndTime)
        });
    }

    function handleModalClose() {
        setEventModalData(null)
    }

    function formatToLocalISOString(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, '0') + "-" +
            String(date.getDate()).padStart(2, '0') + "T" +
            String(date.getHours()).padStart(2, '0') + ":" +
            String(date.getMinutes()).padStart(2, '0') + ":" +
            String(date.getSeconds()).padStart(2, '0') + ".000000";
    }

    // function handleEventClick(event, e) {
    //     e.stopPropagation()
    //     if (recentlyClosed) return;

    //     if (event.id === selectedEvent?.id) {
    //         closeEventPopup()
    //         return
    //     }

    //     const rect = e.target.getBoundingClientRect();
    //     setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    //     setSelectedEvent(event);
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

    // function closeEventPopup() {
    //     setSelectedEvent(null);
    //     setPopupPosition(null);
    //     setRecentlyClosed(true);

    //     // Unlock after a short delay
    //     setTimeout(() => setRecentlyClosed(false), 200);
    // }

    function onClosePopup() {
        console.log('onClosePopup')
        handleClosePopup(setSelectedEvent, setPopupPosition, setRecentlyClosed)
    }

    useEffect(() => {
        updateDate({ view: 'day' })
    }, [])

    useEffect(() => {
        if (selectedEvent) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [selectedEvent]);

    useEffect(() => {
        const filtereEvents = filterEventsByDate()
        setEventPositions(positionOverlappingEvents(filtereEvents))
    }, [dateState.currentDate, eventState])

    return (
        <>
            <div className="calendar-day-component">
                <div className="day-header">
                    <div className="day-header-gmt">
                        GMT+05:30
                    </div>
                    <div className="day-header-timeline">
                        <p className="day-header-day">
                            {currentDateObj.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase()}
                        </p>
                        <div className="day-header-date">
                            {currentDateObj.getDate()}
                        </div>
                    </div>
                </div>
                <div className={`day-body ${selectedEvent ? 'no-scroll' : ''}`}>
                    <div className="day-body-time-section">
                        {
                            TIME_PERIODS.map((time, index) => (
                                <div key={index} className="day-body-time-group">
                                    {time}
                                </div>
                            ))
                        }
                    </div>
                    <div className="day-body-event-section">
                        <div className="day-body-event-partition-section">
                            {
                                Array.from({ length: TIME_PERIODS.length }, (_, index) => (
                                    <div key={index} className="day-body-event-partition"></div>
                                ))
                            }
                        </div>
                        <div className="day-body-event-info-main">
                            {
                                eventPositions && eventPositions.map((event) => {
                                    const { top, height } = getEventPosition(event);
                                    return (
                                        <div
                                            key={event.id}
                                            className="day-body-event-main"
                                            draggable="true"
                                            onDragStart={(e) => handleDragStart(e, event.id)}
                                            onClick={(e) => onEventClick(event, e)}
                                            style={{
                                                position: "absolute",
                                                top: `${top}px`,
                                                height: `${height}px`,
                                                left: `${event.left}%`,
                                                width: `${event.width}%`,
                                                zIndex: `${event.zIndex}`
                                            }}
                                        >
                                            {event.title}
                                        </div>
                                    );
                                })
                            }
                            <div className="day-body-event-info-section">
                                {
                                    Array.from({ length: TIME_PERIODS.length }, (_, index) => (
                                        <div
                                            key={index}
                                            ref={el => timeSlotRefs.current[index] = el}
                                            className="day-body-event-info"
                                            onClick={e => handleTimeSlotClick(e, index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, index)}
                                        ></div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {eventModalData && (
                <div className="event-modal-popup">
                    <EventModal onClose={handleModalClose} eventModalData={eventModalData} />
                </div>
            )}
            {selectedEvent &&
                <EventPopup
                    event={selectedEvent}
                    position={popupPosition}
                    onClose={onClosePopup}
                    onDelete={() =>
                        handleDeleteEvent(selectedEvent.id, deleteEvent, onClosePopup)
                    }
                    onEdit={() => {
                        handleEditEvent(eventState[selectedEvent.id], onClosePopup, setEventModalData)
                    }}
                />
            }
            {
                eventModalData &&
                <EventModal onClose={handleModalClose} eventModalData={eventModalData} />
            }
        </>
    )
}

export default Day