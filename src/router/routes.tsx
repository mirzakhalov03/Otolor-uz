import { useRoutes } from "react-router-dom"
import Home from "../pages/home/Home"
import About from "../pages/about/About"
import Academy from "../pages/academy/Academy"
import Layout from "../components/layout/Layout"
import Appointments from "../pages/appointments/Appointments"
import Services from "../pages/servicesPage/Services"
import Unauthorized from "../pages/unauthorized/Unauthorized"

// Admin imports
import { AdminLayout } from "../components/admin"
import { AdminLogin, AdminDashboard } from "../pages/admin"
import { AdminRoute, GuestRoute } from "../components/guards"

export const RouteController = () => {

    return useRoutes([
        // Public routes
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
                    path: 'academy',
                    element: <Academy />
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
        },
        
        // Unauthorized page
        {
            path: '/unauthorized',
            element: <Unauthorized />
        },
        
        // Admin login (guest only - redirects if authenticated)
        {
            path: '/admins-otolor/login',
            element: (
                <GuestRoute>
                    <AdminLogin />
                </GuestRoute>
            )
        },
        
        // Admin protected routes
        {
            path: '/admins-otolor',
            element: (
                <AdminRoute>
                    <AdminLayout />
                </AdminRoute>
            ),
            children: [
                {
                    index: true,
                    element: <AdminDashboard />
                },
                {
                    path: 'doctors',
                    element: <div>Doctors Management (Coming Soon)</div>
                },
                {
                    path: 'services',
                    element: <div>Services Management (Coming Soon)</div>
                },
                {
                    path: 'appointments',
                    element: <div>Appointments Management (Coming Soon)</div>
                },
                {
                    path: 'blogs',
                    element: <div>Blogs Management (Coming Soon)</div>
                },
                {
                    path: 'users',
                    element: <div>Users Management (Coming Soon)</div>
                },
                {
                    path: 'roles',
                    element: <div>Roles & Permissions (Coming Soon)</div>
                },
            ]
        }
    ])
}