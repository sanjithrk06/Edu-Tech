"use client";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import api from "../../config/axios";
import { ArrowLeft, Eye, Folder, ExternalLink, Calendar } from "lucide-react";

const ResourcesPage = () => {
  const { slug } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`resources/d/${slug}`);
        setResource(response.data?.data);
      } catch (error) {
        console.error("Failed to fetch resource:", error.response.data);
        setError(
          error.response.data.message ||
            "We couldn't load this resource. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-4 text-gray-600 font-publicsans">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
            Resource Not Available
          </h2>
          <p className="text-gray-600 mb-6 font-publicsans">{error}</p>
          <Link
            to="/resources"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-outfit rounded-xl shadow hover:bg-primary/90 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-gray-400 text-5xl mb-4">?</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">
            Resource Not Found
          </h2>
          <p className="text-gray-600 mb-6 font-publicsans">
            We couldn't find the resource you're looking for. It may have been
            moved or deleted.
          </p>
          <Link
            to="/resources"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-outfit rounded-xl shadow hover:bg-primary/90 transition"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse All Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{resource.resource_meta_title || "Resource"} | InnovSTEM</title>
        <meta name="title" content={resource.resource_meta_title} />
        <meta name="description" content={resource.resource_meta_description} />
        <meta name="keywords" content={resource.resource_meta_keyword} />
        <meta property="og:url" content="https://innovstem.com/" />
        <meta property="og:site_name" content="InnovSTEM" />
      </Helmet>

      <div className="mx-auto px-4 py-8 max-w-5xl">
        <div className="flex item-start pl-5">
          <Link
            to="/dashboard/resources"
            className="inline-flex items-center justify-center font-medium text-secondary/70 hover:text-primary transition font-publicsans"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources
          </Link>
        </div>
        <div className="p-6 z-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-secondary font-outfit mb-2 drop-shadow-md">
            {resource.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-primary/90 text-whiteDim text-xs font-medium px-3 py-1 rounded-full">
              {resource.category_name}
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Meta Information */}
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 font-publicsans">
              <div className="flex items-center">
                <Folder className="h-4 w-4 mr-2 text-primary/70" />
                <span>
                  Category:{" "}
                  <span className="font-medium">{resource.category_name}</span>
                </span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2 text-primary/70" />
                <span>
                  <span className="font-medium">{resource.view_count}</span>{" "}
                  Views
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary/70" />
                <span>
                  Published:{" "}
                  <span className="font-medium">
                    {formatDate(resource.created_at)}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-6">
            <p className="text-base text-gray-700 font-publicsans leading-relaxed border-l-4 border-primary/20 pl-4 italic">
              {resource.resource_description}
            </p>
          </div>

          <div className=" rounded-xl overflow-hidden m-8 shadow-lg">
            {resource.resource_banner && (
              <>
                <img
                  src={`https://admin-dev.innovstem.com/storage/${resource.resource_banner}`}
                  alt={resource.title}
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                />
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="px-6 py-6">
            <div
              className="prose prose-lg max-w-none font-publicsans prose-headings:font-outfit prose-headings:text-secondary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: resource.resource_content }}
            />
          </div>

          {/* External Link */}
          <div className="px-6 py-8 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-outfit mb-1">
                  Want to learn more?
                </h3>
                <p className="text-sm text-gray-600 font-publicsans">
                  Access the complete resource for in-depth information
                </p>
              </div>
              <a
                href={resource.resource_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-outfit rounded-xl shadow hover:bg-primary/90 transition group"
              >
                Access Full Resource
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
