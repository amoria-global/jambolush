"use client";
import React from "react";
import "./styles/globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      <body >
        <Navbar />
        {children}
      </body>
    </html>

  );
}
