import React, { useEffect, useState } from "react";
import { BlogCard, TitleBanner } from "../components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useBlogs } from "../hooks/hooks";
import { Loader } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Blogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // Use the custom hook for fetching blogs
  const {
    data: blogsData,
    isLoading,
    isError,
  } = useBlogs(currentPage, searchTerm);

  // Derived state from blogsData
  const blogs = blogsData?.data || [];
  const totalPages = blogsData?.last_page || 0;
  const totalResults = blogsData?.total || 0;

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <>
      <Helmet>
        <title>Blogs | InnovSTEM</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Blogs | InnovSTEM" />
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
        title="Blogs"
        subtitle="Explore New Learning Horizons"
        description={
          "Dive into a world of inspiration with InnovSTEM’s blogs, packed with career tips, STEM insights, and success stories. Stay informed and motivated on your journey to a brighter future!"
        }
      />
      <div className="bg-gray-50 py-1 sm:py-1">
        <div className="container">
          {/* Search form */}
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
                  placeholder="Search blogs name..."
                />
              </div>
              <button
                type="submit"
                className="p-2.5 ms-2 text-sm font-medium bg-primary/10 rounded-3xl border text-primary border-primary/10 hover:border-primary outline-none"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
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

          {/* Error State */}
          {isError && (
            <div className="text-center py-10 text-red-500">
              Error loading blogs. Please try again later.
            </div>
          )}

          {/* Blogs Grid */}
          {!isLoading && blogs.length > 0 && (
            <div className="mx-auto grid max-w-2xl md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-6 pt-2 lg:mx-0 lg:max-w-none text-left">
              {blogs.map((blog) => (
                <div key={blog.id}>
                  <BlogCard
                    item={{
                      key: blog.id,
                      category: blog.category_name,
                      readTime: blog.created_at,
                      title: blog.title,
                      image: blog.thumbnail,
                      description: blog.description,
                      slug: blog.slug,
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && blogs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No blogs found
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 sm:px-6 my-8 font-publicsans">
              {/* Mobile Pagination */}
              <div className="flex flex-1 justify-center sm:hidden">
                <nav
                  aria-label="Pagination"
                  className="isolate inline-flex -space-x-px rounded-full shadow-xs"
                >
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-full px-2 py-2 text-gray-400 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon aria-hidden="true" className="size-5" />
                  </button>

                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      aria-current={currentPage === number ? "page" : undefined}
                      className={`relative inline-flex rounded-full items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === number
                          ? "bg-primary text-white z-10"
                          : "text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-full px-2 py-2 text-gray-400 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon aria-hidden="true" className="size-5" />
                  </button>
                </nav>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 9 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 9, totalResults)}
                    </span>{" "}
                    of <span className="font-medium">{totalResults}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    aria-label="Pagination"
                    className="isolate inline-flex -space-x-px rounded-full shadow-xs"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-full px-2 py-2 text-gray-400 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon aria-hidden="true" className="size-5" />
                    </button>

                    {getPageNumbers().map((number) => (
                      <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        aria-current={
                          currentPage === number ? "page" : undefined
                        }
                        className={`relative inline-flex rounded-full items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === number
                            ? "bg-primary text-white z-10"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-full px-2 py-2 text-gray-400 hover:bg-gray-100 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon aria-hidden="true" className="size-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;
