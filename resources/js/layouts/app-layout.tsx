import { ReactNode, useState } from "react";
import AppSidebar from "./app-sidebar";
import AppContent from "./app-content";
import AppHeader from "./app-header";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const MySwalTheme = MySwal.mixin({
    customClass: {
        confirmButton: 'btn btn-primary mx-1',
        cancelButton: 'btn btn-light mx-1',
        closeButton: 'btn btn-light mx-1',
        denyButton: 'btn btn-danger mx-1',
    },
    buttonsStyling: false,
});

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

    return (
        <main className="app-layout">
            <AppHeader
                setIsSidebarMobileOpen={setIsSidebarMobileOpen}
            />
            <AppSidebar
                isSidebarMobileOpen={isSidebarMobileOpen}
                setIsSidebarMobileOpen={setIsSidebarMobileOpen}
            />
            <AppContent>{children}</AppContent>

            <ToastContainer />
        </main>
    )
}
