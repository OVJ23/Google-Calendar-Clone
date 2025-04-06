/* eslint-disable no-unused-vars */
export function getEventsForDate(targetDate, allEvents) {
    const targetDateStr = targetDate.toISOString().split("T")[0];
    // const targetDateObj = new Date(targetDate)

    return Object.entries(allEvents)
        .filter(([_, event]) => {
            const eventDate = new Date(event.selectedDate);
            const eventDateStr = eventDate.toISOString().split("T")[0];

            if (!event.repeat || event.repeat === 'none') {
                return eventDateStr === targetDateStr;
            }

            switch (event.repeat) {
                case 'daily':
                    return true;

                case 'weekdays': {
                    const day = targetDate.getDay();
                    return day >= 1 && day <= 5;
                }

                case 'weekly':
                    return eventDate.getDay() === targetDate.getDay();

                case 'monthly':
                    return eventDate.getDate() === targetDate.getDate();

                case 'annually':
                    return (
                        eventDate.getDate() === targetDate.getDate() &&
                        eventDate.getMonth() === targetDate.getMonth()
                    );

                default:
                    return false;
            }
        })
        .map(([id, event]) => ({ id, ...event }));
}
