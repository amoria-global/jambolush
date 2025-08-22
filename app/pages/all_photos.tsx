import React from "react";

// Type for a single photo
type Photo = {
  url: string;
  alt: string;
};

// Type for a room
type Room = {
  label: string;
  photos: Photo[];
};

const App: React.FC = () => {
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
        { url: "/DiningArea/DiningArea1.png", alt: "Dining area with view" },
        { url: "/DiningArea/DiningArea2.png", alt: "Cozy dining corner" },
        { url: "/DiningArea/DiningArea1.png", alt: "Dining area decor" },
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
        { url: "/Gym/Gym5.png", alt: "Gym with yoga mats" },
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
    <div className="relative">
      <div className="font-sans bg-gray-50 min-h-screen mt-20 mb-8 mx-4 sm:mx-6 lg:mx-12 p-4 sm:p-6 lg:p-8 max-w-screen-xl mx-auto rounded-lg shadow-sm">
        {/* Back Button Container - Positioned to the top left */}
        <div className="absolute top-0 left-0 p-4 z-10">
          <a
            href=""
            className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <i className="bi bi-arrow-left ml-10 text-base"></i>
            Back
          </a>
        </div>
        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#083A85] mb-6 text-center">
          Photo Tours
        </h1>

        {/* Room Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-10">
          {roomPhotos.map((room, index) => (
            <a
              key={index}
              href={`#${room.label.replace(/\s+/g, "-").toLowerCase()}`}
              className="group block relative rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              <div className="w-full h-28 sm:h-36 md:h-40">
                <img
                  src={room.photos[0].url}
                  alt={room.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/*text color */}
              <div className="absolute inset-0 group-hover:bg-opacity-50 flex items-end p-2 sm:p-3">
                <span className="text-sm sm:text-sm md:text-sm font-bold text-black bg-white bg-opacity-800 rounded-lg px-3 shadow ">
                  {room.label}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Photo Sections */}
        <div className="space-y-10">
          {roomPhotos.map((room, roomIndex) => (
            <section
              key={roomIndex}
              id={room.label.replace(/\s+/g, "-").toLowerCase()}
              className="pt-2"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#083A85] mb-4 border-b border-gray-200 pb-2">
                {room.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {room.photos.map((photo, photoIndex) => (
                  <div
                    key={photoIndex}
                    className="w-full rounded-lg overflow-hidden shadow"
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;