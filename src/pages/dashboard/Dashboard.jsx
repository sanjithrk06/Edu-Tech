import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ChevronLeft,
  ChevronRight,
  Loader,
  GraduationCap,
  Video,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import api from "../../config/axios";
import { EnrolledCard } from "../../components";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, webinarsRes] = await Promise.all([
          api.get("student/courses"), 
          api.get("student/webinars"),
        ]);
        setCourses(coursesRes.data.data || []);
        setWebinars(webinarsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Student Dashboard</title>
      </Helmet>

      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Welcome to Your Dashboard
            </h1>
            <p className="mt-2 text-secondary/50 font-medium">
              Track your learning progress and upcoming webinars
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-2xl bg-white px-4 py-5 shadow-lg sm:p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <dt className="truncate text-sm font-semibold text-secondary/70">
                    Enrolled Courses
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {courses.length}
                  </dd>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white px-4 py-5 shadow-lg sm:p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                  <Video className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <dt className="truncate text-sm font-semibold text-secondary/70 ">
                    Enrolled Webinars
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {webinars.length}
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="mb-12 overflow-hidden rounded-xl bg-whiteDim border-2 border-whiteDim p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary">
                  Enrolled Courses
                </h2>
                <p className="mt-1 text-sm font-medium text-secondary/60">
                  Continue your learning journey
                </p>
              </div>

              {!loading && courses.length > 0 && (
                <div className="flex space-x-2">
                  <button className="courses-prev-btn rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="courses-next-btn rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : courses.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <h3 className="mt-2 text-sm font-semibold text-slate-800">
                  No courses enrolled
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by enrolling in a course
                </p>
                <div className="mt-6">
                  <Link
                    to={"/courses"}
                    className="inline-flex items-center rounded-md bg-secondary/80 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/80"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  prevEl: ".courses-prev-btn",
                  nextEl: ".courses-next-btn",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="courses-swiper"
              >
                {courses.map((item) => (
                  <SwiperSlide key={item.id} className=" mb-10">
                    <EnrolledCard
                      item={{
                        id: item.id,
                        name: item.title,
                        image: item.course_thumbnail,
                        description: item.content_short_description,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Enrolled Webinars Section */}
          <div className="overflow-hidden rounded-xl bg-whiteDim border-2 border-whiteDim p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary">
                  Enrolled Webinars
                </h2>
                <p className="mt-1 text-sm font-medium text-secondary/60">
                  Join interactive learning sessions
                </p>
              </div>

              {!loading && webinars.length > 0 && (
                <div className="flex space-x-2">
                  <button className="webinars-prev-btn rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="webinars-next-btn rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : webinars.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <h3 className="mt-2 text-sm font-semibold text-slate-800">
                  No webinars enrolled
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by enrolling in a webinar
                </p>
                <div className="mt-6">
                  <Link
                    to={"/webinars"}
                    className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/80 "
                  >
                    Browse Webinars
                  </Link>
                </div>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                  prevEl: ".webinars-prev-btn",
                  nextEl: ".webinars-next-btn",
                }}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="webinars-swiper"
              >
                {webinars.map((item) => (
                  <SwiperSlide key={item.id} className=" mb-10">
                    <EnrolledCard
                      item={{
                        id: item.id,
                        name: item.title,
                        date: item.webinar_date_time,
                        image: item.webinar_thumbnail,
                        description: item.webinar_description,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
