import { useRoutes } from "react-router-dom"
import Home from "../pages/home/Home"
import About from "../pages/about/About"

export const RouteController = () => {

    return useRoutes([
        {
            path: "/",
            element: <Home/>
        }, 
        {
            path: '/about',
            element: <About/>
        }
    ])
}