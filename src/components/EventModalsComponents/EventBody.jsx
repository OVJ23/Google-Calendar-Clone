/* eslint-disable react/prop-types */
import '../../styles/EventModal.css'
import { LuClock4 } from "react-icons/lu";
import { MdOutlinePeopleOutline, MdOutlineNotes } from "react-icons/md";
import ModalTimeComponent from './ModalTimeComponent';
import ModalGuestComponent from './ModalGuestComponent';
import ModalDescriptionComponent from './ModalDescriptionComponent';


function EventBody({ setEventInfo, eventModalData }) {
    return (
        <>
            <div className="event-modal-body-main">
                <div className="event-modal-body-section">
                    <div className="event-modal-body-section-left">
                        <LuClock4 className='event-modal-body-section-left-icon' />
                    </div>
                    <div className="event-modal-body-section-right">
                        <ModalTimeComponent setEventInfo={setEventInfo} eventModalData={eventModalData} />
                    </div>
                </div>
                <div className="event-modal-body-section">
                    <div className="event-modal-body-section-left">
                        <MdOutlinePeopleOutline className='event-modal-body-section-left-icon' />
                    </div>
                    <div className="event-modal-body-section-right">
                        <ModalGuestComponent setEventInfo={setEventInfo} />
                    </div>
                </div>
                <div className="event-modal-body-section">
                    <div className="event-modal-body-section-left">
                        <MdOutlineNotes className='event-modal-body-section-left-icon' />
                    </div>
                    <div className="event-modal-body-section-right">
                        <ModalDescriptionComponent setEventInfo={setEventInfo} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventBody