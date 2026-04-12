import { lazy, Suspense } from "react"
import { useRoutes, Navigate } from "react-router-dom"
import Layout from "../components/layout/Layout"

// Admin imports
import { AdminLayout } from "../components/admin"
import { AdminRoute, GuestRoute } from "../components/guards"

const Home = lazy(() => import("../pages/home/Home"))
const About = lazy(() => import("../pages/about/About"))
const Appointments = lazy(() => import("../pages/appointments/Appointments"))
const Services = lazy(() => import("../pages/servicesPage/Services"))
const Courses = lazy(() => import("@/pages/academy/courses/Courses"))

// Admin pages
const AdminLogin = lazy(() => import("../pages/admin/login/AdminLogin"))
const DoctorsPage = lazy(() => import("../pages/admin/doctors/DoctorsPage"))
const AppointmentsPage = lazy(() => import("../pages/admin/appointments/AppointmentsPage"))

const withSuspense = (node: React.ReactNode) => (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
        {node}
    </Suspense>
)

export const RouteController = () => {

    return useRoutes([
        // Public routes
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: withSuspense(<Home />)
                },
                {
                    path: 'about',
                    element: withSuspense(<About />)
                },
                {
                    path: 'courses',
                    element: withSuspense(<Courses />)
                },
                {
                    path: 'appointments',
                    element: withSuspense(<Appointments />)
                },
                {
                    path: 'services',
                    element: withSuspense(<Services />)
                }
            ]
        },
        
        // Admin login (guest only - redirects if authenticated)
        {
            path: '/admins-otolor/login',
            element: (
                <GuestRoute>
                    {withSuspense(<AdminLogin />)}
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
                    element: <Navigate to="/admins-otolor/doctors" replace />
                },
                {
                    path: 'doctors',
                    element: withSuspense(<DoctorsPage />)
                },
                {
                    path: 'appointments',
                    element: withSuspense(<AppointmentsPage />)
                },
            ]
        }
    ])
}