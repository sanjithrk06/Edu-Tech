import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Briefcase,
  Filter,
} from "lucide-react";
import { useCareers } from "../../hooks/hooks";
import { Button, Input } from "@headlessui/react";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CareersList = ({ onJobSelect, setPage, setSearchTerm }) => {
  const [searchTerm, setLocalSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [page, setLocalPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: careersData,
    isLoading: loading,
    error,
  } = useCareers(page, searchTerm);
  const careers = careersData || [];
  const totalPages = careersData?.total_pages || 1;

  const filteredCareers = careers.filter((career) =>
    career.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setLocalPage(1);
    setPage(1);
    setSearchTerm(searchTerm);
  };

  const clearFilters = () => {
    setLocalSearchTerm("");
    setLocationFilter("");
    setLocalPage(1);
    setPage(1);
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    setLocalPage(newPage);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="text-center py-10"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-xl font-publicsans text-red-500">
          {error.message || "Failed to load jobs. Please try again."}
        </p>
        <Button
          className="mt-4 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="mb-10"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-outfit text-blue-800">
            Available Positions
          </h2>
          {/* <Button
            onClick={() => setShowFilters(!showFilters)}
            className="border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200 flex items-center gap-2"
          >
            <Filter size={16} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button> */}
        </div>

        {/* {showFilters && (
          <motion.form
            onSubmit={handleSearch}
            className="grid grid-cols-6 gap-4 p-4 bg-blue-50 rounded-xl mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="col-span-6 md:col-span-3">
              <label
                htmlFor="search"
                className="block text-base font-medium text-gray-600 mb-1"
              >
                Search Jobs
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search for jobs..."
                  className="pl-10 block w-full rounded-lg bg-white border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-6 md:col-span-2">
              <label
                htmlFor="location"
                className="block text-base font-medium text-gray-600 mb-1"
              >
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  id="location"
                  type="text"
                  placeholder="Location"
                  className="pl-10 block w-full rounded-lg bg-white border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="col-span-6 md:col-span-1 flex items-end">
              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-4 py-2.5 font-semibold transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </motion.form>
        )} */}
      </motion.div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              className="bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="p-6 text-left relative">
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {career.domain}
                </div>
                <div className="flex items-start">
                  <div className="mr-4 mt-1 bg-blue-50 p-3 rounded-xl">
                    <Briefcase className="text-blue-800" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold font-outfit text-blue-800 mb-2 group-hover:text-blue-900 transition-colors duration-300">
                      {career.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 mb-4 text-gray-600 font-publicsans">
                      <div className="flex items-center">
                        <MapPin className="mr-2 text-blue-800" size={18} />
                        {career.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 text-blue-800" size={18} />
                        {career.employment_type}
                      </div>
                    </div>
                    <Button
                      onClick={() => onJobSelect(career)}
                      className="bg-blue-800 hover:bg-blue-900 text-white rounded-lg px-5 py-2.5 font-semibold transition-all duration-200 flex items-center gap-2"
                    >
                      View Details
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-10"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-xl font-publicsans text-gray-600">
              No jobs found matching your criteria.
            </p>
            <Button
              className="mt-4 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center gap-4 mt-8"
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="self-center font-publicsans text-gray-700">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CareersList;
