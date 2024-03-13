import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { useLocation } from "react-router-dom";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
    const nonNavbarRoutes = ["/admin-signin", "/user-signin"];
    const [showNavbar, setShowNavbar] = useState(false);
    const location = useLocation(); // Use useLocation hook to get the current route


    useEffect(() => {
        const path = location.pathname; // Use location.pathname instead of window.location.pathname
        console.log("Changing layout for path", path)

        if (nonNavbarRoutes.includes(path)) {
            console.log("Navbar not shown for: ", path);
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
  