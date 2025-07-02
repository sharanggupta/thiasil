import Image from "next/image";

export default function HeroBackground({ backgroundImage }) {
  return (
    <div className="absolute inset-0 bg-image-clippath">
      <Image
        src={backgroundImage}
        alt="Lab Background"
        fill
        className="object-cover"
        quality={85}
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-clip-path"></div>
    </div>
  );
}