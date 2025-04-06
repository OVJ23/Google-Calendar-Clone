/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import '../styles/Year.css'
import { MONTHS } from '../static/constants'
import MonthCalendar from '../components/Common/MonthCalendar'
import { useEffect, useState } from 'react'
import { useDate } from '../contexts/DateContext'
import MultipleEventsPopup from '../components/Modals/MultipleEventsPopup'
import { useEvent } from '../contexts/EventContext'
import { getEventsForDate } from '../utils/filterEvents.js'
import { handleDeleteEvent, handleEditEvent, handleEventClick, handleClosePopup } from '../utils/eventActions'

function Year() {
    const { dateState, updateDate } = useDate()
    const { eventState, updateEvent, deleteEvent } = useEvent()
    const [selectedDate, setSelectedDate] = useState(null);
    const [popupPosition, setPopupPosition] = useState(null);

    // Convert dateState.currentDate from ISO string to Date object once
    const currentDateObj = new Date(dateState.currentDate)

    function handleDateClick(date, event) {
        setSelectedDate(date)
        setPopupPosition({ top: event.clientY, left: event.clientX })
    }

    function filteredYearEvents() {
        // const targetDateStr = selectedDate.toLocaleDateString('en-CA');;

        // return Object.entries(eventState)
        //     .filter(([id, event]) => {
        //         return targetDateStr === event.selectedDate.split("T")[0];
        //     })
        //     .map(([id, event]) => ({ id, ...event }));
        const filteredEvents = getEventsForDate(new Date(selectedDate), eventState);
        return filteredEvents;
    }

    const filteredEvents = selectedDate ? filteredYearEvents() : []

    useEffect(() => {
        updateDate({ view: 'year' })
    }, [])
    return (
        <>
            <div className="calendar-year-component">
                {
                    MONTHS.map((month, index) => (
                        <div key={month} className="year-month-section">
                            <div className="year-month-section-title">
                                {month}
                            </div>
                            <div className="year-month-section-dates">
                                <MonthCalendar year={currentDateObj.getFullYear()} monthIndex={index} handleDateClick={handleDateClick} />
                            </div>
                        </div>
                    ))
                }
                {selectedDate && (
                    <>
                        <MultipleEventsPopup
                            date={selectedDate}
                            position={popupPosition}
                            events={filteredEvents}
                            closePopup={() => {
                                setSelectedDate(null)
                            }}
                        />
                    </>
                )}
            </div>
        </>
    )
}

export default Year