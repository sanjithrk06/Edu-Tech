import React from "react";
import {
  AboutBelieve,
  AboutConnection,
  AboutWhat,
  AboutWhy,
  CareerBannar,
  VisionMission,
} from "../components";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | InnovSTEM</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="About Us | InnovSTEM" />
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
      <AboutWhy />
      <VisionMission />
      <AboutBelieve />
      <AboutConnection />
      <CareerBannar />
    </>
  );
};

export default About;
