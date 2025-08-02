"use client";
import React from "react";
import { usePathname } from "next/navigation";
import "./styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Define routes where navbar should be hidden
  const hideNavbarRoutes = ["/all/login", "/all/signup", "/all/forgotpw"];
  
  // Check if current path should hide navbar
  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);
  
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        {!shouldHideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}