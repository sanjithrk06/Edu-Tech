import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Sparkles, GraduationCap } from "lucide-react";
import { useCareers } from "../hooks/hooks";
import { CareerDetails, CareersList } from "../components";
import { images } from "../assets/images";
import { Helmet } from "react-helmet-async";
// import banner from "../assets/"

export default function CareersPage() {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: careersData,
    isLoading: loading,
    error,
  } = useCareers(page, searchTerm);

  const handleJobSelect = (career) => {
    setSelectedCareer(career);
    window.scrollTo(0, 0);
  };

  const handleBackToJobs = () => {
    setSelectedCareer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/20">
      <Helmet>
        <title>Careers | InnovSTEM</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Careers | InnovSTEM" />
        <meta
          name="description"
          content="InnovSTEM offers innovative K-12 STEM education programs and curriculum to inspire future innovators."
        />
        <meta
          name="keywords"
          content="STEM education, K-12 STEM curriculum, STEM programs, science education, InnovSTEM"
        />
        <meta property="og:url" content="https://innovstem.com/" />
        <meta property="og:site_name" content="InnovSTEM" />
      </Helmet>
      {/* Page Header */}
      <div
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${images.Career})` }}
      >
        {/* Animated background blur elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
          <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-blue-600 blur-xl" />
          <div className="absolute right-20 top-20 w-60 h-60 rounded-full bg-blue-400 blur-xl" />
          <div className="absolute left-1/3 bottom-5 w-40 h-40 rounded-full bg-blue-300 blur-xl" />
        </div>

        {/* Overlay to darken the background for better text contrast */}
        <div className="absolute inset-0 bg-secondary/70 z-0" />

        {/* Main content */}
        <div className="relative z-10 bg-black/50 mx-auto px-4 md:px-8 py-20">
          <motion.h1
            className="text-4xl md:text-6xl font-bold font-outfit text-center mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl font-publicsans text-center max-w-3xl mx-auto text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Be part of our mission to empower young minds with future-ready
            skills and shape the next generation of innovators.
          </motion.p>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-8 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute -left-20 top-40 w-40 h-40 rounded-full bg-blue-800/5 blur-xl" />
        <div className="absolute right-0 bottom-20 w-60 h-60 rounded-full bg-blue-800/5 blur-xl" />

        <motion.div
          className="w-full bg-white rounded-2xl shadow-lg sm:max-w-6xl mx-auto p-6 md:p-8 relative z-10 border border-blue-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-800 font-medium">
                Loading opportunities...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-xl font-publicsans text-red-500">
                {error.message ||
                  "Failed to load career opportunities. Please try again later."}
              </p>
            </div>
          ) : selectedCareer ? (
            <CareerDetails
              career={selectedCareer}
              onBackClick={handleBackToJobs}
            />
          ) : (
            <CareersList
              onJobSelect={handleJobSelect}
              setPage={setPage}
              setSearchTerm={setSearchTerm}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
