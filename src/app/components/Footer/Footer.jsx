import Image from "next/image";
import Link from "next/link";
import logo from "../../images/thiasil-13.webp"; // Replace with your logo image path


export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white px-5 md:px-10 py-10 h-[32rem]">
      <div className="flex flex-col items-center justify-between ">
        {/* Logo Section */}
        <div className="flex items-center justify-center">
          <Image
            src={logo}
            alt="Company Logo"
            className="w-20 md:w-[7rem] m-16"
          />
        </div>

        {/* Navigation and Info Section */}
        <div className="flex flex-col md:flex-row items-start justify-between">
          {/* Navigation Links */}
          <div className="flex flex-wrap text-center items-center justify-center text-nowrap space-x-4 text-sm uppercase border-t-2 pt-4">
            <Link
              href='/company'
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Company
            </Link>
            <Link
              href="/contact"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Contact Us
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative"
            >
              Terms
            </Link>
          </div>

          {/* Footer Info Section */}
          <div className="w-full md:w-1/3 text-sm border-t-2 pt-4 md:mt-0 mt-10">
            <p>
              Built by{" "}
              <Link
                href="#"
                className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md  transition-transform duration-300 ease-in-out relative"
              >
                SHARANG GUPTA
              </Link>{" "}
              using as a reference the course{" "}
              <span className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative">
                ADVANCED CSS AND SASS.
              </span>{" "}
              Copyright © by{" "}
              <span className="inline-block hover:rotate-6 hover:text-custom-blue hover:scale-125 hover:bg-[#333333] hover:shadow-md transition-transform duration-300 ease-in-out relative">
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
