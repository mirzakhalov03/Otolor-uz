import { useRoutes } from "react-router-dom"
import Home from "../pages/home/Home"
import About from "../pages/about/About"
import Layout from "../components/layout/Layout"
import Appointments from "../pages/appointments/Appointments"
import Services from "../pages/servicesPage/Services"

export const RouteController = () => {

    return useRoutes([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                {
                    path: 'about',
                    element: <About />
                },
                {
                    path: 'appointments',
                    element: <Appointments />
                },
                {
                    path: 'services',
                    element: <Services />
                }
            ]
        }
    ])
}