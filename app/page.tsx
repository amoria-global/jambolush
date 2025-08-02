
export default function Home() {
  return (
    <>
    <head>
      <title>Home - JamboLush | Vacation rentals, houses reservations</title>
      <meta name="description" content="Welcome to JamboLush, your go-to platform for unique experiences." />
    </head>
     {/* Demo content to show scroll effect */}
      <div className="h-screen bg-gradient-to-br from-[#083A85] to-[#F20C8F] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to JamboLush</h1>
          <p className="text-xl opacity-90">House Rentals Made Easy</p>
        </div>
      </div>
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Easy and affordable for you</h2>
          <p className="text-gray-600">The affordable way to book your next vacation rental.</p>
        </div>
      </div>
    </>
  );
}
