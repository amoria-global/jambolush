"use client";

interface WhatsAppIconProps {
  phoneNumber: string; // Phone number in international format without '+' or spaces
}

export default function WhatsAppIcon({ phoneNumber }: WhatsAppIconProps) {
  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={openWhatsApp}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 p-7 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50 flex items-center justify-center w-12 h-12 cursor-pointer"
    >
      <i className="bi bi-whatsapp text-xl"></i>
    </button>
  );
}