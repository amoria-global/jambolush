import { Metadata } from "next";
import Home from "./pages/home";
export const metadata: Metadata = {
  title: "Jambolush - Home | Find your dream moment",
  description: "Discover your dream property with Jambolush. Explore listings, connect with agents, and make your real estate dreams a reality.",
};
// In your Home component file (e.g., app/pages/home.tsx)
export default function App() {
  return (
    <>
     <Home />
    </>
  );
}