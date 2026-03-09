import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeInfo,
  CalendarDays,
  ChevronRight,
  Clock,
  EyeIcon,
  Globe,
  Home,
  LibraryBig,
  Users,
} from "lucide-react";
import { useRecommendedWebinars, useWebinarDetails } from "../hooks/hooks";
import { WebinarCard } from "../components";
import { Helmet } from "react-helmet-async";
import { useAuthStore } from "../store/authStore";
import api from "../config/axios";
import { useQueryClient } from "@tanstack/react-query";

const WebinarPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Fetch webinar details
  const {
    data: webinarDetails,
    isLoading: webinarLoading,
    error: webinarError,
  } = useWebinarDetails(slug);

  // Fetch recommendations based on webinar category
  const {
    data: recommendations = { recommended_blogs: [], recommended_webinars: [] },
    isLoading: recommendationsLoading,
  } = useRecommendedWebinars(webinarDetails?.category_id);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "TBD", time: "TBD" };
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = dateTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date, time };
  };

  const { date, time } = formatDateTime(webinarDetails?.webinar_date_time);
  const isPastWebinar =
    new Date(webinarDetails?.webinar_date_time) < new Date();

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    try {
      await api.post("student/attend-webinar", {
        webinar_id: webinarDetails.id,
      });

      // Refetch webinar details
      await queryClient.invalidateQueries(["webinarDetails", slug]);
    } catch (err) {
      console.error("Webinar registration failed:", err);
    }
  };

  if (webinarLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (webinarError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading webinar details. Please try again later.
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-1">
      <Helmet>
        <title>{webinarDetails.title || "Webinar"}</title>
        <meta name="title" content={webinarDetails.webinar_meta_title} />
        <meta
          name="description"
          content={webinarDetails.webinar_meta_description}
        />
        <meta name="keywords" content={webinarDetails.webinar_meta_keyword} />
        <meta property="og:url" content="https://innovstem.com/" />
        <meta property="og:site_name" content="InnovSTEM" />
      </Helmet>
      <div className="container mx-auto px-4 text-left my-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <motion.main
            className="lg:col-span-8 space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            {/* Breadcrumb Navigation */}
            <motion.nav
              className="flex"
              aria-label="Breadcrumb"
              variants={fadeInUp}
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center gap-2">
                  <Link
                    to="/"
                    className="inline-flex gap-2 items-center text-sm font-semibold text-slate-700"
                  >
                    <Home className="w-4 h-4 text-slate-600" />
                    Home
                  </Link>
                </li>
                <li className="inline-flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                  <Link
                    to="/webinars"
                    className="inline-flex gap-2 items-center text-sm font-semibold text-slate-700"
                  >
                    <LibraryBig className="w-4 h-4 text-slate-600" />
                    Webinars
                  </Link>
                </li>
              </ol>
            </motion.nav>

            {/* Webinar Details */}
            <motion.div
              className="flex flex-col gap-4 pb-0"
              variants={fadeInUp}
            >
              <motion.h1
                className="text-4xl font-bold text-secondary font-outfit"
                variants={fadeInUp}
              >
                {webinarDetails?.title}
              </motion.h1>
              <motion.p
                className="text-base text-slate-600 font-normal font-publicsans text-justify"
                variants={fadeInUp}
              >
                {webinarDetails?.webinar_description}
              </motion.p>
              <motion.div
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 text-gray-600 font-outfit"
                variants={fadeInUp}
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-base/5 font-medium text-primary/80 bg-primary/5 rounded-xl px-3 py-1">
                    <span>{webinarDetails?.category_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:ml-auto">
                  <p className="text-sm font-medium text-slate-600 pr-2">
                    Attendees:
                  </p>
                  <Users className="w-4 h-4 text-primary/80" />
                  <p className="text-base font-medium">
                    {webinarDetails?.attendance_count}
                    <span className="text-sm px-1">registered</span>
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex flex-row flex-wrap items-center gap-2 md:gap-2 text-gray-600 font-outfit"
                variants={fadeInUp}
              >
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <BadgeInfo className="w-5 h-5 text-primary/40" />
                  <span>
                    Updated{" "}
                    {webinarDetails?.updated_at
                      ? `${new Date(
                          webinarDetails.updated_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}`
                      : new Date().toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                  </span>
                </div>
                <div className="h-3 w-0.5 bg-primary/50"></div>
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary/40" />
                  <span>{date}</span>
                </div>
                <div className="h-3 w-0.5 bg-primary/50"></div>
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <Clock className="w-5 h-5 text-primary/40" />
                  <span>{time}</span>
                </div>
                <div className="h-3 w-0.5 bg-primary/50"></div>
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <Globe className="w-4 h-4 text-primary/40" />
                  <span>Online</span>
                </div>
                <div className="h-3 w-0.5 bg-primary/50"></div>
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <EyeIcon className="w-5 h-5 text-primary/40" />
                  <span>{webinarDetails?.view_count} views</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.hr className="border-secondary/10" variants={fadeInUp} />

            {/* Webinar Content */}
            <motion.div className="font-publicsans" variants={fadeInUp}>
              <motion.div
                className="border rounded-2xl shadow p-8"
                variants={fadeInUp}
              >
                <motion.div
                  className="space-y-8"
                  initial="hidden"
                  animate="visible"
                  variants={staggerChildren}
                >
                  <motion.div variants={fadeInUp}>
                    <h3 className="text-xl font-bold text-secondary/80 mb-4">
                      About This Webinar
                    </h3>
                    <div
                      className="text-base text-slate-600 mb-4 content"
                      dangerouslySetInnerHTML={{
                        __html: webinarDetails?.webinar_content,
                      }}
                    />
                  </motion.div>
                  {webinarDetails?.quiz && (
                    <motion.div variants={fadeInUp}>
                      <h3 className="text-xl font-bold text-secondary/80 mb-4">
                        Interactive Quiz
                      </h3>
                      <p className="text-base text-slate-600">
                        This webinar includes an interactive quiz to test your
                        knowledge. The quiz will be available during the live
                        session.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.main>

          {/* Sidebar */}
          <motion.aside
            className="lg:col-span-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="sticky top-8 space-y-10">
              {/* Webinar Registration Card */}
              <div>
                <div className="relative bg-cream/40 rounded-3xl mx-4 overflow-hidden">
                  <div className="absolute max-lg:-left-52 -bottom-56 lg:-left-1/2 w-[450px] h-[400px] bg-cream/80 rounded-full border-[120px] lg:border-[120px] border-primary/30 drop-shadow-md"></div>
                  <div className="absolute max-lg:-left-52 -top-40 lg:-right-32 w-[450px] h-[400px] bg-cream/70 rounded-full border-[120px] lg:border-[120px] border-primary/20 drop-shadow-md"></div>
                  <div className="backdrop-blur-2xl h-full">
                    <section className="relative container p-6 bg-transparent my-0">
                      <div className="flex flex-col justify-between items-start gap-4">
                        <img
                          src={`https://admin-dev.innovstem.com/storage/${webinarDetails?.webinar_thumbnail}`}
                          alt="Webinar thumbnail"
                          className="w-full rounded-lg"
                        />
                        <div className="w-full space-y-4">
                          <div className="flex flex-col gap-2 bg-white/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-5 h-5 text-primary/70" />
                              <span className="text-secondary font-medium">
                                {date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-primary/70" />
                              <span className="text-secondary font-medium">
                                {time}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={handleRegister}
                            disabled={
                              isPastWebinar || webinarDetails?.user_registered
                            }
                            className={`font-outfit font-medium text-cream text-center block w-full rounded-xl ${
                              webinarDetails?.user_registered
                                ? "bg-green-600 text-white"
                                : isPastWebinar
                                ? "bg-gray-500/20 text-secondary cursor-not-allowed"
                                : "bg-secondary/80 hover:bg-secondary"
                            } text-lg cursor-pointer py-3 px-4 transition-all duration-300 hover:shadow-lg focus:outline-none`}
                          >
                            {webinarDetails?.user_registered
                              ? "Registered"
                              : isPastWebinar
                              ? "Registration Closed!"
                              : "Register Now"}
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* Suggested Blogs */}
              <motion.div
                className="bg-cream/20 p-6 max-lg:hidden"
                variants={fadeInUp}
              >
                <h2 className="font-outfit text-left text-lg font-medium text-secondary">
                  Suggested Blogs
                </h2>
                <motion.div
                  className="flex flex-col gap-0 py-2"
                  variants={staggerChildren}
                >
                  {recommendations.recommended_blogs.slice(0, 3).map((blog) => (
                    <Link key={`blog-${blog.id}`} to={`/blogs/${blog.slug}`}>
                      <motion.div
                        className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 py-4 rounded-lg"
                        variants={fadeInUp}
                      >
                        <img
                          src={`https://admin-dev.innovstem.com/storage/${blog.thumbnail}`}
                          alt={`Suggested blog ${blog.title}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-publicsans font-semibold text-lg text-secondary line-clamp-1">
                            {blog.title}
                          </h3>
                          <p className="font-publicsans text-sm text-gray-600 line-clamp-2">
                            {blog.description}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.aside>
        </div>

        {/* Suggested Webinars Section */}
        <motion.div
          className="container px-2 pt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerChildren}
        >
          <motion.div variants={fadeInUp}>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <motion.p
                className="text-left font-publicsans text-3xl font-semibold text-secondary mb-4 sm:mb-0 pl-5"
                variants={fadeInUp}
              >
                Suggested Webinars
              </motion.p>
            </div>

            {/* Loading State */}
            {recommendationsLoading && (
              <div className="text-center text-gray-600">
                Loading suggested webinars...
              </div>
            )}

            {/* No Data State */}
            {!recommendationsLoading &&
              recommendations.recommended_webinars.length === 0 && (
                <div className="text-center text-gray-600">
                  No suggested webinars available.
                </div>
              )}

            {/* Render Webinars */}
            {!recommendationsLoading &&
              recommendations.recommended_webinars.length > 0 && (
                <motion.div
                  className="mx-auto grid max-w-2xl md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 lg:mx-0 lg:max-w-none text-left"
                  variants={staggerChildren}
                >
                  {recommendations.recommended_webinars
                    .slice(0, 3)
                    .map((item) => (
                      <motion.div
                        key={`webinar-${item.id}`}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <WebinarCard
                          key={item.id}
                          item={{
                            category: item.category_name,
                            readTime: item.created_at,
                            title: item.title,
                            date: item.webinar_date_time,
                            image: item.thumbnail,
                            description: item.description,
                            slug: item.slug,
                          }}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WebinarPage;
