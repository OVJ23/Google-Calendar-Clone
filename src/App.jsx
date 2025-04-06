import { BrowserRouter } from 'react-router-dom'
import { DateProvider } from './contexts/DateContext';
import AllRoutes from './routes/AllRoutes'
import './styles/App.css'
import { EventProvider } from './contexts/EventContext';
function App() {
  return (
    <>
      <BrowserRouter basename="/calendar">
        <DateProvider>
          <EventProvider>
            <AllRoutes />
          </EventProvider>
        </DateProvider>
      </BrowserRouter>
    </>
  )
}

export default App
