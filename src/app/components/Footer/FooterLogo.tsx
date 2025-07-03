import Image from "next/image";
import logo from "@/app/images/thiasil-13.webp";

export default function FooterLogo() {
  return (
    <div className="flex justify-center items-center mb-8">
      <Image
        src={logo}
        alt="Thiasil Logo"
        className="w-20 md:w-28"
      />
    </div>
  );
}