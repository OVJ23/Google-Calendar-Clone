import { useEffect, useState } from 'react'
import { useDate } from '../../contexts/DateContext';

function NavDateTitle() {
    const { dateState } = useDate()
    const [navbarDateTitle, setNavbarDateTitle] = useState('')
    const { view, currentDate, weekStartDate, weekEndDate } = dateState;
    const currentDateObj = new Date(dateState.currentDate)
    const weekStartDateObj = new Date(dateState.weekStartDate)
    const weekEndDateObj = new Date(dateState.weekEndDate)

    useEffect(() => {
        let title = ''
        if (!view || !currentDate || !weekStartDate || !weekEndDate) return

        switch (view) {
            case 'day': {
                title = currentDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                break
            }
            case 'week': {
                const startWeekObj = weekStartDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                const endWeekObj = weekEndDateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

                if (weekStartDateObj.getMonth() !== weekEndDateObj.getMonth()) {
                    title = `${startWeekObj.split(' ')[0]} - ${endWeekObj.split(' ')[0]} ${weekStartDateObj.getFullYear()}`
                }
                else if (weekStartDateObj.getYear() !== weekEndDateObj.getYear()) {
                    title = `${startWeekObj} - ${endWeekObj}`
                }
                else {
                    title = `${weekStartDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                }
                break
            }
            case 'month':
                title = currentDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                break
            case 'year':
                title = currentDateObj.getFullYear().toString()
                break
            default:
                break
        }
        setNavbarDateTitle(title)

    }, [dateState])

    return (
        <div className="navbar-date">
            <p>{navbarDateTitle}</p>
        </div>
    )
}

export default NavDateTitle