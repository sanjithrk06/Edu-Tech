import React, { useEffect, useState } from "react";
import { TitleBanner, WebinarCard } from "../components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useWebinars } from "../hooks/hooks";
import { Loader } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Webinars = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch webinars using React Query
  const { data, isLoading } = useWebinars(currentPage, searchTerm);

  useEffect(() => {
    window.scroll(0, 0);
  }, [data]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < data?.last_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!data) return [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(data.last_page, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <>
      <Helmet>
        <title>Webinars</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Webinars | InnovSTEM" />
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
      <TitleBanner
        title={"Webinars"}
        subtitle={"Explore New Learning Horizons"}
        description={
          "Join InnovSTEM’s engaging webinars to connect with industry leaders and explore cutting-edge career trends. Gain exclusive insights and answers to fuel your aspirations in real time!"
        }
      />
      <div className="bg-gray-50 py-1 sm:py-1">
        <div className="container">
          {/* Search Form */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-left font-publicsans text-2xl text-secondary mb-4 sm:mb-0 pl-5">
              All Results
            </p>
            <form
              onSubmit={handleSearch}
              className="flex items-center max-w-xl w-full px-5 sm:px-0"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border-b border-gray-300 text-secondary text-sm rounded-none focus:bg-primary/5 focus:border-primary outline-none block w-full p-2.5"
                  placeholder="Search webinars..."
                />
              </div>
              <button
                type="submit"
                className="p-2.5 ms-2 text-sm font-medium bg-primary/10 rounded-3xl border text-primary border-primary/10 hover:border-primary outline-none"
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>

          {/* Loading State */}
          {isLoading && <Loader className="mx-auto text-secondary w-8 h-8" />}

          {/* Webinars Grid */}
          {!isLoading && data?.data?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {data.data.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  item={{
                    category: webinar.category_name,
                    readTime: webinar.created_at,
                    title: webinar.title,
                    image: webinar.webinar_thumbnail,
                    date: webinar.webinar_date_time,
                    description: webinar.webinar_description,
                    slug: webinar.webinar_slug,
                  }}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && data?.data?.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No webinars found
            </div>
          )}

          {/* Pagination */}
          {!isLoading && data?.last_page > 1 && (
            <div className="flex items-center justify-center gap-4 my-8 font-publicsans">
              {/* Previous Button */}
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    currentPage === number
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={nextPage}
                disabled={currentPage === data.last_page}
                className="px-3 py-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Webinars;
