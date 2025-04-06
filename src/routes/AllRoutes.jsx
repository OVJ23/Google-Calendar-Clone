import { Route, Routes } from "react-router-dom"
import Day from "../pages/Day"
import Week from "../pages/Week"
import Month from "../pages/Month"
import Year from "../pages/Year"
import PrivateRoutes from "./PrivateRoutes"

function AllRoutes() {
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoutes>
                            <Week />
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/day"
                    element={
                        <PrivateRoutes>
                            <Day />
                        </PrivateRoutes>
                    }
                />

                <Route
                    path="/week"
                    element={
                        <PrivateRoutes>
                            <Week />
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/month"
                    element={
                        <PrivateRoutes>
                            <Month />
                        </PrivateRoutes>
                    }
                />
                <Route
                    path="/year"
                    element={
                        <PrivateRoutes>
                            <Year />
                        </PrivateRoutes>
                    }
                />
            </Routes>
        </>
    )
}

export default AllRoutes