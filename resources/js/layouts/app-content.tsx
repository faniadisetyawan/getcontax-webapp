import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import AppFooter from "./app-footer";

interface AppContentProps {
    children: ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
    const { url } = usePage();

    return (
        <section className="app-content">
            <AnimatePresence mode="wait">
                <motion.div
                    key={url}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                    className="app-page"
                >
                    <div className="app-page-card">
                        {children}
                    </div>
                </motion.div>
            </AnimatePresence>

            <AppFooter />
        </section>
    )
}
