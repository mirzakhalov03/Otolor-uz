import { useRoutes } from "react-router-dom"
import Home from "../pages/home/Home"
import About from "../pages/about/About"
import Layout from "../components/layout/Layout"

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
                }
            ]
        }
    ])
}