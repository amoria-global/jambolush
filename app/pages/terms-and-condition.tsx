const AgreementPage: React.FC = () => {
  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-4 font-sans">
      {/* Bootstrap CSS and JS CDNs */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

      <div className="w-100 bg-white shadow-lg position-relative" style={{ maxWidth: '960px' }}>
        {/* Red accent bar on the right */}
        <div className="position-absolute top-0 end-0 h-100 w-2 bg-danger"></div>

        <div className="p-4 p-md-5 border border-2 border-gray-300 m-4 rounded-3">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-gray-800">TERMS AND CONDITIONS</h1>
          </div>

          {/* Last updated banner */}
          <div className="bg-black text-white p-3 mb-4 text-center rounded">
            <p className="fw-bold mb-0">Last updated: June 21, 2025</p>
          </div>

          {/* Main Content Box */}
          <div className="bg-white p-4 rounded-3 shadow-sm border border-gray-300">
            <div className="overflow-auto" style={{ height: '450px' }}>
              <p className="mb-4">
                Please read these Terms and Conditions carefully before using Jambolush. By accessing or using our platform, you agree to be bound by these terms. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">1. Definitions</h2>
              <p className="mb-4">
                Jambolush refers to our digital platform offering property and spot booking services. "User" refers to anyone who registers or accesses the platform. "Owner" means a user who lists a house, office, or spot. "Seeker" means a user who searches or books listed properties. "Listing" is any property made available on the platform.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">2. Account Responsibilities</h2>
              <p className="mb-4">
                Users are responsible for maintaining the security of their accounts. You must notify us immediately if you suspect any unauthorized access or breach of your account.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">3. Booking and Payment</h2>
              <p className="mb-4">
                Bookings made through Temzula are binding. Users agree to pay using one of the accepted payment methods: Mobile Money (MoMo), MPesa, VISA, Mastercard, or PayPal. Owners agree to accept payments and confirm bookings via the platform.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">4. Cancellation & Refunds</h2>
              <p className="mb-4">
                Each listing may have its own cancellation policy. Users should review terms before booking. Refunds, if applicable, will follow the owner’s policy as stated in the listing.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">5. Prohibited Activities</h2>
              <p className="mb-4">
                Users may not post false information, impersonate others, or attempt fraud. Use of the platform for unlawful or abusive purposes is strictly prohibited.
              </p>

              <h2 className="h5 fw-bold text-gray-800 mt-4 mb-2">6. Intellectual Property</h2>
              <p className="mb-0">
                All content on Temzula including branding, interface, and design is owned by the platform. You may not copy, reuse, or redistribute platform materials without written permission.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
            <button
              onClick={() => alert("Downloading agreement...")}
              className="btn btn-outline-danger fw-bold py-2 px-4 mb-3 mb-md-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download me-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
            <div className="d-flex w-100 w-md-auto space-x-3">
              <button
                onClick={() => alert("You have declined the terms.")}
                className="btn btn-outline-danger fw-bold py-2 px-4 flex-grow-1 me-2"
              >
                Decline
              </button>
              <button
                onClick={() => alert("You have accepted the terms.")}
                className="btn btn-primary fw-bold py-2 px-4 flex-grow-1"
                style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;