export function handleDeleteEvent(eventId, deleteEvent, closePopup) {
    console.log('handleDeleteEvent')
    deleteEvent(eventId);
    closePopup();
}

export function handleEditEvent(eventData, closePopup, setEventModalData) {
    console.log('handleEditEvent - ', eventData)
    setEventModalData(eventData)
    closePopup();
}

export function handleEventClick(
    event,
    selectedEvent,
    setSelectedEvent,
    setPopupPosition,
    closePopup,
    recentlyClosed,
    e
) {
    e.stopPropagation();

    if (recentlyClosed) return;

    // If same event clicked again, close the popup
    if (event.id === selectedEvent?.id) {
        closePopup();
        return;
    }

    const rect = e.target.getBoundingClientRect();
    setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
    });
    setSelectedEvent(event);
}

export function handleClosePopup(setSelectedEvent, setPopupPosition, setRecentlyClosed) {
    setSelectedEvent(null);
    setPopupPosition(null);
    setRecentlyClosed(true);

    // Unlock after a short delay
    setTimeout(() => setRecentlyClosed(false), 200);
}

