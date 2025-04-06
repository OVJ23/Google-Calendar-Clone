import '../../styles/Sidebar.css'
import { MdOutlineAdd, MdArrowDropDown } from "react-icons/md"
import PropTypes from 'prop-types'
import { EVENT_TYPES } from '../../static/constants'
import { useState } from 'react'
import MonthTab from '../Common/MonthTab'
import EventModal from '../Modals/EventModal'

function Sidebar({ isSidebarExpended }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(null)


    function handleToggleDropdown() {
        setIsDropdownOpen(prev => !prev)
    }

    function handleEventClick(componentName) {
        setIsDropdownOpen(false)
        setIsModalOpen(componentName)
    }

    function handleModalClose() {
        setIsModalOpen(null)
    }

    return (
        <>
            <div className=
                {`
                sidebar-create-event-component 
                ${isSidebarExpended ? 'sidebar-create-event-component-expanded' : 'sidebar-create-event-component-collapsed'}
            `}>
                <div className="sidebar-create-event-main" onClick={handleToggleDropdown}>
                    <MdOutlineAdd className='sidebar-create-icon' />
                    <div className=
                        {`
                        sidebar-create-body 
                        ${isSidebarExpended ? 'sidebar-create-body-expanded' : 'sidebar-create-body-collapsed'}
                    `}
                    >
                        <p>Create</p>
                        <MdArrowDropDown className='sidebar-create-dropdown-icon' />
                    </div>
                </div>
                {
                    isDropdownOpen && (
                        <div className="sidebar-create-event-dropdown">
                            {
                                EVENT_TYPES.map(option => (
                                    <div key={option.eventName} className="sidebar-create-event-dropdown-option" onClick={() => handleEventClick(option.componentName)}>
                                        <p>{option.eventName}</p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
            <div className={`calendar-sidebar-component ${isSidebarExpended ? "calendar-sidebar-component-expanded" : "calendar-sidebar-component-collapsed"}`}>
                <MonthTab />
            </div>
            {isModalOpen && (
                <EventModal onClose={handleModalClose} />
            )}
        </>
    )
}

Sidebar.propTypes = {
    isSidebarExpended: PropTypes.string.isRequired,
    setIsModalOpen: PropTypes.string.isRequired
}

export default Sidebar