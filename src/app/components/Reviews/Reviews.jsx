import img1 from "../../images/thiasil-10.jpg";
import img2 from "../../images/thiasil-11.jpg";
import Image from "next/image";
import "./Reviews.css";

export default function Reviews() {
  return (
    <div className="relative h-[70rem]  pb-10" id="reviews">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="video.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support the video */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#dcdddd] opacity-80"></div>

      {/* Review Cards */}
      <div className="relative h-full flex flex-col items-center justify-center text-custom-gray">
        <h2 className="text-center heading md:mt-0 mt-15 px-5 mb-5">
          We make our clients genuinely happy
        </h2>

        {/* Review Card 1 */}
        <div className="review-card">
          <div className="image-container">
            <Image src={img1} alt="Laboratory" className="review-image" />
            {/* Add the overlay */}
            <div className="overlay">
              <p>LABORATORY</p>
            </div>
          </div>
          <div className="review-text">
            <h3>HIGH QUALITY OF CRUCIBLES</h3>
            <p>
              Top-notch craftsmanship and scientific technique involved,
              crucibles are highly resistant to chemicals and heat. It's a
              must-have for any experimental work.
            </p>
          </div>
        </div>

{/* Review Card 2 */}
        <div className="review-card">
          <div className="image-container">
            <Image src={img2} alt="Cost Effective" className="review-image" />
            {/* Add the overlay */}
            <div className="overlay">
              <p>RESELLER</p>
            </div>
          </div>
          <div className="review-text">
            <h3>VERY COST EFFECTIVE!</h3>
            <p>
              Beats every other manufacturer in the price, without any
              compromise on quality. Highly recommended to order.
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button
            href="#"
            className="custom-link text-sm inline-flex items-center justify-center p-2 text-custom-blue hover:bg-custom-blue hover:text-white hover:shadow-md hover:translate-y-[-4px] transition duration-300 ease-in-out"
          >
            Read all stories →
          </button>
        </div>
      </div>
    </div>
  );
}
