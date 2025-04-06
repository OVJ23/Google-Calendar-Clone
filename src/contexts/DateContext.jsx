/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// import { v4 as uuidv4 } from "uuid"
// import { EVENTS } from "../static/constants"

// Create a context
const DateContext = createContext()

// eslint-disable-next-line react/prop-types
function DateProvider({ children }) {
    const navigate = useNavigate()

    const [dateState, setDateState] = useState({
        todaysDate: new Date().toISOString(),
        currentDate: new Date().toISOString(),
        view: 'day',
        weekStartDate: new Date().toISOString(),
        weekEndDate: new Date().toISOString()
    })

    // const [eventState, setEventState] = useState({ ...EVENTS })

    function updateDate(props) {
        const updatedProps = {};
        for (const key in props) {
            updatedProps[key] = props[key] instanceof Date
                ? props[key].toISOString()
                : props[key];
        }

        setDateState(prev => ({
            ...prev,
            ...updatedProps
        }))
    }

    function navigateDate(direction) {
        setDateState(prev => {
            const newDate = new Date(prev.currentDate)

            switch (prev.view) {
                case 'day':
                    newDate.setDate(newDate.getDate() + direction)
                    break
                case 'week':
                    newDate.setDate(newDate.getDate() + direction * 7)
                    break
                case 'month':
                    newDate.setMonth(newDate.getMonth() + direction)
                    break
                case 'year':
                    newDate.setYear(newDate.getFullYear() + direction)
                    break
                default:
                    break
            }

            return { ...prev, currentDate: newDate.toISOString() }
        })
    }

    // function addEvent(eventInfo) {
    //     let id = uuidv4()
    //     setEventState(prev => ({
    //         ...prev,
    //         [id]: eventInfo
    //     }))
    // }

    // function deleteEvent(eventId) {
    //     setEventState((prevState) => {
    //         const newState = { ...prevState }
    //         delete newState[eventId]
    //         return newState
    //     })
    // }

    // function updateEvent(eventId, updatedEvent) {
    //     // setEventState((prevEvents) => ({
    //     //     ...prevEvents,
    //     //     [eventId]: {
    //     //         ...prevEvents[eventId],
    //     //         ...updatedEvent
    //     //     }
    //     // }));
    //     // setEventState((prevEvents) =>
    //     //     prevEvents.map(event =>
    //     //         event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event
    //     //     )
    //     // );
    //     // const updatedEvents = eventState.map(event => {
    //     //     if (event.id === updatedEvent.id) {
    //     //         return { ...event, startTime: updatedEvent.startTime, endTime: updatedEvent.endTime };
    //     //     }
    //     //     return event;
    //     // });
    //     // setEventState(updatedEvents);
    //     console.log('updatedEvent - ', updatedEvent)
    //     setEventState(prevState => {
    //         if (!prevState[eventId]) return prevState; // If event doesn't exist, return unchanged state

    //         // Create a completely new object to trigger re-render
    //         const newState = { ...prevState };

    //         // Update only the specific event
    //         newState[eventId] = {
    //             ...prevState[eventId],
    //             ...updatedEvent
    //         };

    //         return newState; // React detects this as a state change
    //     });
    // }

    // useEffect(() => {
    //     console.log('eventState - ', eventState)
    // }, [eventState])

    useEffect(() => {
        navigate(`/${dateState.view}`)
    }, [dateState.view])

    // Provide the context and functions to the children
    return (
        <DateContext.Provider value={{ dateState, updateDate, navigateDate }}>
            {children}
        </DateContext.Provider>
    )
}

// Create a custom hook for accessing the context
const useDate = () => useContext(DateContext)
export { DateProvider, useDate }