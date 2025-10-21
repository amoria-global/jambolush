"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../api/apiService";
import { decodeId } from "@/app/utils/encoder";
import { formatPrice } from "@/app/utils/pricing";

interface PaymentPageProps {}

interface BookingData {
  id: string;
  propertyId: number;
  propertyName: string;
  hostId: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  priceBreakdown?: {
    price: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    payAtPropertyFee?: number;
    total: number;
  };
}

interface HostDetails {
  email: string;
  name: string;
  phone: string;
}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "online" | "property" | null
  >(null);
  const [onlinePaymentType, setOnlinePaymentType] = useState<
    "momo" | "card" | null
  >(null);
  const [momoProvider, setMomoProvider] = useState<
    "MTN" | "AIRTEL" | "MPESA" | "ORANGE" | null
  >(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+250");
  const [pollingStatus, setPollingStatus] = useState<string>("");
  const [pollCount, setPollCount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data && response.data.success) {
          setCurrentUser(response.data.data);
          if (response.data.data.phone) {
            setPhoneNumber(response.data.data.phone);
          }
        } else if (response.data) {
          setCurrentUser(response.data);
          if (response.data.phone) {
            setPhoneNumber(response.data.phone);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Load booking data
  useEffect(() => {
    const decodedId = decodeId(searchParams.get("bookingId") || "");
    const bookingId = decodedId;

    if (bookingId) {
      fetchBookingData(bookingId);
    } else {
      setErrors({ general: "Booking ID is required" });
      setFetchingBooking(false);
    }
  }, [searchParams]);

  const fetchBookingData = async (bookingId: string) => {
    try {
      setFetchingBooking(true);

      const response = await api.getBooking(bookingId);

      if (response.data.success && response.data.data) {
        const booking = response.data.data;

        const nights = Math.ceil(
          (new Date(booking.checkOut).getTime() -
            new Date(booking.checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        let propertyName = "Property Booking";
        let hostId = booking.hostId || 1;
        let hostData: HostDetails | null = null;

        try {
          const propertyResponse = await api.getProperty(booking.propertyId);
          if (propertyResponse.data.success && propertyResponse.data.data) {
            propertyName = propertyResponse.data.data.name || propertyName;
            hostId = propertyResponse.data.data.hostId || hostId;

            if (hostId) {
              try {
                const hostResponse = await api.get(`/me/${hostId}`);
                if (hostResponse.data.success && hostResponse.data.data) {
                  const host = hostResponse.data.data;
                  hostData = {
                    email: host.email || "host@example.com",
                    name: `${host.firstName || "Host"} ${
                      host.lastName || "Name"
                    }`,
                    phone: host.phone || "+250788123456",
                  };
                  setHostDetails(hostData);
                }
              } catch (error) {
                console.warn("Could not fetch host details:", error);
              }
            }
          }
        } catch (error) {
          console.warn("Could not fetch property details:", error);
        }

        const baseTotal = booking.totalPrice;
        const basePricePerNight = baseTotal / nights;
        const bookingSubtotal = baseTotal * 1.1;
        const taxes = baseTotal * 0.04;
        const total = bookingSubtotal + taxes;
        const bookingPricePerNight = bookingSubtotal / nights;

        const priceBreakdown = {
          price: bookingPricePerNight,
          subtotal: bookingSubtotal,
          cleaningFee: 0,
          serviceFee: baseTotal * 0.1,
          taxes: taxes,
          total: total,
        };

        setBookingData({
          id: booking.id,
          propertyId: booking.propertyId,
          propertyName,
          hostId,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          nights,
          totalPrice: booking.totalPrice,
          priceBreakdown,
        });
      } else {
        setErrors({ general: "Booking not found or invalid" });
      }
    } catch (error: any) {
      console.error("Failed to fetch booking:", error);

      // Handle 401 Unauthorized - redirect to login
      if (error?.status === 401 || error?.response?.status === 401) {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/all/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load booking details";
      setErrors({ general: errorMessage });
    } finally {
      setFetchingBooking(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (paymentMethod === "online") {
      if (!onlinePaymentType) {
        newErrors.onlinePaymentType = "Please select online payment type";
      }

      if (onlinePaymentType === "momo") {
        if (!momoProvider) {
          newErrors.momoProvider = "Please select a mobile money provider";
        }
        if (!phoneNumber || phoneNumber.trim() === "") {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!/^[0-9]{9,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
          newErrors.phoneNumber = "Please enter a valid phone number";
        }
      }
    }

    if (!agreedToTerms) {
      newErrors.terms = "Please agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete = () => {
    if (!paymentMethod || !agreedToTerms) return false;
    if (paymentMethod === "property") return true;
    if (paymentMethod === "online") {
      if (!onlinePaymentType) return false;
      if (onlinePaymentType === "momo") {
        return momoProvider !== null && phoneNumber.trim() !== "";
      }
      return true;
    }
    return false;
  };

  const calculateFinalTotal = () => {
    if (!bookingData) return 0;
    const baseTotal =
      bookingData.priceBreakdown?.total || bookingData.totalPrice;
    // Add 5% fee for pay at property
    return paymentMethod === "property" ? baseTotal * 1.05 : baseTotal;
  };

  const pollPaymentStatus = async (depositId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      try {
        attempts++;
        setPollCount(attempts);
        setPollingStatus("Verifying payment...");

        const response = await api.get(`/pawapay/deposit/${depositId}`);

        if (response.data.success) {
          const { status } = response.data.data;

          setPollingStatus(`Payment status: ${status}`);

          if (status === "COMPLETED" || status === "ACCEPTED") {
            setPollingStatus("Payment successful! Redirecting...");
            sessionStorage.setItem("payment_final_status", "success");
            setTimeout(() => {
              router.push(`/payment/success?tx=${depositId}`);
            }, 1000);
            return;
          }

          if (
            status === "FAILED" ||
            status === "REJECTED" ||
            status === "CANCELLED"
          ) {
            setPollingStatus("Payment failed. Redirecting...");
            setLoading(false);
            sessionStorage.setItem("payment_final_status", "failed");
            setTimeout(() => {
              router.push(`/payment/failed?tx=${depositId}`);
            }, 1000);
            return;
          }

          if (attempts < maxAttempts) {
            setTimeout(() => checkStatus(), 10000);
          } else {
            setPollingStatus(
              "Status check timeout. Please check your payment status."
            );
            setLoading(false);
            router.push(`/payment/pending?tx=${depositId}`);
          }
        } else {
          console.error("[PAYMENT] Failed to check status:", response.data);
          if (attempts < maxAttempts) {
            setTimeout(() => checkStatus(), 10000);
          } else {
            setPollingStatus("Failed to verify payment status");
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("[PAYMENT] Error polling status:", error);
        if (attempts < maxAttempts) {
          setTimeout(() => checkStatus(), 10000);
        } else {
          setPollingStatus("Error checking payment status");
          setLoading(false);
        }
      }
    };

    checkStatus();
  };

  const handleSubmit = async () => {
    if (!validateForm() || !bookingData || !currentUser) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const finalAmount = calculateFinalTotal();

      if (paymentMethod === "property") {
        // Handle pay at property - create deposit with Semo
        const depositPayload = {
          paymentMethod: "property",
          amount: finalAmount,
          email: currentUser.email,
          customerName:
            `${currentUser.firstName} ${currentUser.lastName}`.trim(),
          phoneNumber: currentUser.phone,
          description: `Payment for ${bookingData.propertyName}`,
          internalReference: bookingData.id,
        };

        const response = await api.post(
          "/transactions/deposit",
          depositPayload
        );

        if (response.data.success) {
          router.push(
            `/payment/success?method=property&booking=${bookingData.id}`
          );
        } else {
          setErrors({ general: "Failed to process pay at property option" });
        }
      } else {
        // Handle online payment using unified endpoint
        const endpoint = "/transactions/deposit";

        // Build request payload based on payment method
        let depositPayload: any = {
          paymentMethod: onlinePaymentType, // 'momo' or 'card'
          amount: finalAmount, // Amount in USD (will be auto-converted to RWF)
          description: `Payment for ${bookingData.propertyName}`,
          internalReference: bookingData.id,
        };

        // Add payment method specific fields
        if (onlinePaymentType === "momo") {
          depositPayload = {
            ...depositPayload,
            phoneNumber: `${countryCode.replace("+", "")}${phoneNumber}`,
            provider: `${momoProvider}_RWANDA`, // e.g., MTN_RWANDA, AIRTEL_RWANDA
            country: "RW",
          };
        } else if (onlinePaymentType === "card") {
          depositPayload = {
            ...depositPayload,
            email: currentUser.email || "guest@example.com",
            customerName:
              `${currentUser.firstName || ""} ${
                currentUser.lastName || ""
              }`.trim() || "Guest",
            phoneNumber: phoneNumber || currentUser.phone || "0780000000",
          };
        }

        const response = await api.post(endpoint, depositPayload);

        if (response.data.success) {
          const {
            depositId,
            refId,
            paymentUrl,
            status,
            amountUSD,
            amountRWF,
            exchangeRate,
          } = response.data.data;

          sessionStorage.setItem("payment_transaction_id", depositId || refId);
          sessionStorage.setItem("property_booking_id", bookingData.id);

          // For card payments, redirect to paymentUrl
          if (onlinePaymentType === "card" && paymentUrl) {
            window.location.href = paymentUrl;
          } else if (onlinePaymentType === "momo") {
            // For mobile money, user receives prompt on their phone
            alert(
              `Please check your phone for payment prompt. Amount: ${amountRWF} RWF (${amountUSD} USD)`
            );
            pollPaymentStatus(depositId);
          }
        } else {
          setErrors({
            general:
              response.data.message ||
              "Failed to create payment. Please try again.",
          });
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error("[PAYMENT] Error:", error);

      // Handle 401 Unauthorized - redirect to login
      if (error?.status === 401 || error?.response?.status === 401) {
        const currentUrl = window.location.pathname + window.location.search;
        router.push(`/all/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      const errorMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Payment failed. Please try again.";
      setErrors({ general: errorMessage });
      setLoading(false);
    } finally {
      if (paymentMethod !== "online" || onlinePaymentType !== "momo") {
        setLoading(false);
      }
    }
  };

  // Loading state
  if (fetchingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#083A85] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (errors.general && !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <div className="text-red-500 mb-4">
            <i className="bi bi-exclamation-circle text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mb-6">{errors.general}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-[#083A85] text-white rounded-lg hover:bg-[#062a5f] transition font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = calculateFinalTotal();

  return (
    <>
      <head>
        <title>Confirm and pay · RentSpaces</title>
      </head>
      <div className="mt-20  px-4 bg-white">
        {/* Header */}
        <div className="border-b">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-4 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition mr-4"
            >
              <i className="bi bi-chevron-left text-lg"></i>
            </button>
            <h1 className="text-xl font-semibold">Confirm and pay</h1>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left Side - Payment Form */}
            <div className="lg:col-span-3">
              {/* Your trip */}
              <div className="mb-4">
                <h2 className="text-[22px] font-medium mb-6">Your trip</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Dates</h3>
                    <p className="text-gray-600">
                      {bookingData &&
                        new Date(bookingData.checkIn).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                      –{" "}
                      {bookingData &&
                        new Date(bookingData.checkOut).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Guests</h3>
                    <p className="text-gray-600">
                      {bookingData?.guests} guest
                      {bookingData?.guests !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Choose how to pay */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-6">
                  Choose how to pay
                </h2>

                {errors.paymentMethod && (
                  <div className="mb-4 text-red-500 text-sm">
                    {errors.paymentMethod}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Pay Now Option */}
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setPaymentMethod("online");
                      setErrors({});
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="mt-1 w-5 h-5 accent-[#083A85] cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Pay now</h3>
                          <span className="text-[22px] font-semibold">
                            $
                            {(
                              bookingData?.priceBreakdown?.total ||
                              bookingData?.totalPrice ||
                              0
                            ).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay the full amount to confirm your reservation
                        </p>
                      </div>
                    </div>

                    {paymentMethod === "online" && (
                      <div className="mt-6 ml-8 space-y-3">
                        <div
                          className={`border rounded-lg p-3 cursor-pointer transition ${
                            onlinePaymentType === "momo"
                              ? "border-[#083A85] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setOnlinePaymentType("momo")}
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="onlinePayment"
                              checked={onlinePaymentType === "momo"}
                              onChange={() => setOnlinePaymentType("momo")}
                              className="w-4 h-4 accent-[#083A85]"
                            />
                            <span className="font-medium text-sm">
                              Mobile Money
                            </span>
                          </label>

                          {onlinePaymentType === "momo" && (
                            <div className="mt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                  Select carrier first
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    {
                                      name: "MTN",
                                      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg",
                                    },
                                    {
                                      name: "AIRTEL",
                                      logo: "https://upload.wikimedia.org/wikipedia/commons/d/da/Airtel_Africa_logo.svg",
                                    },
                                    {
                                      name: "MPESA",
                                      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/240px-M-PESA_LOGO-01.svg.png",
                                    },
                                    {
                                      name: "ORANGE",
                                      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/240px-Orange_logo.svg.png",
                                    },
                                  ].map((provider) => (
                                    <button
                                      key={provider.name}
                                      type="button"
                                      onClick={() =>
                                        setMomoProvider(provider.name as any)
                                      }
                                      className={`p-3 rounded-lg border-2 transition flex items-center justify-center gap-2 ${
                                        momoProvider === provider.name
                                          ? "border-[#083A85] bg-blue-50"
                                          : "border-gray-300 hover:border-gray-400 bg-white"
                                      }`}
                                    >
                                      <img
                                        src={provider.logo}
                                        alt={provider.name}
                                        className="h-6 object-contain"
                                      />
                                      <span className="text-xs font-medium">
                                        {provider.name === "MPESA"
                                          ? "M-Pesa"
                                          : provider.name === "ORANGE"
                                          ? "Money"
                                          : ""}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                                {errors.momoProvider && (
                                  <p className="text-red-500 text-sm mt-2">
                                    {errors.momoProvider}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                  Phone number
                                </label>
                                <div className="flex gap-2">
                                  <select
                                    value={countryCode}
                                    onChange={(e) =>
                                      setCountryCode(e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#083A85] bg-white"
                                  >
                                    <option value="+250">
                                      🇷🇼 +250 (Rwanda)
                                    </option>
                                    <option value="+254">
                                      🇰🇪 +254 (Kenya)
                                    </option>
                                    <option value="+255">
                                      🇹🇿 +255 (Tanzania)
                                    </option>
                                    <option value="+256">
                                      🇺🇬 +256 (Uganda)
                                    </option>
                                    <option value="+257">
                                      🇧🇮 +257 (Burundi)
                                    </option>
                                    <option value="+243">🇨🇩 +243 (DRC)</option>
                                    <option value="+251">
                                      🇪🇹 +251 (Ethiopia)
                                    </option>
                                    <option value="+27">
                                      🇿🇦 +27 (South Africa)
                                    </option>
                                    <option value="+234">
                                      🇳🇬 +234 (Nigeria)
                                    </option>
                                    <option value="+233">
                                      🇬🇭 +233 (Ghana)
                                    </option>
                                    <option value="+225">
                                      🇨🇮 +225 (Côte d'Ivoire)
                                    </option>
                                    <option value="+221">
                                      🇸🇳 +221 (Senegal)
                                    </option>
                                  </select>
                                  <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                      setPhoneNumber(e.target.value)
                                    }
                                    placeholder="7XX XXX XXX"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#083A85]"
                                  />
                                </div>
                                {errors.phoneNumber && (
                                  <p className="text-red-500 text-sm mt-2">
                                    {errors.phoneNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`border rounded-lg p-3 cursor-pointer transition ${
                            onlinePaymentType === "card"
                              ? "border-[#083A85] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setOnlinePaymentType("card")}
                        >
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="onlinePayment"
                              checked={onlinePaymentType === "card"}
                              onChange={() => setOnlinePaymentType("card")}
                              className="w-4 h-4 accent-[#083A85] mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">
                                  Credit or debit card
                                </span>
                                <div className="flex items-center gap-1">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/240px-Visa_Inc._logo.svg.png"
                                    alt="Visa"
                                    className="h-4"
                                  />
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/240px-Mastercard-logo.svg.png"
                                    alt="Mastercard"
                                    className="h-4"
                                  />
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/240px-American_Express_logo_%282018%29.svg.png"
                                    alt="Amex"
                                    className="h-4"
                                  />
                                </div>
                              </div>
                              {onlinePaymentType === "card" && (
                                <p className="text-xs text-gray-600 mt-1">
                                  You will be redirected to enter card details
                                </p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pay at Property Option */}
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "property"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setPaymentMethod("property");
                      setErrors({});
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "property"}
                        onChange={() => setPaymentMethod("property")}
                        className="mt-1 w-5 h-5 accent-[#083A85] cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Pay at property</h3>
                          <div className="text-right">
                            <span className="text-[22px] font-semibold">
                              ${finalTotal.toFixed(2)}
                            </span>
                            <p className="text-xs text-gray-500">
                              incl. 5% service fee
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay when you arrive. A 5% service fee applies for this
                          option.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required for your trip */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-6">
                  Required for your trip
                </h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-medium mb-2">Message the host</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Let the host know a little about yourself and why you're
                    coming.
                  </p>
                  <textarea
                    placeholder="Hi! I'm looking forward to staying at your place..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#083A85] min-h-[100px]"
                  />
                </div>
              </div>

              {/* Cancellation policy */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-4">
                  Cancellation policy
                </h2>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">
                    Free cancellation before 2:00 PM on{" "}
                    {bookingData &&
                      new Date(
                        new Date(bookingData.checkIn).getTime() -
                          24 * 60 * 60 * 1000
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    .
                  </span>{" "}
                  After that, the reservation is non-refundable.
                </p>
                <button className="font-medium underline">Learn more</button>
              </div>

              {/* Ground rules */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-4">Ground rules</h2>
                <p className="text-gray-600 mb-4">
                  We ask every guest to remember a few simple things about what
                  makes a great guest.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Follow the house rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Treat your Host's home like your own</span>
                  </li>
                </ul>
              </div>

              {/* Terms */}
              <div className="border-t pt-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#083A85] cursor-pointer"
                  />
                  <div className="text-sm text-gray-600">
                    I agree to the{" "}
                    <button className="underline">House Rules</button>,{" "}
                    <button className="underline">Cancellation Policy</button>,
                    and <button className="underline">RentSpaces Terms</button>
                  </div>
                </label>
                {errors.terms && (
                  <p className="text-red-500 text-sm mt-2 ml-8">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                {pollingStatus && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#083A85] mr-2"></div>
                      <p className="text-[#083A85] text-sm font-medium">
                        {pollingStatus}
                      </p>
                    </div>
                  </div>
                )}

                {errors.general && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">
                      <i className="bi bi-exclamation-triangle mr-2"></i>
                      {errors.general}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !isFormComplete()}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    loading || !isFormComplete()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="bi bi-arrow-clockwise animate-spin"></i>
                      Processing...
                    </span>
                  ) : (
                    `Confirm and pay $${finalTotal.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Booking Summary */}
            <div className="lg:col-span-2">
              <div className="border rounded-xl p-6 sticky top-24">
                <div className="flex gap-4 pb-6 border-b">
                  <div className="w-28 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">
                      {bookingData?.propertyName}
                    </h3>
                    <p className="text-xs text-gray-600">Entire rental unit</p>
                    <div className="flex items-center gap-1 mt-2">
                      <i className="bi bi-star-fill text-xs"></i>
                      <span className="text-xs font-medium">4.87</span>
                      <span className="text-xs text-gray-500">
                        (23 reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b">
                  <h3 className="font-medium mb-4">Price details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">
                        ${(bookingData?.priceBreakdown?.price || 0).toFixed(2)}{" "}
                        x {bookingData?.nights} nights
                      </span>
                      <span>
                        $
                        {(bookingData?.priceBreakdown?.subtotal || 0).toFixed(
                          2
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 underline">Taxes</span>
                      <span>
                        ${(bookingData?.priceBreakdown?.taxes || 0).toFixed(2)}
                      </span>
                    </div>
                    {paymentMethod === "property" && (
                      <div className="flex justify-between text-base">
                        <span className="text-gray-600 underline">
                          Pay at property fee (5%)
                        </span>
                        <span>
                          $
                          {(
                            finalTotal -
                            (bookingData?.priceBreakdown?.total || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total (USD)</span>
                    <span className="text-base font-semibold">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
