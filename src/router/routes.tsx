import { lazy, Suspense } from "react"
import { useRoutes, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
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
const CategoriesPage = lazy(() => import("../pages/admin/categories/CategoriesPage"))
const ServicesPage = lazy(() => import("../pages/admin/services/ServicesPage"))

const withSuspense = (node: React.ReactNode, loadingText: string) => (
    <Suspense fallback={<div style={{ padding: 24 }}>{loadingText}</div>}>
        {node}
    </Suspense>
)

export const RouteController = () => {
    const { t } = useTranslation()
    const loadingText = t("common.loading")

    return useRoutes([
        // Public routes
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    index: true,
                    element: withSuspense(<Home />, loadingText)
                },
                {
                    path: 'about',
                    element: withSuspense(<About />, loadingText)
                },
                {
                    path: 'courses',
                    element: withSuspense(<Courses />, loadingText)
                },
                {
                    path: 'appointments',
                    element: withSuspense(<Appointments />, loadingText)
                },
                {
                    path: 'services',
                    element: withSuspense(<Services />, loadingText)
                }
            ]
        },
        
        // Admin login (guest only - redirects if authenticated)
        {
            path: '/admins-otolor/login',
            element: (
                <GuestRoute>
                    {withSuspense(<AdminLogin />, loadingText)}
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
                    element: withSuspense(<DoctorsPage />, loadingText)
                },
                {
                    path: 'appointments',
                    element: withSuspense(<AppointmentsPage />, loadingText)
                },
                {
                    path: 'categories',
                    element: withSuspense(<CategoriesPage />, loadingText)
                },
                {
                    path: 'services',
                    element: withSuspense(<ServicesPage />, loadingText)
                },
            ]
        }
    ])
}