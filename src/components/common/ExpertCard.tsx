"use client";

import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/types/user";
import Arrow from "@/public/assets/home/Arrow.svg";
import Facebook from "@/public/assets/home/Facebook.svg";
import Linkedin from "@/public/assets/home/Linkedin.svg";
import Mail from "@/public/assets/home/Mail.svg";

interface ExpertCardProps {
  name: string;
  profession: string;
  description: string;
  imageUrl: string;
  socialLinks?: SocialLinks;
  profileUrl?: string;
  isActive?: boolean;
}

const ExpertCard = ({
  name,
  profession,
  description,
  imageUrl,
  socialLinks,
  profileUrl = "#",
  isActive = false,
}: ExpertCardProps) => {
  return (
    <div
      className={`w-[419px] h-[482px] rounded-[12px] bg-white p-4 flex flex-col justify-between ${isActive ? "border-2 border-[#A18EFF]" : "border border-transparent"
        }`}
    >
      {/* Top Image */}
      <div className="w-full h-[207px] bg-[#F8F8F8] rounded-[12px] overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex flex-col mt-4">
        <h3 className="text-[24px] font-bold text-[#3858F8] leading-tight">
          {name}
        </h3>
        <p className="text-[16px] text-black font-medium mt-1">
          {profession}
        </p>
        <p className="text-[12px] text-[#6B6B6B] mt-2 leading-[15px]">
          {description}
        </p>
      </div>

      {/* Bottom row */}
      <div className="mt-4 flex items-center justify-between">
        {/* Social icons */}
        <div className="flex gap-3">
          <Link
            href={socialLinks?.linkedin || "#"}
            className="w-10 h-10 bg-[#F1F1F1] rounded-full flex items-center justify-center"
          >
            <Image src={Linkedin} alt="LinkedIn" width={16} height={16} />
          </Link>
          <Link
            href={socialLinks?.facebook || "#"}
            className="w-10 h-10 bg-[#F1F1F1] rounded-full flex items-center justify-center"
          >
            <Image src={Facebook} alt="Facebook" width={16} height={16} />
          </Link>
          <Link
            href={socialLinks?.email ? `mailto:${socialLinks.email}` : "#"}
            className="w-10 h-10 bg-[#F1F1F1] rounded-full flex items-center justify-center"
          >
            <Image src={Mail} alt="Email" width={16} height={16} />
          </Link>
        </div>

        {/* Arrow icon */}
        <Link
          href={profileUrl}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50 transition"
        >
          <Image src={Arrow} alt="Arrow" width={40} height={40} />
        </Link>
      </div>
    </div>
  );
};

export default ExpertCard;
