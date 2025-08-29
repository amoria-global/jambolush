import Hero from "../components/home/hero";
import HouseCard from "../components/home/houseCard";

const Home = () => {
 // Sample data for house rental/reservation
const houses = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Modern Villa with Pool",
    pricePerNight: "$120",
    location: "Beverly Hills, CA",
    beds: 4,
    baths: 3,
    rating: 4.9,
    reviews: 127,
    hostName: "Sarah M.",
    availability: "Available"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "Downtown Luxury Apartment",
    pricePerNight: "$89",
    location: "Manhattan, NY",
    beds: 2,
    baths: 2,
    rating: 4.7,
    reviews: 89,
    hostName: "Michael K.",
    availability: "Available"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Family Suburban Home",
    pricePerNight: "$65",
    location: "Austin, TX",
    beds: 3,
    baths: 2,
    rating: 4.8,
    reviews: 156,
    hostName: "Jessica L.",
    availability: "Available"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Beachfront Condominium",
    pricePerNight: "$95",
    location: "Miami, FL",
    beds: 2,
    baths: 2,
    rating: 4.6,
    reviews: 203,
    hostName: "Carlos R.",
    availability: "Booked"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Historic Townhouse",
    pricePerNight: "$78",
    location: "Boston, MA",
    beds: 3,
    baths: 3,
    rating: 4.5,
    reviews: 92,
    hostName: "Emily C.",
    availability: "Available"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Mountain View Estate",
    pricePerNight: "$185",
    location: "Aspen, CO",
    beds: 5,
    baths: 4,
    rating: 5.0,
    reviews: 67,
    hostName: "Robert H.",
    availability: "Available"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "City Skyline Penthouse",
    pricePerNight: "$250",
    location: "Chicago, IL",
    beds: 4,
    baths: 4,
    rating: 4.8,
    reviews: 145,
    hostName: "David W.",
    availability: "Available"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Cozy Ranch Style Home",
    pricePerNight: "$55",
    location: "Phoenix, AZ",
    beds: 3,
    baths: 2,
    rating: 4.4,
    reviews: 178,
    hostName: "Maria G.",
    availability: "Available"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "High-Rise Studio",
    pricePerNight: "$45",
    location: "Seattle, WA",
    beds: 1,
    baths: 1,
    rating: 4.3,
    reviews: 234,
    hostName: "Alex T.",
    availability: "Available"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Lakefront Retreat",
    pricePerNight: "$85",
    location: "Lake Tahoe, CA",
    beds: 2,
    baths: 2,
    rating: 4.7,
    reviews: 112,
    hostName: "Lisa P.",
    availability: "Booked"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1600566752734-90b5dc6b04ab?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Mediterranean Paradise",
    pricePerNight: "$165",
    location: "San Diego, CA",
    beds: 6,
    baths: 5,
    rating: 4.9,
    reviews: 98,
    hostName: "Antonio M.",
    availability: "Available"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Contemporary Urban Townhouse",
    pricePerNight: "$92",
    location: "Portland, OR",
    beds: 3,
    baths: 3,
    rating: 4.6,
    reviews: 167,
    hostName: "Rachel B.",
    availability: "Available"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1600607688960-e095ff4e4294?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Colonial Style Family Home",
    pricePerNight: "$72",
    location: "Richmond, VA",
    beds: 4,
    baths: 3,
    rating: 4.5,
    reviews: 134,
    hostName: "Thomas J.",
    availability: "Available"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "Luxury Rooftop Penthouse",
    pricePerNight: "$220",
    location: "Los Angeles, CA",
    beds: 3,
    baths: 3,
    rating: 4.8,
    reviews: 189,
    hostName: "Jennifer S.",
    availability: "Booked"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "Garden View Apartment",
    pricePerNight: "$68",
    location: "Nashville, TN",
    beds: 2,
    baths: 2,
    rating: 4.4,
    reviews: 145,
    hostName: "Mark D.",
    availability: "Available"
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=800&q=80",
    category: "Condo",
    title: "Ski Resort Condo",
    pricePerNight: "$105",
    location: "Park City, UT",
    beds: 2,
    baths: 2,
    rating: 4.7,
    reviews: 87,
    hostName: "Kevin L.",
    availability: "Available"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=800&q=80",
    category: "House",
    title: "Craftsman Bungalow",
    pricePerNight: "$82",
    location: "Denver, CO",
    beds: 3,
    baths: 2,
    rating: 4.6,
    reviews: 156,
    hostName: "Nicole F.",
    availability: "Available"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1600566752734-90b5dc6b04ab?auto=format&fit=crop&w=800&q=80",
    category: "Villa",
    title: "Countryside Estate",
    pricePerNight: "$145",
    location: "Napa Valley, CA",
    beds: 5,
    baths: 4,
    rating: 4.9,
    reviews: 76,
    hostName: "William R.",
    availability: "Available"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    category: "Townhouse",
    title: "Victorian Townhouse",
    pricePerNight: "$98",
    location: "San Francisco, CA",
    beds: 3,
    baths: 3,
    rating: 4.5,
    reviews: 123,
    hostName: "Catherine A.",
    availability: "Booked"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1600607688684-c79f4ff7ef03?auto=format&fit=crop&w=800&q=80",
    category: "Apartment",
    title: "Loft Style Apartment",
    pricePerNight: "$76",
    location: "Atlanta, GA",
    beds: 2,
    baths: 2,
    rating: 4.3,
    reviews: 198,
    hostName: "Jonathan V.",
    availability: "Available"
  },
  {
    id: 21,
    image: "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=800&q=80",
    category: "Penthouse",
    title: "Ocean View Penthouse",
    pricePerNight: "$320",
    location: "Malibu, CA",
    beds: 4,
    baths: 5,
    rating: 5.0,
    reviews: 54,
    hostName: "Stephanie H.",
    availability: "Available"
  }
];
    return (
      <div>
        <Hero onSearch={function (filters: any): void {
          throw new Error("Function not implemented.");
        } } />
        <div className="listings-container px-4 sm:px-6 lg:px-8 py-12 max-w-[1600px] mx-auto">
          {/* 7-column grid with proper responsive breakpoints */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
            {houses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        </div>
      </div>
    );
};

export default Home;