import { lazy, Suspense } from "react"
import { useRoutes } from "react-router-dom"
import Layout from "../components/layout/Layout"

// Admin imports
import { AdminLayout } from "../components/admin"
import { AdminRoute, GuestRoute } from "../components/guards"

const Home = lazy(() => import("../pages/home/Home"))
const About = lazy(() => import("../pages/about/About"))
const Appointments = lazy(() => import("../pages/appointments/Appointments"))
const Services = lazy(() => import("../pages/servicesPage/Services"))
const Unauthorized = lazy(() => import("../pages/unauthorized/Unauthorized"))
const Courses = lazy(() => import("@/pages/academy/courses/Courses"))
const AdminLogin = lazy(() => import("../pages/admin/login/AdminLogin"))
const AdminDashboard = lazy(() => import("../pages/admin/dashboard/AdminDashboard"))
const ProfilePage = lazy(() => import("../pages/admin/profile/ProfilePage"))
const DoctorsPage = lazy(() => import("../pages/admin/doctors"))
const ServicesPage = lazy(() => import("../pages/admin/services"))

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
        
        // Unauthorized page
        {
            path: '/unauthorized',
            element: withSuspense(<Unauthorized />)
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
                    element: withSuspense(<AdminDashboard />)
                },
                {
                    path: 'profile',
                    element: withSuspense(<ProfilePage />)
                },
                {
                    path: 'doctors',
                    element: withSuspense(<DoctorsPage />)
                },
                {
                    path: 'services',
                    element: withSuspense(<ServicesPage />)
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