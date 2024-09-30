import Image from "next/image";
import logo from "../../images/blue_thiasil.webp"; // Replace with your logo image path

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white px-5 md:px-10 py-10 h-[32rem]">
      <div className="flex flex-col items-center justify-between ">
        <div className="flex items-center justify-center">
          <Image src={logo} alt="Company Logo" className="w-20 md:w-[7rem] m-16" />
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="flex flex-wrap text-center items-center justify-center text-nowrap space-x-4 text-sm uppercase border-t-2 pt-4">
            <a
              href="#"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative "
            >
              Company
            </a>
            <a
              href="#"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative "
            >
              Contact Us
            </a>
            <a
              href="#"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative "
            >
              Careers
            </a>
            <a
              href="#"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative "
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative "
            >
              Terms
            </a>
          </div>

          {/* Footer Info Section */}
          <div className="w-full md:w-1/3 text-sm border-t-2 pt-4 md:mt-0 mt-10">
            <p>
              Built by{" "}
              <a
                href="#"
                className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md  transition-transform duration-300 ease-in-out relative "
              >
                SHARANG GUPTA
              </a>{" "}
              using as a reference the course{" "}
              <span className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative ">
                ADVANCED CSS AND SASS.
              </span>{" "}
              Copyright © by{" "}
              <span className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative ">
                JONAS SCHMEDTMANN.
              </span>{" "}
              You are allowed to use this webpage for both personal and
              commercial use, but NOT to claim it as your own design.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
