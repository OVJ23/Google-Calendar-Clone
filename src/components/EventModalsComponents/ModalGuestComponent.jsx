/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { GUEST_NAMES } from "../../static/constants"

function ModalGuestComponent({ setEventInfo }) {
    const guestDropdownRef = useRef(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [guestName, setGuestName] = useState(null)
    const [guestsAdded, setGuestsAdded] = useState([])

    function handleGuestChange(value) {
        setGuestName(value)
    }

    function handleDropdownToggle() {
        setIsDropdownOpen(prev => !prev)
    }

    function handleAddGuest(guest) {
        setGuestsAdded([...guestsAdded, guest])
    }

    useEffect(() => {
        setEventInfo(prev =>
        ({
            ...prev,
            guests: guestsAdded
        })
        )
    }, [guestsAdded])

    useEffect(() => {
        function handleClickOutside(event) {
            if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {

                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <div className="event-modal-guest-component" ref={guestDropdownRef}>
                <input
                    type='text'
                    className="modal-guest-input"
                    placeholder="Add guests"
                    value={guestName}
                    onChange={(event) => handleGuestChange(event.target.value)}
                    onClick={handleDropdownToggle}
                />
                {isDropdownOpen && (
                    <div className="modal-edit-time-dropdown">
                        {
                            GUEST_NAMES.map(guest => (
                                <div
                                    key={guest.name}
                                    className="modal-edit-time-dropdown-option"
                                    onClick={() => handleAddGuest(guest)}>
                                    {guest.name}
                                </div>
                            ))
                        }
                    </div>
                )}
                {guestsAdded.length > 0 && (
                    <div className="modal-guests-added">
                        {
                            guestsAdded.map(guest => (
                                <div key={guest.email} className="guest-added-info">
                                    <p className="guest-added-name">{guest.name}</p>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </>
    )
}

export default ModalGuestComponent