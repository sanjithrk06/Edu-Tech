import React, { useEffect } from "react";
import { ServiceContent, ServiceHero } from "../components";
import { Helmet } from "react-helmet-async";

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <Helmet>
        <title>Services</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Services | InnovSTEM" />
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
      <ServiceHero />
      <ServiceContent />
    </>
  );
};

export default Services;
