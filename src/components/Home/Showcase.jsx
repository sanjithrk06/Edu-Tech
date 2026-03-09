import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import certificateImage from "../../assets/images/certificate.jpg";

// Certificate image (replace with actual path or URL)
// const certificateImage = "https://via.placeholder.com/600x400"; // Placeholder for the certificate image

const Showcase = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants}
      className="bg-cream-100/20 py-16"
    >
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Content */}
        <motion.div
          variants={textVariants}
          className="font-light text-gray-500 sm:text-lg text-left lg:w-1/2"
        >
          <div className="relative w-full text-center lg:text-left mb-6">
            <span className="font-outfit uppercase text-xl tracking-widest text-primary font-medium block mb-2 mx-auto lg:mx-0">
              Our Achievements
            </span>
            <h2 className="font-outfit text-5xl font-semibold text-secondary leading-[3.25rem] lg:mb-6 mx-auto max-w-md lg:mx-0">
              Certified Excellence
            </h2>
          </div>
          <p className="font-publicsans indent-10 text-lg font-normal text-slate-500 mb-4 mx-3 text-justify">
            We are proud to announce that{" "}
            <b className="text-secondary/80">Founder of InnovSTEM</b> has been
            recognized as a{" "}
            <b className="text-secondary/80">Certified Career Analyst</b> by
            leading global organizations on March 1, 2025. This prestigious
            certification, accredited by{" "}
            <b className="text-secondary/80">BCPA (India)</b>,{" "}
            <b className="text-secondary/80">ACCPH (UK)</b>, and{" "}
            <b className="text-secondary/80">Edumilestones</b>.
          </p>
          <p className="font-publicsans indent-10 text-lg font-normal text-slate-500 mb-6 mx-3 text-justify">
            As organizational members of{" "}
            <b className="text-secondary/80">IAAP</b> and{" "}
            <b className="text-secondary/80">APCDA</b>, we are committed to
            providing top-tier career guidance and STEM education to empower the
            next generation of leaders.
          </p>
        </motion.div>

        {/* Certificate Image */}
        <motion.div
          variants={imageVariants}
          className="relative group lg:w-1/2 mx-3"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-lg border-4 border-cream/20">
            <img
              className="w-full transition-transform duration-300 group-hover:scale-105"
              src={certificateImage}
              alt="Certified Career Analyst Certificate"
            />
            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cream/20 to-cream/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
          </div>
          {/* Background Decorative Circle */}
          <div className=" max-md:hidden absolute -top-10 -left-10 w-40 h-40 bg-cream/40 rounded-full"></div>
          <div className=" max-md:hidden absolute -bottom-10 -right-10 w-40 h-40 bg-cream/40 rounded-full"></div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Showcase;
