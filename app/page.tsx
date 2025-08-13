
import { Metadata } from "next";
import Home from "./pages/home";

export const metadata: Metadata = {
  title: 'Home - JamboLush | Vacation rentals, houses reservations',
  description: 'Discover unique vacation rentals and book your next getaway with JamboLush.'
}

export default function Main() {
  return (
    <>
    <Home />
    </>
  );
}
