export const TIME_PERIODS = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM']

export const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export const FULL_WEEK_DAYS = ['Sunday', 'Monday', 'Tusesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const EVENT_TYPES = [{ eventName: 'Event', componentName: 'Event' }, { eventName: 'Focus time', componentName: 'FocusTime' }, { eventName: 'Out of Office', componentName: 'OutOfOffice' }, { eventName: 'Working Location', componentName: 'WorkingLocation' }, { eventName: 'Task', componentName: 'Task' }]

export const NAVBAR_DROPDOWN_OPTIONS = [{ option: 'Day', shortForm: 'D' }, { option: 'Week', shortForm: 'W' }, { option: 'Month', shortForm: 'M' }, { option: 'Year', shortForm: 'Y' }]

export const EVENT_MODAL_REPEAT_OPTIONS = ['Does not repeat', 'Daily', 'Weekly on', 'Monthly on the first', 'Anually on ', 'Every weekday (Monday to Friday)']

export const GUEST_NAMES = [{ name: 'Adarsh Shete', email: 'adarsh.shete@idfy.com' }, { name: 'Aryaman Shetty', email: 'aryaman.shetty@idfy.com' }, { name: 'Atishay Jain', email: 'atishay.jain@idfy.com' }, { name: 'Manish Raut', email: 'manish.raut@idfy.com' }, { name: 'Mansi Kadam', email: 'mansi.kadam@idfy.com' }, { name: 'Rohan Rane', email: 'rohan.rane@idfy.com' }, { name: 'Sakshi Dhenge', email: 'sakshi.dhenge@idfy.com' }, { name: 'Sanket Saboo', email: 'sanket.saboo@idfy.com' }, { name: 'Saurabh Kumar Mahra', email: 'saurabh.mahra@idfy.com' }, { name: 'Senthil Kannan G', email: 'senthil.g@idfy.com' }, { name: 'Shivam Bangia', email: 'shivam.bangia@idfy.com' }]

export const EVENTS = {
    'a1b2c3d4-e567-890f-gh12-3456789abcd': {
        'type': 'event',
        'title': 'Team Meetingqawds sdasdsd',
        'selectedDate': '2025-03-23T00:00:00.000000',
        'startTime': '2025-03-23T00:30:00.000000',
        'endTime': '2025-03-23T01:30:00.000000',
        'description': 'Weekly sync-up meeting',
        'guests': [{ 'name': 'John Doe', 'email': 'john.doe@example.com' },
        { 'name': 'Jane Smith', 'email': 'jane.smith@example.com' }],
        'repeat': 'weekdays'
    },
    'a1b2c3d4-e567-890f-gh12-3456789bcd': {
        'type': 'event',
        'title': 'Team Meeting2',
        'selectedDate': '2025-03-23T00:00:00.000000',
        'startTime': '2025-03-23T00:30:00.000000',
        'endTime': '2025-03-23T01:30:00.000000',
        'description': 'Weekly sync-up meeting',
        'guests': [{ 'name': 'John Doe', 'email': 'john.doe@example.com' },
        { 'name': 'Jane Smith', 'email': 'jane.smith@example.com' }],
        'repeat': 'daily'
    },
    'a1b2c3d4-e567-890f-gh12-3456789acd': {
        'type': 'event',
        'title': 'Team Meeting3',
        'selectedDate': '2025-03-23T00:00:00.000000',
        'startTime': '2025-03-23T03:00:00.000000',
        'endTime': '2025-03-23T04:00:00.000000',
        'description': 'Weekly sync-up meeting',
        'guests': [{ 'name': 'John Doe', 'email': 'john.doe@example.com' },
        { 'name': 'Jane Smith', 'email': 'jane.smith@example.com' }],
        'repeat': 'weekly'
    },
    'b2c3d4e5-f678-901g-hi23-4567890bcda': {
        'type': 'event',
        'title': 'Doctor Appointment',
        'selectedDate': '2025-03-24T00:00:00.000000',
        'startTime': '2025-03-24T00:45:00.000000',
        'endTime': '2025-03-24T01:30:00.000000',
        'description': 'Routine checkup',
        'guests': [],
        'repeat': 'weekly'
    },
    'c3d4e5f6-g789-012h-ij34-5678901cdeb': {
        'type': 'event',
        'title': 'Project Deadline',
        'selectedDate': '2025-03-29T00:00:00.000000',
        'startTime': '2025-03-29T05:29:00.000000',
        'endTime': '2025-03-29T06:00:00.000000',
        'description': 'Final submission deadline',
        'guests': [],
        'repeat': 'daily'
    },
    'd4e5f6g7-h890-123i-jk45-6789012defc': {
        'type': 'event',
        'title': 'Lunch with Client',
        'selectedDate': '2025-03-30T00:00:00.000000',
        'startTime': '2025-03-30T18:00:00.000000',
        'endTime': '2025-03-30T19:00:00.000000',
        'description': 'Business lunch with Mr. Smith',
        'guests': [{ 'name': 'Mr. Smith', 'email': 'smith@example.com' }],
        'repeat': 'none'
    },
    'e5f6g7h8-i901-234j-kl56-7890123efgh': {
        'type': 'event',
        'title': 'Gym Workout',
        'selectedDate': '2025-04-01T00:00:00.000000',
        'startTime': '2025-03-31T12:30:00.000000',
        'endTime': '2025-03-31T13:30:00.000000',
        'description': 'Morning workout session',
        'guests': [],
        'repeat': 'daily'
    },
    'f6g7h8i9-j012-345k-lm67-8901234fghi': {
        'type': 'event',
        'title': 'Flight to New York',
        'selectedDate': '2025-04-03T00:00:00.000000',
        'startTime': '2025-04-02T15:30:00.000000',
        'endTime': '2025-04-02T19:30:00.000000',
        'description': 'Business trip to NY',
        'guests': [{ 'name': 'Alice Brown', 'email': 'alice.brown@example.com' }],
        'repeat': 'none'
    },
    'g7h8i9j0-k123-456l-mn78-9012345ghij': {
        'type': 'event',
        'title': 'Birthday Party',
        'selectedDate': '2025-04-06T00:00:00.000000',
        'startTime': '2025-04-05T23:30:00.000000',
        'endTime': '2025-04-06T03:30:00.000000',
        'description': "Celebrating Jake's birthday",
        'guests': [{ 'name': 'Jake Williams', 'email': 'jake.williams@example.com' },
        { 'name': 'Emily Davis', 'email': 'emily.davis@example.com' }],
        'repeat': 'annualy'
    },
    'h8i9j0k1-l234-567m-no89-0123456ijkl': {
        'type': 'event',
        'title': 'Weekly Coding Bootcamp',
        'selectedDate': '2025-04-08T00:00:00.000000',
        'startTime': '2025-04-08T00:30:00.000000',
        'endTime': '2025-04-08T02:30:00.000000',
        'description': 'Advanced React.js workshop',
        'guests': [],
        'repeat': 'weekly'
    },
    'i9j0k1l2-m345-678n-op90-1234567jklm': {
        'type': 'event',
        'title': 'Dentist Appointment',
        'selectedDate': '2025-04-11T00:00:00.000000',
        'startTime': '2025-04-10T21:30:00.000000',
        'endTime': '2025-04-10T22:00:00.000000',
        'description': 'Dental cleaning appointment',
        'guests': [],
        'repeat': 'weekdays'
    },
    'j0k1l2m3-n456-789o-pq01-2345678klmn': {
        'type': 'event',
        'title': 'Quarterly Business Review',
        'selectedDate': '2025-04-16T00:00:00.000000',
        'startTime': '2025-04-15T19:30:00.000000',
        'endTime': '2025-04-15T21:30:00.000000',
        'description': 'Q1 business review with stakeholders',
        'guests': [{ 'name': 'CEO', 'email': 'ceo@company.com' },
        { 'name': 'CFO', 'email': 'cfo@company.com' }],
        'repeat': 'weekdays'
    }
}
