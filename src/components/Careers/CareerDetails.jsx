import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  ArrowLeft,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useCareerDetails } from "../../hooks/hooks";
import { Button } from "@headlessui/react";
import ApplicationForm from "./ApplicationForm";

const CareerDetails = ({ career, onBackClick }) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const {
    data: detailedCareer,
    isLoading: loading,
    error,
  } = useCareerDetails(career.id, {
    initialData: career.description ? career : undefined,
  });

  const handleApplyNow = () => {
    setShowApplicationForm(true);
    setTimeout(() => {
      const formElement = document.getElementById("application-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-publicsans text-red-500">
          {error.message || "Failed to load job details. Please try again."}
        </p>
        <Button
          onClick={onBackClick}
          className="mt-4 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200"
        >
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Details */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Button
                onClick={onBackClick}
                className="mb-4 -ml-2 text-blue-800 hover:bg-blue-50 p-2 px-3 rounded-lg group flex items-center transition-all duration-200"
              >
                <ArrowLeft
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                  size={18}
                />
                <span>Back to Jobs</span>
              </Button>
              <h2 className="text-3xl font-bold font-outfit text-blue-800 mb-3">
                {detailedCareer.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-gray-600 font-publicsans">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-blue-800" size={18} />
                  {detailedCareer.location}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-blue-800" size={18} />
                  {detailedCareer.employment_type}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={handleApplyNow}
                className="bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-6 py-2.5 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Apply Now
              </Button>
            </div>
          </div>

          {/* Job highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
            <motion.div className="bg-blue-50 p-4 rounded-xl flex items-center shadow-sm">
              <div className="bg-blue-100 p-2.5 rounded-lg mr-3 shadow-sm">
                <Calendar className="text-blue-800" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-800/70">Posted</p>
                <p className="font-medium text-blue-800">April 10, 2025</p>
              </div>
            </motion.div>
            <motion.div className="bg-blue-50 p-4 rounded-xl flex items-center shadow-sm">
              <div className="bg-blue-100 p-2.5 rounded-lg mr-3 shadow-sm">
                <Users className="text-blue-800" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-800/70">Domain</p>
                <p className="font-medium text-blue-800">
                  {detailedCareer.domain}
                </p>
              </div>
            </motion.div>
            <motion.div className="bg-blue-50 p-4 rounded-xl flex items-center shadow-sm">
              <div className="bg-blue-100 p-2.5 rounded-lg mr-3 shadow-sm">
                <GraduationCap className="text-blue-800" size={20} />
              </div>
              <div>
                <p className="text-sm text-blue-800/70">Experience</p>
                <p className="font-medium text-blue-800">
                  {detailedCareer.experience}+ Years
                </p>
              </div>
            </motion.div>
          </div>

          {/* Job overview */}
          <div className="bg-blue-50 p-5 rounded-xl mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <Briefcase className="mr-2" size={18} />
              Job Overview
            </h3>
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: detailedCareer.description }}
            />
          </div>

          {/* <div
            className="prose max-w-none font-publicsans text-gray-700 border-t pt-6"
            dangerouslySetInnerHTML={{ __html: detailedCareer.description }}
          /> */}

          <div className="mt-8 md:hidden">
            <Button
              onClick={handleApplyNow}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-5 py-2.5 font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Application Form */}
      <AnimatePresence>
        {showApplicationForm && (
          <motion.div
            id="application-form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <ApplicationForm
              careerId={detailedCareer.id}
              jobTitle={detailedCareer.title}
              onBackClick={onBackClick}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerDetails;
