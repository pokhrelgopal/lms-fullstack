import React from "react";

const Footer = () => {
  return (
    <div className="py-5 px-4 md:px-20 flex flex-col md:flex-row space-y-2 md:space-y-0 items-center justify-between bg-zinc-900 text-white">
      <p className="text-center">LearnHub platform by Gopal Pokhrel</p>
      <p>&copy; {new Date().getFullYear()} All rights reserved. </p>
    </div>
  );
};

export default Footer;
