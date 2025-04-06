/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'
import '../../styles/EventModal.css'
import { MdArrowDropDown } from "react-icons/md";
import { FULL_WEEK_DAYS, MONTHS } from '../../static/constants';
import { useDate } from '../../contexts/DateContext';
import MonthTab from '../Common/MonthTab';

function ModalTimeComponent({ setEventInfo, eventInfo }) {
    const { dateState } = useDate();
    const endDropdownRef = useRef(null);
    const startDropdownRef = useRef(null);
    const dateDropdownRef = useRef(null);
    const repeatOptionsDropdownRef = useRef(null);

    const [isEditable, setIsEditable] = useState(false);
    const [showDropdown, setShowDropdown] = useState(null);

    const repeatLabels = useMemo(() => {
        const safeDate = eventInfo?.selectedDate ? new Date(eventInfo.selectedDate) : new Date(dateState.currentDate);
        return getRepeatLabels(safeDate);
    }, [eventInfo?.selectedDate, dateState.currentDate]);


    function getRepeatLabels(date) {
        const d = new Date(date);
        const weekday = FULL_WEEK_DAYS[d.getDay()];
        const day = d.getDate();
        const month = MONTHS[d.getMonth()];

        return {
            none: 'Does not repeat',
            daily: 'Daily',
            weekly: `Weekly on ${weekday}`,
            annually: `Annually on ${month} ${day}`,
            weekdays: 'Every weekday (Monday to Friday)',
        };
    }

    function getRoundedTime(minutesToAdd) {
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
        const newDate = new Date(now.getTime() + minutesToAdd * 60000);
        return newDate;
    }

    function handleEditTime() {
        setIsEditable(true);
    }

    function handleDropdown(type) {
        setShowDropdown((prev) => (prev === type ? null : type));
    }

    function handleStartTime(value) {
        console.log('handleStartTime 1 - ', eventInfo)
        const newStartTime = convertLocaleTimeStringToDate(value, eventInfo.selectedDate);
        const newEndTime = new Date(newStartTime);
        newEndTime.setHours(newEndTime.getHours() + 1);
        console.log('handleStartTime - ', newStartTime, newEndTime)
        setEventInfo(prev => ({
            ...prev,
            startTime: newStartTime,
            endTime: newEndTime
        }));
        setShowDropdown(null);
    }

    function handleEndTime(value) {
        const endTime = convertLocaleTimeStringToDate(value, eventInfo.selectedDate);
        console.log('handleEndTime - ', endTime)
        setEventInfo(prev => ({
            ...prev,
            endTime
        }));
        setShowDropdown(null);
    }

    function handleDropdownDateClick(date) {
        console.log('handleDropdownDateClick - ', date)
        setEventInfo(prev => ({
            ...prev,
            selectedDate: date
        }));
        setShowDropdown(null);
    }

    function handleRepeatOption(option) {
        console.log('handleRepeatoption - ', option)
        setEventInfo(prev => ({
            ...prev,
            repeat: option
        }));
        setShowDropdown(null);
    }

    function convertLocaleTimeStringToDate(value, baseDate) {
        const date = new Date(baseDate);
        const [hour, minutes, period] = value.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);

        let hours = parseInt(hour, 10);
        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

        date.setHours(hours, parseInt(minutes, 10), 0, 0);
        return date;
    }

    function convertDateToLocaleTimeString(time) {
        const date = new Date(time);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function generateTimeOptions(interval, hour = 0, minute = 0) {
        const options = [];
        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        while (date.getDate() === new Date().getDate()) {
            options.push(date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
            date.setMinutes(date.getMinutes() + interval);
        }

        return options;
    }

    function convertDateToString(date) {
        const newDate = new Date(date);
        return newDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

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

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const startTimeString = convertDateToLocaleTimeString(eventInfo?.startTime || getRoundedTime(0));
    const endTimeString = convertDateToLocaleTimeString(eventInfo?.endTime || getRoundedTime(60));
    const selectedDate = eventInfo?.selectedDate || new Date(dateState.currentDate);

    return (
        <div className="event-modal-time-component">
            {
                !isEditable ?
                    <div className="event-modal-time-display" onClick={handleEditTime}>
                        <div className="modal-time-display-section1">
                            <div className="modal-time-display-date">
                                {convertDateToString(selectedDate)}
                            </div>
                            <div className="modal-time-display-time">
                                <p>{startTimeString}</p>
                                <p> - </p>
                                <p>{endTimeString}</p>
                            </div>
                        </div>
                        <div className="modal-time-display-section2">
                            <p>Time zone | {eventInfo?.repeat || 'Does not repeat'}</p>
                        </div>
                    </div>
                    :
                    <div className="event-modal-time-edit">
                        <div className="modal-time-edit-section1">
                            <div className="modal-time-edit-date-section" ref={dateDropdownRef}>
                                <div className="modal-time-edit-date">
                                    <input
                                        type='text'
                                        className="modal-time-edit-date-input"
                                        value={convertDateToString(selectedDate)}
                                        onClick={() => handleDropdown('date')}
                                        readOnly
                                        style={{ width: `${convertDateToString(selectedDate).length}ch` }}
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
                                        value={startTimeString}
                                        onClick={() => handleDropdown('startTime')}
                                        readOnly
                                        style={{ width: `${startTimeString.length + 3}ch` }}
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
                                        value={endTimeString}
                                        onClick={() => handleDropdown('endTime')}
                                        readOnly
                                        style={{ width: `${endTimeString.length + 3}ch` }}
                                    />
                                    {showDropdown === 'endTime' && (
                                        <div className="modal-edit-time-dropdown">
                                            {generateTimeOptions(15, eventInfo.startTime?.getHours() + 1 || 1, eventInfo.startTime?.getMinutes() || 0).map(time => (
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
                                <p>{eventInfo?.repeat || 'Does not repeat'}</p>
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
        </div>
    )
}

export default ModalTimeComponent;
