import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeInfo,
  Check,
  ChevronRight,
  Globe,
  GraduationCap,
  Home,
  LibraryBig,
  Users,
} from "lucide-react";
import { CourseCard } from "../components";
import { useCourseDetails, useRecommendedCourses } from "../hooks/hooks";
import CourseQuiz from "./CourseQuiz";
import { Helmet } from "react-helmet-async";
import { useAuthStore } from "../store/authStore";
import api from "../config/axios";
import { useQueryClient } from "@tanstack/react-query";

const CoursePage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [activeTab, setActiveTab] = useState("overview");
  const [activeQuiz, setActiveQuiz] = useState(null);

  const defaultLearningPoints = [
    "Understanding programming fundamentals",
    "Basic coding concepts",
    "Introduction to problem-solving",
    "Basic algorithm design",
    "Foundational coding skills",
  ];

  const defaultQuizzes = [
    {
      title: "Introduction to Programming",
      questions: 10,
      timeLimit: "20 mins",
      difficulty: "Beginner",
    },
  ];

  const {
    data: courseDetails,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseDetails(slug);

  const {
    data: recommendations = { recommended_blogs: [], recommended_courses: [] },
    isLoading: recommendationsLoading,
  } = useRecommendedCourses(courseDetails?.category_id);

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

  const learningPoints =
    courseDetails?.learning_materials
      ?.split("@$")
      .map((item) => item.trim())
      .filter(Boolean) || defaultLearningPoints;

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading course details. Please try again later.
      </div>
    );
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    try {
      await api.post("student/enroll-course", {
        course_id: courseDetails.id,
      });

      // Refetch course details
      await queryClient.invalidateQueries(["courseDetails", slug]);
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  return (
    <div className="bg-gray-50 py-1">
      <Helmet>
        <title>{courseDetails.title || "Course"}</title>
        <meta name="title" content={courseDetails.course_meta_title} />
        <meta
          name="description"
          content={courseDetails.course_meta_description}
        />
        <meta name="keywords" content={courseDetails.course_meta_keyword} />
        <meta property="og:url" content="https://innovstem.com/" />
        <meta property="og:site_name" content="InnovSTEM" />
      </Helmet>
      <div className="container mx-auto px-4 text-left my-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.main
            className="lg:col-span-8 space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
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
                    to="/services"
                    className="inline-flex gap-2 items-center text-sm font-semibold text-slate-700"
                  >
                    <LibraryBig className="w-4 h-4 text-slate-600" />
                    Courses
                  </Link>
                </li>
              </ol>
            </motion.nav>

            <motion.div
              className="flex flex-col gap-4 pb-0"
              variants={fadeInUp}
            >
              <motion.h1
                className="text-4xl font-bold text-secondary font-outfit"
                variants={fadeInUp}
              >
                {courseDetails?.title}
              </motion.h1>

              <motion.p
                className="text-base text-slate-600 font-normal font-publicsans text-justify"
                variants={fadeInUp}
              >
                {courseDetails?.content_short_description}
              </motion.p>

              <motion.div
                className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 text-gray-600 font-outfit"
                variants={fadeInUp}
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-base/5 font-medium text-primary/80 bg-primary/5 rounded-xl px-3 py-1">
                    <span>{courseDetails?.category_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 md:ml-auto">
                  <p className="text-sm font-medium text-slate-600 pr-2">
                    Attendees:
                  </p>
                  <Users className="w-4 h-4 text-primary/80" />
                  <p className="text-base font-medium">
                    20<span className="text-sm px-1">registered</span>
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
                    {courseDetails?.updated_at
                      ? `${new Date(
                          courseDetails.updated_at
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
                  <GraduationCap className="w-5 h-5 text-primary/40" />
                  <span>
                    <b>{courseDetails?.enrolment_count}</b> Learners
                  </span>
                </div>
                <div className="h-3 w-0.5 bg-primary/50"></div>
                <div className="text-sm font-normal text-slate-600 flex flex-row items-center gap-2">
                  <Globe className="w-4 h-4 text-primary/40" />
                  <span>{courseDetails?.class_level_name}</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.hr className="border-secondary/10" variants={fadeInUp} />

            <motion.div className="font-publicsans" variants={fadeInUp}>
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === "overview"
                      ? "bg-cream/30 text-primary"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    activeTab === "quizzes"
                      ? "bg-cream/30 text-primary"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("quizzes")}
                >
                  Quizzes
                </button>
              </div>

              <motion.div
                className="border rounded-2xl shadow p-8"
                variants={fadeInUp}
              >
                {activeTab === "overview" ? (
                  <motion.div
                    className="space-y-8"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                  >
                    <motion.div variants={fadeInUp}>
                      <div
                        className="text-base text-slate-600 mb-4 content"
                        dangerouslySetInnerHTML={{
                          __html: courseDetails?.course_content,
                        }}
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <h3 className="text-xl font-bold text-secondary/80 mb-4">
                        What You'll Learn
                      </h3>
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-3"
                        variants={staggerChildren}
                      >
                        {learningPoints.map((point, index) => (
                          <motion.div
                            key={`learning-point-${index}`} // Added unique key
                            className="flex items-center gap-2"
                            variants={fadeInUp}
                          >
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-slate-600">{point}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerChildren}
                  >
                    <h3 className="text-xl font-bold text-secondary/80">
                      Course Quizzes
                    </h3>

                    {!activeQuiz ? (
                      !courseDetails?.quiz ||
                      courseDetails.quiz.length === 0 ? (
                        <p className="text-gray-600 italic">
                          No quizzes available for this course.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {courseDetails.quiz.map((quiz, index) => (
                            <motion.div
                              key={`quiz-${index}`}
                              className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              variants={fadeInUp}
                              onClick={() => {
                                if (isAuthenticated) {
                                  setActiveQuiz(quiz);
                                } else {
                                  navigate("/auth/login");
                                }
                              }}
                            >
                              <h4 className="font-medium text-secondary">
                                {quiz.quiz_title}
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                                <span>
                                  {quiz.number_of_questions} Question
                                  {quiz.number_of_questions > 1 ? "s" : ""}
                                </span>
                                <span>
                                  Score:{" "}
                                  {quiz.score !== -1
                                    ? quiz.score + "%"
                                    : "Not Attempted"}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    ) : (
                      <CourseQuiz
                        quiz={activeQuiz}
                        onBack={() => setActiveQuiz(null)}
                      />
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.main>

          <motion.aside
            className="lg:col-span-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="sticky top-8 space-y-10">
              <div className="">
                <div className="relative bg-cream/40 rounded-3xl mx-4 overflow-hidden">
                  <div className="absolute max-lg:-left-52 -bottom-56 lg:-left-1/2 w-[450px] h-[400px] bg-cream/80 rounded-full border-[120px] lg:border-[120px] border-primary/30 drop-shadow-md"></div>
                  <div className="absolute max-lg:-left-52 -top-40 lg:-right-32 w-[450px] h-[400px] bg-cream/70 rounded-full border-[120px] lg:border-[120px] border-primary/20 drop-shadow-md"></div>
                  <div className="backdrop-blur-2xl h-full">
                    <section className="relative container p-6 bg-transparent my-0">
                      <div className="flex flex-col justify-between items-start gap-4">
                        <img
                          src={`https://admin-dev.innovstem.com/storage/${courseDetails.course_banner}`}
                          alt="Course thumbnail"
                          className="w-full rounded-lg"
                        />
                        <button
                          onClick={handleRegister}
                          className={`font-outfit font-medium text-cream text-center block w-full rounded-xl ${
                            courseDetails.user_registered
                              ? "bg-green-600 text-white"
                              : " bg-secondary/80 hover:bg-secondary"
                          } text-lg cursor-pointer py-3 px-4 transition-all duration-300   hover:shadow-lg focus:outline-none`}
                        >
                          {courseDetails.user_registered
                            ? "Registered"
                            : "Enroll Now"}
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

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
                Suggested Courses
              </motion.p>
            </div>

            <motion.div
              className="mx-auto grid max-w-2xl md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 lg:mx-0 lg:max-w-none text-left"
              variants={staggerChildren}
            >
              {!recommendationsLoading &&
                recommendations.recommended_courses.slice(0, 3).map((item) => (
                  <motion.div
                    key={`course-${item.id}`} // Added unique key
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CourseCard
                      item={{
                        id: item.id,
                        name: item.title,
                        avail: item.class_level_name,
                        image: item.thumbnail,
                        link: item.slug,
                        category: [item.category_name],
                        description: item.content_short_description,
                      }}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CoursePage;
