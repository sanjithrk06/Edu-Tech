import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../assets/images";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/authStore";
import { Helmet } from "react-helmet-async";
import { GraduationCap } from "lucide-react";

const Register = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Added loading state
  const { signup, isAuthenticated } = useAuthStore();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      standard: "",
      ambition: "",
      mobile: "",
      parent_no: "",
      state: "",
      district: "",
      pincode: "",
      city: "",
      address: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const personalFields = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "Full Name",
      gridSpan: "col-span-full",
      validation: { required: "Name is required" },
    },
    {
      id: "age",
      label: "Age",
      type: "number",
      placeholder: "Age",
      gridSpan: "col-span-2",
      validation: {
        required: "Age is required",
        min: { value: 1, message: "Age must be positive" },
      },
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      placeholder: "Select Gender",
      options: ["Male", "Female", "Other"],
      gridSpan: "col-span-2",
      validation: { required: "Gender is required" },
    },
    {
      id: "standard",
      label: "Standard",
      type: "text",
      placeholder: "Class",
      gridSpan: "col-span-2",
      validation: { required: "Standard is required" },
    },
    {
      id: "ambition",
      label: "Ambition",
      type: "text",
      placeholder: "Software Developer, etc.....",
      gridSpan: "col-span-2",
      validation: { required: "Ambition is required" },
    },
    {
      id: "mobile",
      label: "Mobile",
      type: "tel",
      placeholder: "Enter Mobile Number",
      gridSpan: "col-span-2",
      validation: {
        required: "Mobile number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit mobile number",
        },
      },
    },
    {
      id: "parent_no",
      label: "Parent Number",
      type: "tel",
      placeholder: "Enter Parent's Contact Number",
      gridSpan: "col-span-2",
      validation: {
        required: "Parent number is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Enter a valid 10-digit mobile number",
        },
      },
    },
  ];

  const residentialFields = [
    {
      id: "state",
      label: "State",
      type: "text",
      placeholder: "Enter State",
      gridSpan: "col-span-2",
      validation: { required: "State is required" },
    },
    {
      id: "district",
      label: "District",
      type: "text",
      placeholder: "Enter District",
      gridSpan: "col-span-2",
      validation: { required: "District is required" },
    },
    {
      id: "pincode",
      label: "Pincode",
      type: "text",
      placeholder: "Enter Pincode",
      gridSpan: "col-span-2",
      validation: {
        required: "Pincode is required",
        pattern: {
          value: /^[0-9]{6}$/,
          message: "Enter a valid 6-digit pincode",
        },
      },
    },
    {
      id: "city",
      label: "City",
      type: "text",
      placeholder: "Enter City",
      gridSpan: "col-span-2",
      validation: { required: "City is required" },
    },
    {
      id: "address",
      label: "Address",
      type: "textarea",
      placeholder: "Enter Your Full Address",
      gridSpan: "col-span-full",
      validation: { required: "Address is required" },
    },
  ];

  const loginFields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Email Address",
      gridSpan: "col-span-full",
      validation: {
        required: "Email is required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Enter a valid email address",
        },
      },
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "*********",
      gridSpan: "col-span-full",
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    },
    {
      id: "confirm_password",
      label: "Confirm Password",
      type: "password",
      placeholder: "*********",
      gridSpan: "col-span-full",
      validation: {
        required: "Please confirm your password",
        validate: (value) =>
          value === getValues("password") || "Passwords do not match",
      },
    },
  ];

  const getStepTitle = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return "Personal Details";
      case 2:
        return "Residential Details";
      case 3:
        return "Login Details";
      default:
        return "";
    }
  };

  const getCurrentFields = () => {
    switch (step) {
      case 1:
        return personalFields;
      case 2:
        return residentialFields;
      case 3:
        return loginFields;
      default:
        return [];
    }
  };

  const handleNextStep = async () => {
    const fields = getCurrentFields().map((field) => field.id);
    const isValid = await trigger(fields);

    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true); // Set loading to true when submission starts
    setError(null); // Clear any previous errors
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirm_password,
        mobile: data.mobile,
        standard: data.standard,
        ambition: data.ambition,
        parent_no: data.parent_no,
        age: parseInt(data.age),
        gender: data.gender.toLowerCase(),
        district: data.district,
        address: data.address,
        state: data.state,
        city: data.city,
        pincode: data.pincode,
      });
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response.data.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false); // Set loading to false when submission completes or fails
    }
  };

  const renderFormFields = (fields) => (
    <div className="grid grid-cols-4 gap-4">
      {fields.map((field) => (
        <div key={field.id} className={field.gridSpan}>
          <label
            htmlFor={field.id}
            className="block text-base/6 font-medium text-slate-600 mb-1"
          >
            {field.label}
          </label>
          <div className="mt-1">
            {field.type === "select" ? (
              <select
                id={field.id}
                {...register(field.id, field.validation)}
                className={`block w-full rounded-lg bg-white border px-3 py-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-0 focus:outline-secondary/60 sm:text-base/6 ${
                  errors[field.id] && touchedFields[field.id]
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="" disabled>
                  {field.placeholder}
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.id}
                {...register(field.id, field.validation)}
                placeholder={field.placeholder}
                rows="3"
                className={`block w-full rounded-lg bg-white border px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-0 focus:outline-secondary/60 sm:text-base/8 ${
                  errors[field.id] && touchedFields[field.id]
                    ? "border-red-500"
                    : ""
                }`}
              />
            ) : (
              <input
                id={field.id}
                type={field.type}
                {...register(field.id, field.validation)}
                placeholder={field.placeholder}
                className={`block w-full rounded-lg bg-white border px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-0 focus:outline-secondary/60 sm:text-base/8 ${
                  errors[field.id] && touchedFields[field.id]
                    ? "border border-red-500"
                    : ""
                }`}
              />
            )}
            {errors[field.id] && touchedFields[field.id] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.id].message}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-cream/40 via-white to-cream/50 p-4 md:p-8">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-20">
        <div className="w-full md:w-1/2 max-w-md md:max-w-lg flex flex-col items-center justify-center max-md:hidden">
          <div className="m-8 text-center transform transition-all  duration-500">
            <div className="flex flex-row gap-2 justify-center items-center">
              <GraduationCap className=" text-secondary w-8 h-8" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-blue-500 bg-clip-text text-transparent">
                Student Portal
              </h2>
            </div>
            <p className="mt-2 text-secondary/70 font-medium">
              Access your courses, resources, and more
            </p>
          </div>
          <div className="relative transform transition-all duration-700">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-yellow-200 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-secondary/90 animate-pulse delay-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-blue-300/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={`${images.Login}`}
              alt="Student Learning"
              className="relative mx-auto w-full max-w-md rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl z-10"
            />
          </div>
        </div>
        <div className="w-full md:w-3/5 flex items-center justify-center my-auto">
          <div className="w-full bg-white rounded-3xl drop-shadow-lg md:mt-0 sm:max-w-3xl p-2 md:p-4 xl:p-6">
            <div className="p-6 space-y-4 md:space-y-4 sm:p-4">
              <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold leading-tight tracking-tight text-secondary font-outfit md:text-2xl">
                  {getStepTitle(step)}
                </h1>
                <div className="text-sm text-blue-600 font-medium">
                  Step {step} of 3
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gradient-to-r from-secondary to-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 font-publicsans text-left"
              >
                {renderFormFields(getCurrentFields())}
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}

                <div className="flex justify-between gap-4 pt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="w-full text-secondary bg-transparent ring-1 ring-secondary hover:ring-0 hover:bg-gradient-to-r hover:from-secondary hover:to-blue-500 hover:text-white duration-300 focus:ring-2 focus:outline-none focus:ring-primary-300 rounded-xl text-sm px-5 py-2.5 text-center font-semibold"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full text-white bg-gradient-to-r from-secondary to-blue-500 hover:bg-transparent duration-300 focus:ring-2 focus:outline-none focus:ring-primary-300 rounded-xl text-sm px-5 py-2.5 text-center font-semibold"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center text-white bg-gradient-to-r from-secondary to-blue-500 hover:bg-transparent duration-300 focus:ring-2 focus:outline-none focus:ring-primary-300 rounded-xl text-sm px-5 py-2.5 text-center font-semibold ${
                        loading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm font-publicsans font-light text-gray-500 text-center">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
