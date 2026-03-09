import React, { useEffect } from "react";
import {
  HomeAbout,
  HomeBlogs,
  HomeCourses,
  HomeHero,
  OurTeams,
  Showcase,
  StatsCounter,
  Testimonials,
} from "../components";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomeCourses />
      <HomeBlogs />
      <StatsCounter />
      <Showcase />
      <OurTeams />
      {/* <Testimonials /> */}
    </>
  );
};

export default Home;
