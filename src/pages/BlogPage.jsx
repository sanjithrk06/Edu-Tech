import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { CourseCard } from "../components";
import bg from "../assets/images/hero.jpg";
import { useBlogDetails, useRecommendedCourses } from "../hooks/hooks";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const BlogPage = () => {
  const { blogSlug } = useParams();

  useEffect(() => {
    if (!blogSlug) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [blogSlug]);

  const { data: blog, isLoading } = useBlogDetails(blogSlug);

  const {
    data: recommendations = { recommended_blogs: [], recommended_courses: [] },
    isLoading: recommendationsLoading,
  } = useRecommendedCourses(blog?.category_id || null);

  if (isLoading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className="bg-gray-50 py-1">
      <Helmet>
        <title>{blog.title}</title>
        <meta name="title" content={blog.blog_meta_title} />
        <meta name="description" content={blog.blog_meta_description} />
        <meta name="keywords" content={blog.blog_meta_keyword} />
        <meta property="og:url" content="https://innovstem.com/" />
        <meta property="og:site_name" content="InnovSTEM" />
      </Helmet>
      <div className="container mx-auto px-4 text-left my-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-8">
            {/* Blog Title */}
            <div className="flex flex-col gap-5 pb-4">
              <h1 className="text-4xl font-bold text-secondary font-outfit">
                {blog.title}
              </h1>

              {/* Metadata and Social Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 text-gray-600 font-outfit">
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-lg font-medium text-primary">
                    <span>{blog.created_by}</span>
                  </div>
                  <div className="h-6 w-0.5 bg-gray-400"></div>
                  <div className="text-lg font-normal text-slate-600">
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:ml-auto">
                  <p className="text-lg font-medium text-slate-600">Share :</p>
                  <FaFacebook className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                  <FaTwitter className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                  <FaLinkedin className="w-5 h-5 cursor-pointer hover:text-blue-700" />
                  <FaInstagram className="w-5 h-5 cursor-pointer hover:text-pink-600" />
                </div>
              </div>
            </div>

            <div className="font-publicsans text-lg/8 text-slate-600 text-justify">
              <p>{blog.blog_description}</p>
            </div>

            {/* Featured Image */}
            {blog.blog_banner && (
              <div className="relative h-96 w-full">
                <img
                  src={`https://admin-dev.innovstem.com/storage/${blog.blog_banner}`}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded-none"
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="max-w-none text-justify">
              <div
                className="font-publicsans text-lg/8 text-slate-600 blogs"
                dangerouslySetInnerHTML={{ __html: blog.blog_content }}
              />
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-8 space-y-10">
              {/* Career Guidance Ad Card */}
              <div>
                <div
                  style={{ backgroundImage: `url(${bg})` }}
                  className="bg-no-repeat bg-cover h-40 rounded-2xl border border-black"
                >
                  <div className="bg-black/40 w-full h-full rounded-2xl p-6 flex flex-col gap-2">
                    <h2 className="text-cream font-outfit text-2xl font-semibold">
                      Level Up Your Career
                    </h2>
                    <p className="text-sm font-publicsans text-whiteDim/80">
                      Take your career to the next level with our professional
                      guidance services.
                    </p>
                    <Link
                      to="https://innovstem.edumilestones.com/"
                      className="font-outfit font-medium text-cream text-sm flex flex-row items-center gap-1 cursor-pointer py-2 shadow-2xl"
                    >
                      Know More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Suggested Blogs */}
              <motion.div className="bg-cream/20 p-6" variants={fadeInUp}>
                <h2 className="font-outfit text-left text-lg font-medium text-secondary">
                  Suggested Blogs
                </h2>
                <motion.div
                  className="flex flex-col gap-0 py-2"
                  variants={staggerChildren}
                >
                  {recommendations.recommended_blogs
                    .slice(0, 3)
                    .map((blog, index) => (
                      <Link key={index} to={`/blogs/${blog.slug}`}>
                        <motion.div
                          key={index}
                          className="flex gap-4 cursor-pointer hover:bg-gray-50 p-4 rounded-lg"
                          variants={fadeInUp}
                        >
                          <img
                            src={`https://admin-dev.innovstem.com/storage/${blog.thumbnail}`}
                            alt={`Suggested blog ${index + 1}`}
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
          </aside>
        </div>

        {/* Suggested Courses Section */}
        <div className="container px-2 pt-16">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <p className="text-left font-publicsans text-3xl font-semibold text-secondary mb-4 sm:mb-0 pl-5">
                Suggested Courses
              </p>
            </div>

            <div className="mx-auto grid max-w-2xl md:max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 pt-2 lg:mx-0 lg:max-w-none text-left">
              {!recommendationsLoading &&
                recommendations.recommended_courses.slice(0, 3).map((item) => (
                  <div key={item.id}>
                    <CourseCard
                      item={{
                        id: item.id,
                        name: item.title,
                        image: item.thumbnail,
                        avail: item.class_level_name,
                        category: [item.category_name],
                        description: item.content_short_description,
                        link: item.slug,
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
