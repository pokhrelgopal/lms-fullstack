import React from "react";

const WhyUs = () => {
  return (
    <section className="hidden md:block bg-emerald-900 mt-20 px-4 md:px-0">
      <h1 className="text-center text-white font-bold py-10">
        <span className="text-2xl"> Why choose us?</span>
        <div className="pt-5 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-36">
          <div>
            <p className="text-2xl font-bold">150+</p>
            <p className="text-sm font-thin">Online Courses</p>
          </div>
          <div>
            <p className="text-2xl font-bold">1520+</p>
            <p className="text-sm font-thin">Happy Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold">100+</p>
            <p className="text-sm font-thin">Certified Teachers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">60+</p>
            <p className="text-sm font-thin">Countries</p>
          </div>
        </div>
      </h1>
    </section>
  );
};

export default WhyUs;
