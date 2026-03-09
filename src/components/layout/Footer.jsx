import React from "react";
import { Mail, Phone, ChevronRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Section animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // List item animation variants
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Icon animation for social/contact links
  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-gradient-to-t from-cream/90 via-cream/70 to-cream/50 shadow-lg shadow-secondary/20 p-10 relative overflow-hidden"
    >
      {/* Subtle background overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.05)_0%,transparent_70%)]" />

      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center text-center gap-8 sm:gap-0 relative z-10"
      >
        {/* Logo and Info Section */}
        <motion.div
          variants={sectionVariants}
          className="lg:w-5/12 w-full flex flex-col items-center sm:text-start sm:items-start sm:px-4 py-6 lg:py-2 gap-4"
        >
          <Link to={"/#"}>
            <motion.img
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={logo}
              className="w-56 drop-shadow-lg"
              alt="Innovstem"
            />
          </Link>
          <motion.p
            variants={listItemVariants}
            className="text-base text-secondary/80 font-medium font-publicsans max-w-md"
          >
            Innovstem is a dynamic startup transforming everyday products by
            offering innovative, eco-friendly alternatives to traditional
            plastics.
          </motion.p>
          <motion.span
            variants={listItemVariants}
            className="text-sm text-secondary/80 font-medium font-publicsans"
          >
            © Copyright {new Date().getFullYear()}{" "}
            <motion.a
              whileHover={{ scale: 1.05, color: "#F5A623" }}
              href="/#"
              className="hover:underline"
            >
              Innovstem
            </motion.a>
          </motion.span>
        </motion.div>

        {/* Navigation Section */}
        <motion.div
          variants={sectionVariants}
          className="lg:w-4/12 sm:w-8/12 border-y-2 py-6 sm:py-2 sm:border-y-0 sm:border-r-2 lg:border-x-2 border-secondary/20 px-4 flex flex-col items-center justify-start gap-4"
        >
          <motion.h2
            variants={listItemVariants}
            className="text-xl font-semibold text-primary py-2 tracking-wide relative"
          >
            Navigation
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-12 bg-gradient-to-r from-primary to-[#F5A623]"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.h2>
          <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start sm:text-start gap-4 sm:gap-8">
            <motion.ul className="flex flex-col flex-wrap gap-3 lg:pl-4 font-normal">
              <motion.li
                variants={listItemVariants}
                whileHover={{ x: 5 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-primary/60" />
                </motion.div>
                <a href="/careers" className=" nav-content">
                  Careers
                </a>
              </motion.li>
              {["About", "Services", "Webinars"].map((item) => (
                <motion.li
                  key={item}
                  variants={listItemVariants}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary/60" />
                  </motion.div>
                  <a
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="nav-content"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.ul className="flex flex-col flex-wrap gap-3 lg:pl-4 font-normal max-md:hidden">
              {[
                "Career Guidance",
                "STEM Skills",
                "Defence Training",
                "Entrepreneurship",
              ].map((item) => (
                <motion.li
                  key={item}
                  variants={listItemVariants}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-primary/60" />
                  </motion.div>
                  <a
                    href={`/courses/${item.toLowerCase().replace(" ", "-")}`}
                    className=" nav-content"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          variants={sectionVariants}
          className="lg:w-3/12 sm:w-4/12 text-center flex flex-col py-6 lg:py-2 gap-4"
        >
          <motion.h2
            variants={listItemVariants}
            className="text-xl font-semibold text-primary py-2 tracking-wide relative"
          >
            Contact
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-12 bg-gradient-to-r from-primary to-[#F5A623]"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.h2>
          <motion.a
            href="tel:9150521167"
            variants={listItemVariants}
            className="flex flex-row items-center justify-center gap-2 text-secondary/80 hover:text-[#F5A623] transition-colors duration-200"
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <Phone className="w-5 h-5" />
            </motion.div>
            <span className="nav-content text-sm font-semibold">
              9150521167
            </span>
          </motion.a>
          <motion.a
            href="mailto:info@innovstem.com"
            variants={listItemVariants}
            className="flex flex-row items-center justify-center gap-2 text-secondary/80 hover:text-[#F5A623] transition-colors duration-200"
          >
            <motion.div variants={iconVariants} whileHover="hover">
              <Mail className="w-5 h-5" />
            </motion.div>
            <span className="nav-content text-sm font-semibold">
              info@innovstem.com
            </span>
          </motion.a>
          <motion.ul
            variants={listItemVariants}
            className="flex justify-center gap-3 pt-2"
          >
            <motion.li variants={iconVariants} whileHover="hover">
              <a
                href="https://www.instagram.com/innovstem?igsh=dnVjM2xwcGFidWIy"
                className="text-secondary/80 hover:text-hover transition-colors duration-200"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
