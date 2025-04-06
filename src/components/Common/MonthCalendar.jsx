/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { WEEK_DAYS } from '../../static/constants'
import '../../styles/MonthCalendar.css'

function MonthCalendar({ year, monthIndex, handleDateClick }) {
    function calculateMonthRange() {
        const monthStart = new Date(year, monthIndex, 1)
        const monthEnd = new Date(year, monthIndex + 1, 0)

        const monthWeekStart = new Date(monthStart)
        monthWeekStart.setDate(monthStart.getDate() - monthStart.getDay())
        monthWeekStart.setHours(0, 0, 0, 0)

        const monthWeekEnd = new Date(monthEnd)
        monthWeekEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()))
        monthWeekEnd.setHours(23, 59, 59, 999)

        const daysCount = Math.floor((monthWeekEnd - monthWeekStart + 1) / (1000 * 60 * 60 * 24))

        return { monthWeekStart, monthWeekEnd, daysCount }
    }

    let { monthWeekStart, monthWeekEnd, daysCount } = calculateMonthRange()

    function handleClick(date, event) {
        handleDateClick(date, event)
    }

    return (
        <>
            <div className="month-calendar-days">
                {
                    WEEK_DAYS.map(week => (
                        <div key={week} className="month-calendar-day">{week[0]}</div>
                    ))
                }
            </div>
            <div className="month-calendar-dates-section">
                {
                    Array.from({ length: daysCount }, (_, index) => {
                        const cDate = new Date(monthWeekStart);
                        cDate.setDate(monthWeekStart?.getDate() + index);
                        return (
                            <div key={index} className="month-calendar-date">
                                <div className="month-calendar-day-date" onClick={(e) => handleClick(cDate, e)}>
                                    {cDate.getDate()}
                                </div>
                            </div>
                        )
                    })

                }
            </div>
        </>
    )
}

export default MonthCalendar