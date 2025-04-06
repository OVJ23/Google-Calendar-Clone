/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import '../styles/Week.css'
import { TIME_PERIODS, WEEK_DAYS } from '../static/constants'
import { useDate } from '../contexts/DateContext'
import { useState, useEffect, useRef } from 'react'
import EventModal from '../components/Modals/EventModal'
import { getEventsForDate } from '../utils/filterEvents.js';
import { useEvent } from '../contexts/EventContext'
import EventPopup from '../components/Modals/EventPopup';
import { handleDeleteEvent, handleEditEvent, handleEventClick, handleClosePopup } from '../utils/eventActions'

function Week() {
    const timeSlotRefs = useRef([])
    const dragOffsetRef = useRef(0); // Stores the offset where the event is grabbed
    const { dateState, updateDate } = useDate()
    const { eventState, updateEvent, deleteEvent } = useEvent()
    const [weekRange, setWeekRange] = useState({ weekStartDate: null, weekEndDate: null })
    const [weekEvents, setWeekEvents] = useState([])
    const [eventPositions, setEventPositions] = useState([])
    const [eventModalData, setEventModalData] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [recentlyClosed, setRecentlyClosed] = useState(false);
    const HOUR_HEIGHT = 3 * 16;

    // Convert dateState.currentDate from ISO string to Date object once
    const currentDateObj = new Date(dateState.currentDate)

    function calculateWeekRange(date) {
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        weekStart.setHours(0, 0, 0, 0)

        const weekEnd = new Date(date)
        weekEnd.setDate(date.getDate() + (6 - date.getDay()))
        weekEnd.setHours(23, 59, 59, 999)

        return { weekStartDate: weekStart, weekEndDate: weekEnd }
    }

    function parsedEvents(events) {
        return events.map(event => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime)
        }))
    }

    // function positionOverlappingEvents(events) {
    //     let updatedEvents = parsedEvents(events)
    //     updatedEvents.sort((a, b) => {
    //         if (a.startTime.getTime() === b.startTime.getTime()) {
    //             return (b.endTime - b.startTime) - (a.endTime - a.startTime)
    //         }
    //         return a.startTime - b.startTime
    //     })

    //     let positionedEvents = []

    //     updatedEvents.forEach((event, index) => {
    //         let overlappingEvents = []

    //         for (let i = 0; i < index; i++) {
    //             if (updatedEvents[i].endTime > event.startTime) {
    //                 overlappingEvents.push(updatedEvents[i])
    //             }
    //         }

    //         const overlapCount = overlappingEvents.length
    //         const totalSlots = overlapCount + 1
    //         const width = 100 / totalSlots
    //         const left = width * overlappingEvents.length
    //         // const dayIndex = event.startTime.getDay()

    //         positionedEvents.push({
    //             ...event,
    //             left,
    //             width,
    //             zIndex: overlappingEvents.length + 1,
    //             // dayIndex
    //         })
    //     })

    //     return positionedEvents
    // }

    function positionOverlappingEvents(events) {
        const eventsByDay = new Map();

        // Group by dayIndex
        events.forEach(event => {
            if (!eventsByDay.has(event.dayIndex)) {
                eventsByDay.set(event.dayIndex, []);
            }
            eventsByDay.get(event.dayIndex).push(event);
        });

        let positionedEvents = [];

        for (let [dayIndex, dayEvents] of eventsByDay.entries()) {
            let updatedEvents = parsedEvents(dayEvents);

            // Sort by start time, then longer duration
            updatedEvents.sort((a, b) => {
                if (a.startTime.getTime() === b.startTime.getTime()) {
                    return (b.endTime - b.startTime) - (a.endTime - a.startTime);
                }
                return a.startTime - b.startTime;
            });

            updatedEvents.forEach((event, index) => {
                let overlappingEvents = [];

                for (let i = 0; i < index; i++) {
                    if (updatedEvents[i].endTime > event.startTime) {
                        overlappingEvents.push(updatedEvents[i]);
                    }
                }

                const overlapCount = overlappingEvents.length;
                const totalSlots = overlapCount + 1;
                const width = 100 / totalSlots;
                const left = width * overlappingEvents.length;

                positionedEvents.push({
                    ...event,
                    left,
                    width,
                    zIndex: overlapCount + 1,
                    dayIndex,
                });
            });
        }

        return positionedEvents;
    }

    function filterEventsByWeek() {
        if (!weekRange.weekStartDate || !weekRange.weekEndDate) return [];
        // console.log('weekRange - ', typeof weekRange.weekStartDate)
        // const weekStartStr = weekRange.weekStartDate.toISOString().split("T")[0];
        // const weekEndStr = weekRange.weekEndDate.toISOString().split("T")[0];

        // return Object.entries(eventState)
        //     .filter(([id, event]) => {
        //         const eventDateStr = event.selectedDate.split("T")[0];
        //         return eventDateStr >= weekStartStr && eventDateStr <= weekEndStr;
        //     })
        //     .map(([id, event]) => ({ id, ...event }));

        const result = [];

        for (let i = 0, d = new Date(weekRange.weekStartDate); d <= weekRange.weekEndDate; i++, d.setDate(d.getDate() + 1)) {
            const currentDate = new Date(d);
            const dayEvents = getEventsForDate(currentDate, eventState);
            // result.push(...dayEvents);

            // Attach dayIndex for rendering
            const dayIndex = i; // 0 to 6 (Sunday to Saturday or however your week is defined)
            dayEvents.forEach(event => {
                result.push({ ...event, dayIndex });
            });
        }

        console.log('result events - ', result)
        return result

        // Remove duplicates (events that repeat across days)
        // const uniqueEvents = new Map();
        // result.forEach(event => {
        //     uniqueEvents.set(event.id, event);
        // });

        // return Array.from(uniqueEvents.values());
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

    function handleModalClose() {
        setEventModalData(null)
    }

    function handleWeekSlotClick(event, dayIndex, timeIndex) {
        if (!timeSlotRefs.current[dayIndex][timeIndex]) return;

        const slotRef = timeSlotRefs.current[dayIndex][timeIndex];
        const { top, height } = slotRef.getBoundingClientRect();
        const clickY = event.clientY - top;
        const percentage = clickY / height;

        let minutesOffset = 0;
        if (percentage >= 0.25 && percentage < 0.5) minutesOffset = 15;
        else if (percentage >= 0.5 && percentage < 0.75) minutesOffset = 30;
        else if (percentage >= 0.75) minutesOffset = 45;

        // Get selected hour and AM/PM
        const [hour, period] = TIME_PERIODS[timeIndex].split(" ");
        let selectedHour = parseInt(hour.split(":")[0], 10);
        let selectedMinutes = minutesOffset;

        if (period === "PM" && selectedHour !== 12) selectedHour += 12;
        if (period === "AM" && selectedHour === 12) selectedHour = 0;

        // Calculate date based on clicked day
        const selectedDate = new Date(weekRange.weekStartDate);
        selectedDate.setDate(selectedDate.getDate() + dayIndex);

        // Create Date objects for start and end times
        const startTime = new Date(selectedDate);
        startTime.setHours(selectedHour, selectedMinutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 60);

        setEventModalData({ selectedDate: selectedDate, startTime, endTime });
    }

    function handleDragStart(e, eventId) {
        const eventElement = e.target;
        const boundingRect = eventElement.getBoundingClientRect();
        e.dataTransfer.setData("eventId", eventId);
        dragOffsetRef.current = e.clientY - boundingRect.top;
        console.log('drag event - ', eventId, eventState[eventId])
        console.log('event spec - ', boundingRect, dragOffsetRef.current)
    }

    function handleDrop(e, dayIndex, hourIndex) {
        e.preventDefault();

        const eventId = e.dataTransfer.getData("eventId");
        if (!eventId) return;

        const eventData = eventState[eventId];

        const weekViewElement = document.querySelector(".week-body");
        const weekViewTop = weekViewElement.getBoundingClientRect().top;
        const scrollOffset = weekViewElement.scrollTop;

        // Correct event's new top relative to the week view
        const eventTop = e.clientY - dragOffsetRef.current - weekViewTop + scrollOffset;

        const totalMinutesInDay = 24 * 60;
        const weekViewHeight = weekViewElement.scrollHeight; // Divide by 7 days
        const minutesPerPixel = totalMinutesInDay / weekViewHeight;

        let totalMinutes = Math.round(eventTop * minutesPerPixel);
        totalMinutes = Math.round(totalMinutes / 15) * 15; // Snap to 15 min slot

        // Calculate date based on clicked day
        const selectedDate = new Date(weekRange.weekStartDate);
        selectedDate.setDate(selectedDate.getDate() + dayIndex);

        const newStartTime = new Date(selectedDate); // Get current date
        newStartTime.setHours(0, 0, 0, 0); // Reset to 12:00 AM

        console.log('totalMins - ', totalMinutes)
        // Add the newStartTime (minutes from 12 AM)
        newStartTime.setMinutes(totalMinutes);

        // Preserve event duration
        const eventDuration = new Date(eventData.endTime) - new Date(eventData.startTime);
        const newEndTime = new Date(newStartTime.getTime() + eventDuration);

        console.log(selectedDate, newStartTime, newEndTime)
        // Update the event in state
        updateEvent(eventId, {
            selectedDate: formatToLocalISOString(selectedDate),
            startTime: formatToLocalISOString(newStartTime),
            endTime: formatToLocalISOString(newEndTime)
        });
    }

    function formatToLocalISOString(date) {
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, '0') + "-" +
            String(date.getDate()).padStart(2, '0') + "T" +
            String(date.getHours()).padStart(2, '0') + ":" +
            String(date.getMinutes()).padStart(2, '0') + ":" +
            String(date.getSeconds()).padStart(2, '0') + ".000000";
    }

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
        updateDate(weekRange)
        const filteredEvents = filterEventsByWeek()
        setWeekEvents(filteredEvents)
    }, [weekRange])

    useEffect(() => {
        // console.log('weekRange - ', weekRange)
        // console.log('weekEvents - ', weekEvents)
        setEventPositions(positionOverlappingEvents(weekEvents))
    }, [weekEvents])

    useEffect(() => {
        setWeekRange(calculateWeekRange(currentDateObj))
    }, [dateState.currentDate, eventState])

    useEffect(() => {
        updateDate({ view: 'week' })
    }, [])

    return (
        <>
            <div className="calendar-week-component">
                <div className="week-header">
                    <div className="week-header-gmt">
                        GMT+05:30
                    </div>
                    <div className="week-header-partition"></div>
                    <div className="week-header-timeline">
                        <div className="week-header-timeline-days">
                            <div className="week-header-timeline-day">
                                {
                                    WEEK_DAYS.map((day) => (
                                        <p key={day} className="week-header-day">
                                            {day}
                                        </p>
                                    ))
                                }
                            </div>
                            <div className="week-header-timeline-date">
                                {
                                    Array.from({ length: WEEK_DAYS.length }, (_, index) => {
                                        const cDate = new Date(weekRange.weekStartDate);
                                        cDate.setDate(weekRange.weekStartDate?.getDate() + index);
                                        return (
                                            <div key={index + weekRange.weekStartDate} className="week-header-date">
                                                {cDate.getDate()}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="week-header-timline-events">
                            {
                                WEEK_DAYS.map((day) => (
                                    <div key={day} className="week-header-timeline-week-event">

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={`week-body ${selectedEvent ? 'no-scroll' : ''}`}>
                    <div className="week-body-time-section">
                        {
                            TIME_PERIODS.map((time, index) => (
                                <div key={index} className="week-body-time-group">
                                    {time}
                                </div>
                            ))
                        }
                    </div>
                    <div className="week-body-event-section">
                        <div className="week-body-event-partition-section">
                            {
                                Array.from({ length: TIME_PERIODS.length }, (_, index) => (
                                    <div key={index} className="week-body-event-partition"></div>
                                ))
                            }
                        </div>
                        <div className="week-body-event-info-main">
                            <div className="week-body-event-info-section">
                                {
                                    WEEK_DAYS.map((day, dayIndex) => {
                                        // console.log('post - ', eventPositions)
                                        const eventsForDay = eventPositions.filter(event => event.dayIndex === dayIndex);
                                        // console.log('eventsForDay - ', eventsForDay)
                                        return (
                                            <div
                                                key={day}
                                                className="week-body-event-info-section-day"
                                                style={{
                                                    position: "relative",
                                                    width: `${100 / 7}%` // Ensures each day column gets equal width
                                                }}
                                            >

                                                {
                                                    eventsForDay.map((event) => {
                                                        const { top, height } = getEventPosition(event);
                                                        return (
                                                            <div
                                                                key={event.id}
                                                                className="week-body-event-main"
                                                                draggable="true"
                                                                onDragStart={(e) => handleDragStart(e, event.id)}
                                                                onClick={(e) => onEventClick(event, e)}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: `${top}px`,
                                                                    left: `${event.left}%`,
                                                                    height: `${height}px`,
                                                                    width: `${event.width}%`,
                                                                    zIndex: `${event.zIndex}`
                                                                }}
                                                            >
                                                                {event.title}
                                                            </div>
                                                        );
                                                    })
                                                }
                                                {
                                                    Array.from({ length: TIME_PERIODS.length }, (_, index) =>
                                                    (
                                                        <div
                                                            key={`${day}-${index}`}
                                                            className="week-body-event-info"
                                                            ref={el => {
                                                                if (!timeSlotRefs.current[dayIndex]) {
                                                                    timeSlotRefs.current[dayIndex] = [];
                                                                }
                                                                timeSlotRefs.current[dayIndex][index] = el;
                                                            }}
                                                            onClick={e => handleWeekSlotClick(e, dayIndex, index)}
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={(e) => handleDrop(e, dayIndex, index)}
                                                        ></div>
                                                    ))
                                                }
                                            </div>
                                        );
                                    })
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
                    onDelete={() => handleDeleteEvent(selectedEvent.id, deleteEvent, onClosePopup)}
                    onEdit={() => handleEditEvent(selectedEvent.id, updateEvent, onClosePopup)}
                />
            }
        </>
    )
}

export default Week