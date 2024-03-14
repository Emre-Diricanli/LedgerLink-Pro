import { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { useLocation } from "react-router-dom";
import React from "react";
import { useSystems } from "../../Providers/SystemsProvider";

export function Layout({ children }: { children: React.ReactNode }) {
    const [showNavbar, setShowNavbar] = useState(false);
    const location = useLocation(); // Use useLocation hook to get the current route
    const systems = useSystems();

    useEffect(() => {
        const path = location.pathname; // Use location.pathname instead of window.location.pathname

        if (systems.publicPaths.includes(path)) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }

    }, [location.pathname]); // Depend on location.pathname to re-run on route changes

        return (
            <div className="page-container">
                {showNavbar ? (
                <>
                    <Navbar />
                    <div className="page-content">{children}</div>
                </>
                ) : (
                    // Render children directly if showNavbar is false
                    // This prevents children from being duplicated
                    <>{children}</>
                )}
            </div>
        );
    }
  