/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { EVENTS } from "../static/constants.js"

// Create context
const EventContext = createContext()

// eslint-disable-next-line react/prop-types
function EventProvider({ children }) {
    const [eventState, setEventState] = useState({ ...EVENTS })

    // Add new event
    function addEvent(eventInfo) {
        const id = uuidv4()
        const normalizedEvent = normalizeEventDates(eventInfo);
        setEventState(prev => ({
            ...prev,
            [id]: normalizedEvent
        }))
    }

    // Delete an event by ID
    function deleteEvent(eventId) {
        setEventState(prev => {
            const newState = { ...prev }
            delete newState[eventId]
            return newState
        })
    }

    // Update a specific event by ID
    function updateEvent(eventId, updatedEvent) {
        setEventState(prev => {
            if (!prev[eventId]) return prev

            const normalizedEvent = normalizeEventDates(updatedEvent);

            return {
                ...prev,
                [eventId]: {
                    ...prev[eventId],
                    ...normalizedEvent

                }
            }
        })
    }

    function normalizeEventDates(event) {
        const normalize = (date) => (date instanceof Date ? date.toISOString() : new Date(date).toISOString());

        return {
            ...event,
            selectedDate: normalize(event.selectedDate),
            startTime: normalize(event.startTime),
            endTime: normalize(event.endTime),
        };
    }


    useEffect(() => {
        console.log("eventState -", eventState)
    }, [eventState])

    return (
        <EventContext.Provider value={{ eventState, addEvent, deleteEvent, updateEvent }}>
            {children}
        </EventContext.Provider>
    )
}

// Custom hook
const useEvent = () => useContext(EventContext)

export { EventProvider, useEvent }
