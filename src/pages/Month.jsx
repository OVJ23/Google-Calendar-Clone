/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import '../styles/Month.css'
import { WEEK_DAYS } from '../static/constants'
import { useEffect, useState, useMemo } from 'react'
import { useDate } from '../contexts/DateContext'
import { useEvent } from '../contexts/EventContext';
// import { MdOutlineClose } from "react-icons/md";
import EventPopup from '../components/Modals/EventPopup';
import MultipleEventsPopup from '../components/Modals/MultipleEventsPopup';
import { getEventsForDate } from '../utils/filterEvents.js';
import { handleDeleteEvent, handleEditEvent, handleEventClick, handleClosePopup } from '../utils/eventActions'

function Month() {
    // const popupRef = useRef(null);
    const { dateState, updateDate } = useDate()
    const { eventState, updateEvent, deleteEvent } = useEvent()
    const [monthRange, setMonthRange] = useState({ monthStartDate: null, monthEndDate: null, monthWeekStart: null, monthWeekEnd: null })
    const [daysCount, setDaysCount] = useState(0)
    const [maxVisibleEvents, setMaxVisibleEvents] = useState(3);
    const [popupData, setPopupData] = useState({ date: null, events: [], position: { top: 0, left: 0 } });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const [recentlyClosed, setRecentlyClosed] = useState(false);

    // Convert dateState.currentDate from ISO string to Date object once
    const currentDateObj = new Date(dateState.currentDate)

    function openPopup(date, events, event) {
        const daySection = event.target.closest('.month-day-section')
        const rect = daySection.getBoundingClientRect(); // Get button position
        setPopupData({
            date,
            events,
            position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX }
        });
    };

    function closePopup() {
        setPopupData({ date: null, events: [], position: { top: 0, left: 0 } });
    }

    function calculateMonthRange(date) {
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const monthWeekStart = new Date(monthStart)
        monthWeekStart.setDate(monthStart.getDate() - monthStart.getDay())
        monthWeekStart.setHours(0, 0, 0, 0)

        const monthWeekEnd = new Date(monthEnd)
        monthWeekEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()))
        monthWeekEnd.setHours(23, 59, 59, 999)

        return { monthStartDate: monthStart, monthEndDate: monthEnd, monthWeekStart, monthWeekEnd }
    }

    function updateMaxVisibleEvents() {
        const dayEventsSection = document.querySelector(".month-day-events");
        if (!dayEventsSection) return;

        const availableHeight = dayEventsSection.getBoundingClientRect().height;
        const eventHeight = 18;
        const moreButtonHeight = 18;

        // Calculate max events that fit within available height
        const maxEvents = Math.floor((availableHeight - moreButtonHeight) / eventHeight);
        setMaxVisibleEvents(maxEvents > 0 ? maxEvents : 1);
    };

    function formatTime(dateTime) {
        return new Date(dateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    // function handleEventClick(event, e) {
    //     const rect = e.target.getBoundingClientRect();
    //     setPopupPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    //     setSelectedEvent(event);
    // }

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

    function filterEventsForMonth() {
        if (!monthRange.monthWeekStart || !monthRange.monthWeekEnd) return [];

        // return Object.entries(eventState)
        // .filter(([id, event]) => {
        //     const eventDate = new Date(event.selectedDate);
        //     return eventDate >= new Date(monthRange.monthWeekStart) &&
        //     eventDate <= new Date(monthRange.monthWeekEnd);
        // })
        // .map(([id, event]) => ({ id, ...event }));

        const result = [];

        for (let d = new Date(monthRange.monthWeekStart); d <= monthRange.monthWeekEnd; d.setDate(d.getDate() + 1)) {
            const currentDate = new Date(d);
            const dayEvents = getEventsForDate(currentDate, eventState);
            dayEvents.forEach(event => {
                result.push({ ...event, instanceDate: currentDate.toISOString().split("T")[0] });
            });
        }

        return result;
    }

    function groupEventsByDay(events) {
        return events.reduce((acc, event) => {
            const dateKey = event.instanceDate || event.selectedDate.split("T")[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});
    }

    const filteredMonthEvents = useMemo(() => {
        if (!monthRange.monthWeekStart || !monthRange.monthWeekEnd) return [];
        const filteredEvents = filterEventsForMonth();
        return filteredEvents
    }, [monthRange, eventState]);
    const groupedEvents = groupEventsByDay(filteredMonthEvents);

    useEffect(() => {
        const timeDiff = monthRange?.monthWeekEnd - monthRange?.monthWeekStart + 1
        setDaysCount(Math.floor(timeDiff / (1000 * 60 * 60 * 24)))

        updateMaxVisibleEvents();
        window.addEventListener("resize", updateMaxVisibleEvents);

        return () => window.removeEventListener("resize", updateMaxVisibleEvents);
    }, [monthRange])

    useState(() => {
        setMonthRange(calculateMonthRange(currentDateObj))
    }, [dateState.currentDate])

    useEffect(() => {
        updateDate({ view: 'month' })
    }, [])

    return (
        <>
            <div className="calendar-month-component">
                <div className="month-header">
                    {
                        WEEK_DAYS.map(day => (
                            <div key={day} className="month-header-week-day">
                                {day}
                            </div>
                        ))
                    }
                </div>
                <div className="month-body" style={{ gridTemplateRows: `repeat(${daysCount / 7}, minmax(0, 1fr))` }}>
                    <div className="month-body">
                        {
                            Array.from({ length: Math.ceil(daysCount / 7) }, (_, rowIndex) => (
                                <div key={rowIndex} className="month-body-row">
                                    {Array.from({ length: 7 }, (_, colIndex) => {
                                        const dayIndex = rowIndex * 7 + colIndex;
                                        const cDate = new Date(monthRange.monthWeekStart);
                                        cDate.setDate(monthRange.monthWeekStart.getDate() + dayIndex);
                                        const dateKey = cDate.toISOString().split("T")[0];
                                        const eventsForDay = groupedEvents[dateKey] || [];

                                        return (
                                            <div key={colIndex} className="month-day-section">
                                                <div className="month-day-date">{cDate.getDate()}</div>
                                                <div className="month-day-events">
                                                    {eventsForDay.slice(0, maxVisibleEvents).map(event => (
                                                        <div
                                                            key={event.id}
                                                            className="month-event"
                                                            onClick={(e) => onEventClick(event, e)}
                                                        >
                                                            {formatTime(event.startTime)} {event.title}
                                                        </div>
                                                    ))}
                                                    {eventsForDay.length > maxVisibleEvents && (
                                                        <button
                                                            className="month-more-events"
                                                            onClick={(e) => openPopup(dateKey, eventsForDay, e)}
                                                        >
                                                            +{eventsForDay.length - maxVisibleEvents} more
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                    </div>
                    {popupData.date && (
                        <MultipleEventsPopup
                            date={popupData.date}
                            position={popupData.position}
                            events={popupData.events}
                            closePopup={closePopup}
                        />
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
                </div>
            </div>
        </>
    )
}

export default Month