/* eslint-disable react/prop-types */
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import MonthCalendar from '../Common/MonthCalendar'
import { useDate } from '../../contexts/DateContext'
import { useEffect, useState } from 'react'
import '../../styles/MonthTab.css'

function MonthTab({ handleDateClick }) {
    const { dateState } = useDate()
    const [sidebarDate, setSidebarDate] = useState(null)
    const currentDateObj = new Date(dateState.currentDate)

    function navigateSidebarMonth(direction) {
        const date = new Date(sidebarDate || new Date());
        date.setMonth(date.getMonth() + direction);
        setSidebarDate(date);
    }

    function getMonthName(monthNumber) {
        return new Date(sidebarDate?.getFullYear(), monthNumber).toLocaleDateString('en-US', { month: 'long' })
    }


    useEffect(() => {
        setSidebarDate(currentDateObj)
    }, [dateState.currentDate])
    return (
        <>
            <div className="sidebar-monthwise-tab">
                <div className="sidebar-monthwise-tab-header">
                    <div className="sidebar-monthwise-header-title">
                        <p>{getMonthName(sidebarDate?.getMonth()) + ' ' + sidebarDate?.getFullYear()}</p>
                    </div>
                    <div className="sidebar-monthwise-header-navigation">
                        <button onClick={() => { navigateSidebarMonth(-1) }}>
                            <MdKeyboardArrowLeft className='sidebar-monthwise-arrow-previous' />
                        </button>
                        <button onClick={() => { navigateSidebarMonth(1) }}>
                            <MdKeyboardArrowRight className='sidebar-monthwise-arrow-next' />
                        </button>
                    </div>
                </div>
                <div className="sidebar-monthwise-tab-body">
                    <MonthCalendar year={sidebarDate?.getFullYear()} monthIndex={sidebarDate?.getMonth()} handleDateClick={handleDateClick} />
                </div>
            </div>
        </>
    )
}

export default MonthTab