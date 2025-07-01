import Button from "../MainButton/Button";

export default function HeroContent() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full h-full">
      <h1 className="text-5xl md:text-6xl leading-[102px] letter-spacing mt-[-7rem] mb-0 md:mb-5 hero-animation text-animate-left">
        THIASIL
      </h1>
      <p className="text-base md:text-xl leading-5 md:leading-10 letter-spacing_subheading font-semibold mb-10 hero-animation text-animate-right">
        INDIVIDUALLY OXY-GAS <br /> FIRED LABWARE
      </p>

      <div className="hero-animation button-animate-bottom">
        <Button
          name="Discover our products"
          color="#777777"
          bgColor="#ffffff"
          textSize="text-sm md:text-base"
          padding="px-7 md:px-10 py-3 md:py-5"
          href="/products"
        />
      </div>
    </div>
  );
}