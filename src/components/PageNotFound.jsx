import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-white font-bold text-2xl">
                Looks like you've found the doorway to the great nothing
              </h1>
              <p className="my-2 text-white">
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>
              <button
                onClick={() => {
                  navigate("/page1");
                }}
                className="mt-[40%] sm:w-full lg:w-auto m-auto border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
              >
                Take me there!
              </button>
            </div>
          </div>
          <div>
            <img
              className="mix-blend-difference"
              src="https://i.ibb.co/G9DC8S0/404-2.png"
            />
          </div>
        </div>
      </div>
      <div>
        <img
          className="mix-blend-luminosity"
          src="https://i.ibb.co/ck1SGFJ/Group.png"
        />
      </div>
    </div>
  );
};

export default PageNotFound;
