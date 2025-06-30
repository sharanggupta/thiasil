import Image from "next/image";

export default function HeroLogo({ logoImage }) {
  return (
    <div className="absolute top-8 left-6 md:left-10 z-20">
      <Image src={logoImage} alt="Thiasil Logo" width={40} height={40} />
    </div>
  );
}