/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import '../../styles/EventModal.css'
import { MdArrowDropDown } from "react-icons/md";
import { FULL_WEEK_DAYS, MONTHS } from '../../static/constants';
import { useDate } from '../../contexts/DateContext';
import MonthTab from '../Common/MonthTab';

function oldModalTimeComponent({ setEventInfo, eventInfo }) {
    const { dateState } = useDate()
    const endDropdownRef = useRef(null)
    const startDropdownRef = useRef(null)
    const dateDropdownRef = useRef(null)
    const repeatOptionsDropdownRef = useRef(null)
    const [isEditable, setIsEditable] = useState(false)
    const [showDropdown, setShowDropdown] = useState(null)
    const [eventDetails, setEventDetails] = useState({
        startTime: eventInfo?.startTime || getRoundedTime(0),
        endTime: eventInfo?.endTime || getRoundedTime(60),
        selectedDate: eventInfo?.selectedDate || new Date(dateState.currentDate),
        repeatOption: eventInfo?.repeatOption || 'Does not repeat',
    });

    const repeatLabels = useMemo(() => getRepeatLabels(eventDetails.selectedDate), [eventDetails.selectedDate]);

    function getRepeatLabels(date) {
        console.log('getRepeatLabels - ', eventInfo)
        const weekday = FULL_WEEK_DAYS[date.getDay()];
        const day = date.getDate();
        const month = MONTHS[date.getMonth()];

        return {
            none: 'Does not repeat',
            daily: 'Daily',
            weekly: Weekly on ${ weekday },
        annually: Annually on ${ month } ${ day },
        weekdays: 'Every weekday (Monday to Friday)',
        };
}

function handleEditTime() {
    setIsEditable(true)
}

function getRoundedTime(minutesToAdd) {
    const now = new Date()
    now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30)
    const newDate = new Date(now.getTime() + minutesToAdd * 60000)
    return newDate
}

function handleDropdown(type) {
    setShowDropdown((prev) => (prev === type ? null : type))
}

function handleStartTime(value) {
    const newStartTime = convertLocaleTimeStringToDate(value)
    updateEventDetails('startTime', newStartTime)

    const newEndTime = new Date(newStartTime)
    newEndTime.setHours(newEndTime.getHours() + 1);
    updateEventDetails('endTime', newEndTime)
    setShowDropdown(null);
}

function handleEndTime(value) {
    const endTime = convertLocaleTimeStringToDate(value)
    updateEventDetails('endTime', endTime)
    setShowDropdown(null);
}

function handleDropdownDateClick(date) {
    updateEventDetails('selectedDate', date)
    setShowDropdown(null)
}

function handleRepeatOption(option) {
    updateEventDetails('repeatOption', option)
    setShowDropdown(null)
}

// function combineDateAndTime(date1, date2) {
//     return new Date(
//         date1.getFullYear(),
//         date1.getMonth(),
//         date1.getDate(),
//         date2.getHours(),
//         date2.getMinutes(),
//         date2.getSeconds(),
//         date2.getMilliseconds()
//     );
// }

function convertLocaleTimeStringToDate(value) {
    const date = new Date(eventDetails.selectedDate)
    const [hour, minutes, period] = value.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1)

    let hours = parseInt(hour, 10)
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0

    date.setHours(hours, parseInt(minutes, 10), 0, 0)

    return date
}

function convertDateToLocaleTimeString(time) {
    const date = new Date(time)
    const timeString = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })
    return timeString
}

function generateTimeOptions(interval, hour = 0, minute = 0) {
    const options = []
    const date = new Date()
    date.setHours(hour, minute, 0, 0)

    while (date.getDate() === new Date().getDate()) {
        options.push(date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }))
        date.setMinutes(date.getMinutes() + interval)
    }

    return options
}

function convertDateToString(date) {
    const newDate = new Date(date)
    return newDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function updateEventDetails(key, value) {
    setEventDetails(prev => ({
        ...prev,
        [key]: value
    }))
}

// useEffect(() => {
//     if (!eventModalData) return;
//     setEventDetails(prev => ({
//         ...prev,
//         startTime: convertLocaleTimeStringToDate(eventModalData.startTime),
//         endTime: convertLocaleTimeStringToDate(eventDetails.endTime)
//     }))
// }, [eventModalData])

useEffect(() => {
    console.log('eventInfo - ', eventInfo)
}, [eventInfo])

useEffect(() => {
    console.log('eventDetails - ', eventDetails)
    setEventInfo(prev => ({
        ...prev,
        ...eventDetails
    }
    ))
}, [eventDetails])

useEffect(() => {
    function handleOutsideClick(event) {
        if (
            (startDropdownRef.current && !startDropdownRef.current.contains(event.target)) &&
            (endDropdownRef.current && !endDropdownRef.current.contains(event.target)) &&
            (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) &&
            (repeatOptionsDropdownRef.current && !repeatOptionsDropdownRef.current.contains(event.target))

        ) {
            setShowDropdown(null);
        }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
}, [])

return (
    <>
        <div className="event-modal-time-component">
            {
                !isEditable ?
                    <div className="event-modal-time-display" onClick={handleEditTime}>
                        <div className="modal-time-display-section1">
                            <div className="modal-time-display-date">
                                {convertDateToString(eventDetails.selectedDate)}
                            </div>
                            <div className="modal-time-display-time">
                                <p>{convertDateToLocaleTimeString(eventDetails.startTime)}</p>
                                <p> - </p>
                                <p>{convertDateToLocaleTimeString(eventDetails.endTime)}</p>
                            </div>
                        </div>
                        <div className="modal-time-display-section2">
                            <p>Time zone | Does not repeat</p>
                        </div>
                    </div>
                    : <div className="event-modal-time-edit">
                        <div className="modal-time-edit-section1">
                            <div className="modal-time-edit-date-section" ref={dateDropdownRef}>
                                <div className="modal-time-edit-date">
                                    <input
                                        type='text'
                                        className="modal-time-edit-date-input"
                                        value={convertDateToString(eventDetails.selectedDate)}
                                        onChange={(event) => handleStartTime(event.target.value)}
                                        onClick={() => handleDropdown('date')}
                                        style={{ width: ${eventDetails.selectedDate.length} ch }}
                                        />
                                </div>
                                {
                                    showDropdown === 'date' && (
                                        <div className="modal-time-edit-date-popup">
                                            <MonthTab handleDateClick={handleDropdownDateClick} />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="modal-time-edit-time">
                                <div className="modal-time-edit-start" ref={startDropdownRef}>
                                    <input
                                        type='text'
                                        className="modal-edit-time-start"
                                        value={convertDateToLocaleTimeString(eventDetails.startTime)}
                                        onChange={(event) => handleStartTime(event.target.value)}
                                        onClick={() => handleDropdown('startTime')}
                                        style={{ width: ${convertDateToLocaleTimeString(eventDetails.startTime) + 3} ch }}
                                    />
                                    {showDropdown === 'startTime' && (
                                        <div className="modal-edit-time-dropdown">
                                            {generateTimeOptions(15).map(time => (
                                                <div
                                                    key={time}
                                                    className="modal-edit-time-dropdown-option"
                                                    onClick={() => handleStartTime(time)}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p>-</p>
                                <div className="modaltime-edit-end" ref={endDropdownRef}>
                                    <input
                                        type="text"
                                        className="modal-edit-time-end"
                                        value={convertDateToLocaleTimeString(eventDetails.endTime)}
                                        onChange={(event) => handleEndTime(event.target.value)}
                                        onClick={() => handleDropdown('endTime')}
                                        style={{ width: ${convertDateToLocaleTimeString(eventDetails.endTime) + 3} ch }}
                                        />
                                    {showDropdown === 'endTime' && (
                                        <div className="modal-edit-time-dropdown">
                                            {generateTimeOptions(15, eventDetails.startTime.getHours() + 1, eventDetails.startTime.getMinutes()).map(time => (
                                                <div
                                                    key={time}
                                                    className="modal-edit-time-dropdown-option"
                                                    onClick={() => handleEndTime(time)}
                                                >
                                                    {time}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-time-edit-section2" ref={repeatOptionsDropdownRef}>
                            <div className="modal-time-edit-section2-dropdown" onClick={() => handleDropdown('repeat')}>
                                <p>{eventDetails.repeatOption}</p>
                                <MdArrowDropDown className='modal-time-edit-dropdown-icon' />
                            </div>
                            {showDropdown === 'repeat' && (
                                <div className="modal-edit-time-dropdown">
                                    {
                                        Object.entries(repeatLabels).map(([key, label]) => (
                                            <div
                                                key={key}
                                                className="modal-edit-time-dropdown-option"
                                                onClick={() => handleRepeatOption(key)}
                                            >
                                                {label}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
            }
        </div >
    </>
)
}

export default oldModalTimeComponent