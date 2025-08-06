import React, { use } from 'react';

// Define a type for a single photo
type Photo = {
  url: string;
  alt: string;
};

// Define a type for a room, which contains a label and an array of photos
type Room = {
  label: string;
  photos: Photo[];
};

// Main App Component
const App: React.FC = () => {
  // Dummy data for the rooms and their photos
  const roomPhotos: Room[] = [
    {
      label: "Living room",
      photos: [
        { url: "/LivingRoom/LivingRoom1.png", alt: "Main living area" },
        { url: "/LivingRoom/LivingRoom2.png", alt: "Living room sofa" },
        { url: "/LivingRoom/LivingRoom3.png", alt: "View from living room" },
        { url: "/LivingRoom/LivingRoom4.png", alt: "Living room decor" },
        { url: "/LivingRoom/LivingRoom5.png", alt: "Living room with TV" },
        { url: "/LivingRoom/LivingRoom6.png", alt: "Cozy living room corner" },
        { url: "/LivingRoom/LivingRoom7.png", alt: "Living room with plants" },
        { url: "/LivingRoom/LivingRoom8.png", alt: "Living room with fireplace" },
        
      ],
    },
    {
      label: "Full kitchen",
      photos: [
        { url: "/kitchen/kitchen1.png", alt: "Fully equipped kitchen" },
        { url: "/kitchen/kitchen2.png", alt: "Kitchen countertop" },
        { url: "/kitchen/kitchen3.png", alt: "Kitchen with island" },
        { url: "/kitchen/kitchen4.png", alt: "Kitchen appliances" },
        { url: "/kitchen/kitchen5.png", alt: "Kitchen with dining area" },
        { url: "/kitchen/kitchen6.png", alt: "Kitchen storage" },
        
        
      ],
    },
    {
      label: "Dining area",
      photos: [
        { url: "/DiningArea/DiningArea1.png", alt: "Dining table setup" },
        { url: "/DiningArea/DiningArea2.png", alt: "Dining area details" },
      ],
    },
    {
      label: "Bedroom",
      photos: [
        { url: "/BedRoom/BedRoom1.png", alt: "Cozy bedroom" },
        { url: "/BedRoom/BedRoom2.png", alt: "Bedroom with bed" },
        { url: "/BedRoom/BedRoom3.png", alt: "Bedroom decor" },
        { url: "/BedRoom/BedRoom4.png", alt: "Bedroom with closet" },
        { url: "/BedRoom/BedRoom5.png", alt: "Bedroom with view" },
        
      ],
    },
    {
      label: "Full bathroom",
      photos: [
        { url: "/BathRoom/BathRoom1.png", alt: "Spacious bathroom" },
        { url: "/BathRoom/BathRoom2.png", alt: "Bathroom with shower" },
        { url: "/BathRoom/BathRoom3.png", alt: "Bathroom sink" },
        { url: "/BathRoom/BathRoom4.png", alt: "Bathroom decor" },
        { url: "/BathRoom/BathRoom5.png", alt: "Bathroom with tub" },
       
      ],
    },
    {
      label: "Workspace",
      photos: [
        { url: "/Workspace/Workspace1.png", alt: "Dedicated desk" },
        { url: "/Workspace/Workspace2.png", alt: "Workspace with computer" },
        { url: "/Workspace/Workspace3.png", alt: "Workspace with books" },
        { url: "/Workspace/Workspace4.png", alt: "Cozy workspace corner" },
      ],
    },
    {
      label: "Balcony",
      photos: [
        { url: "/Balcony/Balcony1.png", alt: "Balcony with a view" },
        { url: "/Balcony/Balcony2.png", alt: "Balcony seating area" },
        { url: "/Balcony/Balcony3.png", alt: "Balcony plants" },
        { url: "/Balcony/Balcony4.png", alt: "Balcony with table" },
        { url: "/Balcony/Balcony5.png", alt: "Balcony at sunset" },
       
      ],
    },
    {
      label: "Laundry area",
      photos: [
        { url: "/LaundryArea/LaundryArea1.png", alt: "Washer and dryer" },
        { url: "/LaundryArea/LaundryArea2.png", alt: "Laundry storage" },
        { url: "/LaundryArea/LaundryArea3.png", alt: "Laundry area details" },
        
      ],
    },
    {
      label: "Gym",
      photos: [
        { url: "/Gym/Gym1.png", alt: "Full gym equipment" },
        { url: "/Gym/Gym2.png", alt: "Gym with weights" },
        { url: "/Gym/Gym3.png", alt: "Gym cardio area" },
        { url: "/Gym/Gym4.png", alt: "Gym with mirrors" },
        { url: "/Gym/Gym5.png", alt: "Gym with yoga mats"}
        
      ],
    },
    {
      label: "Exterior",
      photos: [
        { url: "/Exterior/Exterior1.png", alt: "Building exterior" },
        { url: "/Exterior/Exterior2.png", alt: "Garden area" },
        { url: "/Exterior/Exterior3.png", alt: "Parking area" },
        { url: "/Exterior/Exterior4.png", alt: "Outdoor seating" },
        { url: "/Exterior/Exterior5.png", alt: "Building entrance" },
      ],
    },
    {
      label: "Childrens playroom",
      photos: [
        { url: "/PlayRoom/PlayRoom1.png", alt: "Colorful playroom" },
        { url: "/PlayRoom/PlayRoom2.png", alt: "Playroom with toys" },
        { url: "/PlayRoom/PlayRoom3.png", alt: "Playroom seating" },
        { url: "/PlayRoom/PlayRoom4.png", alt: "Playroom with games" },
      ],
    },
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen p-8">
      {/* Tailwind CSS CDN - for a quick, standalone example */}
      <script src="https://cdn.tailwindcss.com"></script>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Photo tours</h1>

      {/* Grid of clickable room thumbnails (now acts as navigation/overview) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
        {roomPhotos.map((room, index) => (
          <a
            key={index}
            href={`#${room.label.replace(/\s+/g, '-').toLowerCase()}`} // Anchor link to room section
            className="group block relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="w-full h-40">
              <img
                src={room.photos[0].url}
                alt={room.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors duration-300 flex items-end p-4">
              <span className="text-white font-semibold text-lg">{room.label}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Display all room photos on the same page */}
      <div className="space-y-12">
        {roomPhotos.map((room, roomIndex) => (
          <section key={roomIndex} id={room.label.replace(/\s+/g, '-').toLowerCase()} className="pt-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-3">{room.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {room.photos.map((photo, photoIndex) => (
                <div key={photoIndex} className="w-full h-auto aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  <img src={photo.url} alt={photo.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default App;
