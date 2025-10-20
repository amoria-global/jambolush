"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/api/apiService";
import { decodeId } from "@/app/utils/encoder";
import { calculatePriceBreakdown } from "@/app/utils/pricing";

interface TourBookingData {
  id: string;
  tourId: number;
  tourTitle: string;
  hostId: number;
  scheduleId: string;
  scheduleDate: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  numberOfParticipants: number;
  participants: Array<{
    name: string;
    age: number;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  }>;
  totalAmount: number;
  pricePerPerson: number;
  basePricePerPerson: number;
  status: string;
  specialRequests?: string;
  tourDetails?: {
    duration: number;
    difficulty: string;
    locationCity: string;
    locationCountry: string;
    meetingPoint: string;
    images?: any;
  };
  priceBreakdown?: {
    basePrice: number;
    displayPrice: number;
    subtotal: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
}

interface HostDetails {
  email: string;
  name: string;
  phone: string;
}

const TourPaymentPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<TourBookingData | null>(null);
  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [fetchingBooking, setFetchingBooking] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card" | null>(
    null
  );
  const [momoProvider, setMomoProvider] = useState<
    "MTN" | "AIRTEL" | "MPESA" | "ORANGE" | null
  >(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+250");
  const [pollingStatus, setPollingStatus] = useState<string>("");
  const [pollCount, setPollCount] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [specialMessage, setSpecialMessage] = useState("");

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
      fetchTourBookingData(bookingId);
    } else {
      setErrors({ general: "Booking ID is required" });
      setFetchingBooking(false);
    }
  }, [searchParams]);

  const fetchTourBookingData = async (bookingId: string) => {
    try {
      setFetchingBooking(true);

      const response = await api.get(`/tours/guest/bookings/${bookingId}`);

      if (response.data.success && response.data.data) {
        const booking = response.data.data;

        let tourDetails: any = null;
        let hostId = booking.hostId || 1;
        let hostData: HostDetails | null = null;

        try {
          const tourResponse = await api.get(`/tours/${booking.tourId}`);
          if (tourResponse.data.success && tourResponse.data.data) {
            const tour = tourResponse.data.data;
            tourDetails = {
              duration: tour.duration,
              difficulty: tour.difficulty,
              locationCity: tour.locationCity,
              locationCountry: tour.locationCountry,
              meetingPoint: tour.meetingPoint,
              images: tour.images,
            };
            hostId = tour.hostId || hostId;

            if (hostId) {
              try {
                const hostResponse = await api.get(`/users/${hostId}`);
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
          console.warn("Could not fetch tour details:", error);
        }

        let scheduleDetails = {
          scheduleDate: booking.scheduleDate || "TBD",
          scheduleStartTime: booking.scheduleStartTime || "09:00",
          scheduleEndTime: booking.scheduleEndTime || "17:00",
        };

        if (booking.scheduleId && tourDetails) {
          try {
            const scheduleResponse = await api.get(
              `/tours/${booking.tourId}/schedules`
            );
            if (scheduleResponse.data.success && scheduleResponse.data.data) {
              const schedule = scheduleResponse.data.data;
              scheduleDetails = {
                scheduleDate: schedule.startDate,
                scheduleStartTime: schedule.startTime,
                scheduleEndTime: schedule.endTime,
              };
            }
          } catch (error) {
            console.warn("Could not fetch schedule details:", error);
          }
        }

        const displayPricePerPerson =
          booking.totalAmount / booking.numberOfParticipants;
        const basePricePerPerson = displayPricePerPerson;

        const priceBreakdown = calculatePriceBreakdown(
          basePricePerPerson,
          booking.numberOfParticipants,
          false
        );

        setBookingData({
          id: booking.id,
          tourId: booking.tourId,
          tourTitle: booking.tourTitle || "Tour Experience",
          hostId,
          scheduleId: booking.scheduleId,
          ...scheduleDetails,
          numberOfParticipants: booking.numberOfParticipants,
          participants: booking.participants || [],
          totalAmount: booking.totalAmount,
          pricePerPerson: displayPricePerPerson,
          basePricePerPerson: basePricePerPerson,
          status: booking.status,
          specialRequests: booking.specialRequests,
          tourDetails,
          priceBreakdown: {
            basePrice: basePricePerPerson,
            displayPrice: displayPricePerPerson,
            subtotal: displayPricePerPerson * booking.numberOfParticipants,
            serviceFee: priceBreakdown.serviceFee,
            taxes: priceBreakdown.taxes,
            total: priceBreakdown.total,
          },
        });
      } else {
        setErrors({ general: "Tour booking not found or invalid" });
      }
    } catch (error: any) {
      console.error("Failed to fetch tour booking:", error);

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

    if (paymentMethod === "momo") {
      if (!momoProvider) {
        newErrors.momoProvider = "Please select a mobile money provider";
      }
      if (!phoneNumber || phoneNumber.trim() === "") {
        newErrors.phoneNumber = "Phone number is required for mobile money";
      } else if (!/^[0-9]{9,15}$/.test(phoneNumber.replace(/\s/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number";
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
    if (paymentMethod === "momo") {
      return momoProvider !== null && phoneNumber.trim() !== "";
    }
    return true;
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
          const depositData = response.data.data?.data || response.data.data;
          const { status, failureReason } = depositData;

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
            const failureMessage =
              failureReason?.failureMessage || "Payment failed";
            setPollingStatus(`Payment failed: ${failureMessage}`);
            setLoading(false);
            sessionStorage.setItem("payment_final_status", "failed");
            sessionStorage.setItem("payment_failure_reason", failureMessage);

            setTimeout(() => {
              router.push(
                `/payment/failed?tx=${depositId}&error=${encodeURIComponent(
                  failureMessage
                )}`
              );
            }, 2000);
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

      const finalAmount =
        bookingData.priceBreakdown?.total || bookingData.totalAmount;

      // Unified endpoint for all payment methods
      const endpoint = "/api/transactions/deposit";

      // Build request payload based on payment method
      let depositPayload: any = {
        paymentMethod: paymentMethod, // 'momo' or 'card'
        amount: finalAmount, // Amount in USD (will be auto-converted to RWF)
        description: `Payment for ${bookingData.tourTitle}`,
        internalReference: bookingData.id,
      };

      // Add payment method specific fields
      if (paymentMethod === "momo") {
        depositPayload = {
          ...depositPayload,
          phoneNumber: `${countryCode.replace("+", "")}${phoneNumber}`,
          provider: `${momoProvider}_RWANDA`, // e.g., MTN_RWANDA, AIRTEL_RWANDA
          country: "RW",
        };
      } else if (paymentMethod === "card") {
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
        sessionStorage.setItem("tour_booking_id", bookingData.id);

        // For card payments, redirect to paymentUrl
        if (paymentMethod === "card" && paymentUrl) {
          window.location.href = paymentUrl;
        } else if (paymentMethod === "momo") {
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
    } catch (error: any) {
      console.error("[PAYMENT] Deposit error:", error);

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
      if (paymentMethod !== "momo") {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      moderate: "bg-yellow-100 text-yellow-800",
      challenging: "bg-red-100 text-red-800",
    };
    return (
      colors[difficulty?.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
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
            onClick={() => router.push("/tours")}
            className="px-6 py-3 bg-[#083A85] text-white rounded-lg hover:bg-[#062a5f] transition font-medium"
          >
            Browse Tours
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Confirm and pay · Experience</title>
      </head>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="pt-14">
          <div className="max-w-[1280px] mx-auto px-2 sm:px-7 py-4 flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition mr-4"
            >
              <i className="bi bi-chevron-left text-lg"></i>
            </button>
            <h1 className="text-2xl font-semibold">Confirm and pay</h1>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 sm:px-10 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            {/* Left Side - Payment Form */}
            <div className="lg:col-span-3">
              {/* Your experience */}
              <div className="mb-10">
                <h2 className="text-[22px] font-medium mb-6">
                  Your experience
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Date & Time</h3>
                    <p className="text-gray-600">
                      {formatDate(bookingData?.scheduleDate || "")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {bookingData?.scheduleStartTime} -{" "}
                      {bookingData?.scheduleEndTime}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Participants</h3>
                    <p className="text-gray-600">
                      {bookingData?.numberOfParticipants}{" "}
                      {bookingData?.numberOfParticipants === 1
                        ? "person"
                        : "people"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Meeting point</h3>
                    <p className="text-gray-600">
                      {bookingData?.tourDetails?.meetingPoint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Participant Details */}
              {bookingData?.participants &&
                Array.isArray(bookingData.participants) &&
                bookingData.participants.length > 0 && (
                  <div className="border-t pt-8 pb-8">
                    <h2 className="text-[22px] font-medium mb-6">
                      Participant details
                    </h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="space-y-4">
                        {bookingData.participants.map((participant, idx) => (
                          <div
                            key={idx}
                            className="pb-4 last:pb-0 last:border-0 border-b"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">
                                  Participant {idx + 1}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {participant.name}, Age: {participant.age}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Emergency:{" "}
                                  {participant.emergencyContact?.name} (
                                  {participant.emergencyContact?.relationship})
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Choose how to pay */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-6">Pay with</h2>

                {errors.paymentMethod && (
                  <div className="mb-4 text-red-500 text-sm">
                    {errors.paymentMethod}
                  </div>
                )}

                <div className="space-y-3">
                  {/* Mobile Money Option */}
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "momo"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setPaymentMethod("momo");
                      setErrors({});
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "momo"}
                        onChange={() => setPaymentMethod("momo")}
                        className="mt-1 w-5 h-5 accent-[#083A85] cursor-pointer"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">Mobile Money</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay with MTN, Airtel, or M-Pesa
                        </p>
                      </div>
                    </div>

                    {paymentMethod === "momo" && (
                      <div className="mt-6 ml-8 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-3 text-gray-700">
                            Select carrier first
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {
                                name: "MTN",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/MTN_Logo.svg/240px-MTN_Logo.svg.png",
                              },
                              {
                                name: "AIRTEL",
                                logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Airtel_logo.svg/240px-Airtel_logo.svg.png",
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
                              onChange={(e) => setCountryCode(e.target.value)}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#083A85] bg-white"
                            >
                              <option value="+250">🇷🇼 +250 (Rwanda)</option>
                              <option value="+254">🇰🇪 +254 (Kenya)</option>
                              <option value="+255">🇹🇿 +255 (Tanzania)</option>
                              <option value="+256">🇺🇬 +256 (Uganda)</option>
                              <option value="+257">🇧🇮 +257 (Burundi)</option>
                              <option value="+243">🇨🇩 +243 (DRC)</option>
                              <option value="+251">🇪🇹 +251 (Ethiopia)</option>
                              <option value="+27">🇿🇦 +27 (South Africa)</option>
                              <option value="+234">🇳🇬 +234 (Nigeria)</option>
                              <option value="+233">🇬🇭 +233 (Ghana)</option>
                              <option value="+225">
                                🇨🇮 +225 (Côte d'Ivoire)
                              </option>
                              <option value="+221">🇸🇳 +221 (Senegal)</option>
                            </select>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setErrors({});
                              }}
                              placeholder="7XX XXX XXX"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#083A85]"
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

                  {/* Card Option */}
                  <div
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      setPaymentMethod("card");
                      setErrors({});
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mt-1 w-5 h-5 accent-[#083A85] cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">Credit or debit card</h3>
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
                        <p className="text-sm text-gray-600">
                          Secure payment with Visa, Mastercard, or American
                          Express
                        </p>
                        {paymentMethod === "card" && (
                          <p className="text-xs text-blue-600 mt-2 font-medium">
                            You will be redirected to enter card details
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message for the guide */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-6">
                  Message for the guide
                </h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Share any special requests or let your guide know what
                    you're most excited about
                  </p>
                  <textarea
                    value={specialMessage}
                    onChange={(e) => setSpecialMessage(e.target.value)}
                    placeholder="Looking forward to the experience! Any tips for first-timers?"
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
                    Free cancellation up to 24 hours before the experience
                    starts.
                  </span>{" "}
                  After that, no refunds will be issued.
                </p>
                <button className="font-medium underline">Learn more</button>
              </div>

              {/* Ground rules */}
              <div className="border-t pt-8 pb-8">
                <h2 className="text-[22px] font-medium mb-4">
                  Experience rules
                </h2>
                <p className="text-gray-600 mb-4">
                  To ensure everyone has a great experience, please remember:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Arrive on time at the meeting point</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Follow all safety instructions from your guide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Respect other participants and local customs</span>
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
                    <button className="underline">Experience Rules</button>,{" "}
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
                    `Confirm and pay $${(
                      bookingData?.priceBreakdown?.total ||
                      bookingData?.totalAmount
                    )?.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Booking Summary */}
            <div className="lg:col-span-2">
              <div className="border rounded-xl p-6 sticky top-24">
                <div className="flex gap-4 pb-6 border-b">
                  <div className="w-28 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="bi bi-compass text-3xl text-gray-400"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">
                      {bookingData?.tourTitle}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      {bookingData?.tourDetails?.locationCity},{" "}
                      {bookingData?.tourDetails?.locationCountry}
                    </p>
                    {bookingData?.tourDetails?.difficulty && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getDifficultyBadge(
                          bookingData.tourDetails.difficulty
                        )}`}
                      >
                        {bookingData.tourDetails.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-6 border-b">
                  <h3 className="font-medium mb-4">Experience details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {new Date(
                          bookingData?.scheduleDate || ""
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">
                        {bookingData?.scheduleStartTime} -{" "}
                        {bookingData?.scheduleEndTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {Math.floor(
                          (bookingData?.tourDetails?.duration || 0) / 24
                        ) > 0
                          ? `${Math.floor(
                              (bookingData?.tourDetails?.duration || 0) / 24
                            )} days`
                          : `${bookingData?.tourDetails?.duration} hours`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group size</span>
                      <span className="font-medium">
                        {bookingData?.numberOfParticipants}{" "}
                        {bookingData?.numberOfParticipants === 1
                          ? "person"
                          : "people"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-6 border-b">
                  <h3 className="font-medium mb-4">Price details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">
                        ${bookingData?.pricePerPerson?.toFixed(2)} x{" "}
                        {bookingData?.numberOfParticipants} participants
                      </span>
                      <span>
                        ${bookingData?.priceBreakdown?.subtotal?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 underline">Taxes</span>
                      <span>
                        ${bookingData?.priceBreakdown?.taxes?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total (USD)</span>
                    <span className="text-base font-semibold">
                      $
                      {(
                        bookingData?.priceBreakdown?.total ||
                        bookingData?.totalAmount
                      )?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <i className="bi bi-shield-check text-[#083A85] text-lg mt-0.5"></i>
                    <div className="text-xs text-gray-600">
                      <p className="font-medium mb-1">
                        Your payment is protected
                      </p>
                      <p>All transactions are secure and encrypted</p>
                    </div>
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

export default TourPaymentPage;
