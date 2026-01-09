import { useRoutes } from "react-router-dom"
import Home from "../pages/home/Home"

export const RouteController = () => {

    return useRoutes([
        {
            path: "/",
            element: <Home/>
        }
    ])
}