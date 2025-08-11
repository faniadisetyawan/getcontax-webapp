import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'var(--bs-primary)' }}>
            {children}
        </div>
    )
}
