import { ArrowRight, Lock, CreditCard } from "lucide-react";
import React, { useState, useEffect } from "react";
import { formatDistance, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";

const ResourceCard = ({ item }) => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const formattedReadTime = formatDistance(
    parseISO(item.readTime),
    new Date(),
    { addSuffix: true }
  );

  // Check if this is a paid resource without access
  const isPaidResource = item.type === "paid" && !item.has_access;
  const resourcePrice = item.amount ? parseFloat(item.amount) : 0;

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src*="razorpay"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded successfully");
        setIsRazorpayLoaded(true);
      };
      script.onerror = (error) => {
        console.error("Failed to load Razorpay script:", error);
        setIsRazorpayLoaded(false);
      };
      document.head.appendChild(script);
    };

    if (isPaidResource) {
      loadRazorpay();
    }

    return () => {
      const script = document.querySelector('script[src*="razorpay"]');
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isPaidResource]);

  const handlePayment = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.Razorpay || !isRazorpayLoaded) {
      toast.error(
        "Payment gateway not loaded. Please refresh the page and try again."
      );
      return;
    }

    if (resourcePrice <= 0) {
      toast.error("Invalid resource price");
      return;
    }

    const amountInPaise = Math.round(resourcePrice * 100);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      setLoading(true);

      // Create order for resource payment
      const orderPayload = {
        amount: amountInPaise,
        currency: "INR",
        resource_id: item.key,
        type: "resource_purchase",
      };

      console.log("Creating order for resource:", orderPayload);

      const orderResponse = await api.post("resources/order", orderPayload);

      const { order_id, transaction_id } = orderResponse?.data?.data || {};
      if (!order_id) {
        throw new Error("Order ID not received from server");
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured");
      }

      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: "INR",
        name: "InnovSTEM Resources",
        description: `Purchase: ${item.title}`,
        order_id: order_id,
        handler: async (response) => {
          try {
            console.log("Payment response:", response);

            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            if (
              !razorpay_payment_id ||
              !razorpay_order_id ||
              !razorpay_signature
            ) {
              throw new Error("Incomplete payment response from Razorpay");
            }

            // Verify payment for resource
            const verificationPayload = {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              transaction_id,
            };

            const verificationResponse = await api.post(
              "resources/verify-payment",
              verificationPayload
            );

            if (verificationResponse?.data?.status === "success") {
              toast.success("Resource purchased successfully!");
              // Reload the page or update the component state to reflect the purchase
              window.location.reload();
            } else {
              const errorMsg =
                verificationResponse?.data?.message ||
                "Payment verification failed";
              console.error("Verification failed:", errorMsg);
              toast.error(errorMsg);
            }
          } catch (err) {
            console.error("Payment Verification Error:", err);
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Error verifying payment";
            toast.error(errorMessage);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "User", // You can get this from user context
          email: "user@example.com", // You can get this from user context
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed");
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        timeout: 300,
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("Payment Failed:", response);
        const errorDescription =
          response?.error?.description || "Payment failed. Please try again.";
        toast.error(`Payment failed: ${errorDescription}`);
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      let errorMessage = "Error initiating payment";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }

      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (isPaidResource) {
      return (
        <button
          onClick={handlePayment}
          disabled={loading || !isRazorpayLoaded}
          className="flex flex-row items-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-all duration-200"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Purchase ₹{resourcePrice}
            </>
          )}
        </button>
      );
    } else {
      return (
        <Link
          to={`/dashboard/resources/${item.slug}`}
          className="flex flex-row items-center gap-1 text-sm font-semibold text-secondary/80 hover:text-primary hover:cursor-pointer transition-colors duration-200"
        >
          Learn More <ArrowRight className="w-3 h-3" />
        </Link>
      );
    }
  };

  return (
    <div
      key={item.key}
      className={`py-6 px-2 lg:px-6 bg-transparent text-left flex flex-col lg:flex-row gap-4 h-full duration-300 hover:bg-whiteDim hover:shadow rounded-2xl relative ${
        isPaidResource ? "border border-primary/20" : ""
      }`}
    >
      {/* Paid Resource Overlay */}
      {isPaidResource && (
        <div className=" max-md:hidden absolute top-4 right-4 bg-primary text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
          <Lock className="w-3 h-3" />
          Paid
        </div>
      )}

      <div className="lg:w-2/6 overflow-hidden rounded-xl drop-shadow relative">
        <img
          src={`https://admin-dev.innovstem.com/storage/${item.image}`}
          alt={item.title}
          className={`w-full h-40 object-cover ${
            isPaidResource ? "opacity-75" : ""
          }`}
        />
        {isPaidResource && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="font-publicsans lg:w-4/6 flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center justify-start">
          <div className="text-sm font-semibold text-primary/90">
            {item.category}
          </div>
          <div className="text-xs font-medium text-gray-500">
            {formattedReadTime}
          </div>
          {isPaidResource && (
            <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              ₹{resourcePrice}
            </div>
          )}
        </div>

        <div className="text-lg font-outfit font-semibold line-clamp-2 text-secondary/90">
          {item.title}
        </div>

        <div className="text-sm/5 font-normal line-clamp-2 text-gray-600 text-justify">
          {isPaidResource
            ? `${item.description.substring(
                0,
                100
              )}... [Premium Content - Purchase to view full content]`
            : item.description}
        </div>

        <div className="mt-auto">{renderActionButton()}</div>

        {isPaidResource && !isRazorpayLoaded && (
          <div className="text-xs text-gray-500 mt-1">
            Loading payment gateway...
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
