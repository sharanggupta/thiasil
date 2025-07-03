export default function HamburgerIcon({ active, onClick, theme = "default" }) {
  const isProductsTheme = theme === "products";
  const hamburgerBg = isProductsTheme ? "bg-blue-200/80" : "bg-white";
  const barColor = isProductsTheme ? "bg-blue-900" : "bg-black";

  return (
    <div
      className={`fixed z-40 right-4 md:right-16 top-[1.1rem] md:top-16 h-[60px] w-[60px] md:h-[70px] md:w-[70px] flex flex-col justify-center items-center cursor-pointer rounded-full shadow-2xl ${hamburgerBg} transition-all duration-300 ease-in-out`}
      onClick={onClick}
    >
      <div
        className={`w-6 md:w-8 h-[2px] ${barColor} transition-transform duration-300 ease-in-out ${
          active ? "transform rotate-45 translate-y-2" : ""}`}
      ></div>
      <div
        className={`w-6 md:w-8 h-[2px] ${barColor} my-[7px] transition-opacity duration-300 ease-in-out ${
          active ? "opacity-0" : ""}`}
      ></div>
      <div
        className={`w-6 md:w-8 h-[2px] ${barColor} transition-transform duration-300 ease-in-out ${
          active ? "transform -rotate-45 -translate-y-2" : ""}`}
      ></div>
    </div>
  );
}