import '../../styles/Navbar.css'
import { MdMenu, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdArrowDropDown } from "react-icons/md";
import CalendarIcon from '../../assets/calendar.png'
import ProfileIcon from '../../assets/profile-icon.png'
import PropTypes from 'prop-types'
import { NAVBAR_DROPDOWN_OPTIONS } from '../../static/constants';
import { useState } from 'react';
import { useDate } from '../../contexts/DateContext';
import NavDateTitle from '../Common/NavDateTitle';

function Navbar({ setIsSidebarExpanded }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { navigateDate, dateState, updateDate } = useDate()

    function toggleDropdown() {
        setIsDropdownOpen(prev => !prev)
    }

    function handleToggleSidebar() {
        setIsSidebarExpanded(prev => !prev)
    }

    function handleDropdownOptionClick(option) {
        setIsDropdownOpen(false)
        updateDate({ view: option })
    }

    function navigateToToday() {
        const date = new Date(dateState.todaysDate)
        updateDate({ currentDate: date, view: 'day' })
    }

    return (
        <>
            <div className="calendar-navbar-component">
                <div className="calendar-navbar-section-1">
                    <div className="navbar-menu-icon">
                        <MdMenu className='navbar-menu-img' onClick={handleToggleSidebar} />
                    </div>
                    <div className="navbar-title-component">
                        <img src={CalendarIcon} alt="*" />
                        <p>Calendar</p>
                    </div>
                </div>
                <div className="calendar-navbar-section-2">
                    <button id='navbar-today-button' className="navbar-today-button" onClick={navigateToToday}>
                        Today
                    </button>
                    <div className="navbar-navigation-arrows">
                        <button onClick={() => navigateDate(-1)}>
                            <MdKeyboardArrowLeft className='navbar-arrow-previous' />
                        </button>
                        <button onClick={() => navigateDate(1)}>
                            <MdKeyboardArrowRight className='navbar-arrow-next' />
                        </button>
                    </div>
                    <NavDateTitle />
                    <div className="navbar-menu-dropdown-component">
                        <div className="navbar-menu-dropdown" onClick={toggleDropdown}>
                            <p>{dateState.view[0].toUpperCase() + dateState.view.substring(1)}</p>
                            <MdArrowDropDown className='navbar-dropdown-icon' />
                        </div>
                        {isDropdownOpen && (
                            <div className="navbar-dropdown-options">
                                {NAVBAR_DROPDOWN_OPTIONS.map(option => (
                                    <div key={option.option} className="navbar-dropdown-option" onClick={() => handleDropdownOptionClick(option.option.toLowerCase())}>
                                        <p>{option.option}</p>
                                        <p>{option.shortForm}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="calendar-navbar-section-3">
                    <div className="navbar-user-component">
                        <img src={ProfileIcon} alt="O" />
                    </div>
                </div>
            </div>

        </>
    )
}

Navbar.propTypes = {
    setIsSidebarExpanded: PropTypes.func.isRequired,
}
export default Navbar