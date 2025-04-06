/* eslint-disable react/prop-types */
import { useState } from "react"
import Navbar from "../components/Layout/Navbar"
import Sidebar from "../components/Layout/Sidebar"
import '../styles/App.css'
// import EventModal from "../components/Modals/EventModal"

function PrivateRoutes({ children }) {
    const [isSidebarExpended, setIsSidebarExpanded] = useState(true)

    return (
        <>
            <div className="app-container">
                <Navbar setIsSidebarExpanded={setIsSidebarExpanded} />
                <Sidebar isSidebarExpended={isSidebarExpended} />
                <div className={`app-body ${!isSidebarExpended ? "app-body-expanded" : "app-body-collapsed"}`}>
                    {children}
                </div>
                {/* {isModalOpen && (<EventModal setIsModalOpen={setIsModalOpen} />)} */}
            </div>
        </>
    )
}

export default PrivateRoutes